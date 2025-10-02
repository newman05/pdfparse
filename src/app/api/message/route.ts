import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { getPineconeClient } from "@/lib/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const { fileId, message } = SendMessageValidator.parse(body);

    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    await db.message.create({
      data: {
        text: message,
        isUserMessage: true,
        userId,
        fileId,
      },
    });

    // 1. Vectorize and retrieve context
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: "text-embedding-004",
    });

    const pinecone = getPineconeClient();
    const pineconeIndex = pinecone.Index("quill");

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: file.id,
    });

    const results = await vectorStore.similaritySearch(message, 4);

    // 2. Get previous messages
    const prevMessages = await db.message.findMany({
      where: { fileId },
      orderBy: { createdAt: 'asc' },
      take: 6,
    });

    // 3. Construct the prompt for the model
    const prompt = `
Use the following pieces of context to answer the user's question in markdown format.
If you don't know the answer, just say that you don't know; don't make up an answer.

----------------
PREVIOUS CONVERSATION:
${prevMessages.map((msg) =>
  msg.isUserMessage ? `User: ${msg.text}` : `Assistant: ${msg.text}`
).join('\n')}
----------------
CONTEXT:
${results.map((r) => r.pageContent).join('\n\n')}
----------------
USER INPUT: ${message}
`;

    // 4. Stream the response using Google's native SDK
    console.log('🤖 Creating Gemini stream...');
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContentStream(prompt);

    // 5. Create a readable stream and accumulate text
    let accumulatedText = '';
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            accumulatedText += chunkText;
            controller.enqueue(encoder.encode(chunkText));
          }
          
          // Save to DB after streaming completes
          console.log('✅ Gemini response completed');
          try {
            await db.message.create({
              data: {
                text: accumulatedText,
                isUserMessage: false,
                fileId,
                userId,
              },
            });
            console.log('💾 Message saved to DB');
          } catch (error) {
            console.error('Failed to save message to database:', error);
          }
          
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });
    // logs for posting
    console.log('📤 Returning stream response...');
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
};