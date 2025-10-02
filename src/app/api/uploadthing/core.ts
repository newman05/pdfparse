import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db } from "@/db";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { getPineconeClient } from "@/lib/pinecone";
import { PineconeStore } from "@langchain/pinecone";

const f = createUploadthing()

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // console.log("🔒 MIDDLEWARE: Starting authentication check")
      const { getUser } = getKindeServerSession()
      const user = await getUser()

      // console.log("👤 MIDDLEWARE: User ID:", user?.id)

      if (!user || !user.id) throw new Error("Unauthorized")

      // console.log("✅ MIDDLEWARE: Authentication successful")
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // console.log("\n========================================")
      // console.log("📤 UPLOAD COMPLETE")
      // console.log("File key:", file.key)
      // console.log("File URL:", file.ufsUrl)
      // console.log("User ID:", metadata.userId)
      // console.log("========================================\n")

      // console.log("💾 [1/6] Creating file record in database...")
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.ufsUrl,
          uploadStatus: "PROCESSING",
        }
      })
      // console.log("✅ File created with ID:", createdFile.id)

      try {
        // console.log("\n📥 [2/6] Fetching PDF from URL...")
        // console.log("Fetching from:", file.ufsUrl)
        const response = await fetch(file.ufsUrl)
        // console.log("Response status:", response.status, response.statusText)
        
        const blob = await response.blob()
        // console.log("✅ PDF fetched. Size:", blob.size, "bytes")

        // console.log("\n📄 [3/6] Loading PDF with PDFLoader...")
        const loader = new PDFLoader(blob)
        const pageLevelDocs = await loader.load()
        const pagesAmt = pageLevelDocs.length
        // console.log("✅ PDF loaded successfully")
        // console.log("   - Total pages:", pagesAmt)
        // console.log("   - First page text preview:", pageLevelDocs[0]?.pageContent?.substring(0, 100) + "...")

        console.log("\n🔌 [4/6] Connecting to Pinecone...")
        const pinecone = getPineconeClient()
        const pineconeIndex = pinecone.Index("quill")
        // console.log("✅ Pinecone client initialized")
        // console.log("   - Index name: quill")
        // console.log("   - Namespace:", createdFile.id)

        // console.log("\n🤖 [5/6] Creating Gemini embeddings...")
        const embeddings = new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GOOGLE_API_KEY,
          modelName: "text-embedding-004",
        })
        // console.log("✅ Embeddings model initialized")
        // console.log("   - Model: text-embedding-004")
        // console.log("   - Expected dimensions: 768")

        // console.log("\n💾 [6/6] Indexing to Pinecone...")
        // console.log("This may take 10-30 seconds depending on PDF size...")
        // const startTime = Date.now()
        
        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: createdFile.id
        })
        
        // const endTime = Date.now()
        // const duration = ((endTime - startTime) / 1000).toFixed(2)
        // console.log("✅ Successfully indexed to Pinecone!")
        // console.log("   - Duration:", duration, "seconds")

        // console.log("\n🎉 Updating file status to SUCCESS...")
        await db.file.update({
          data: {
            uploadStatus: "SUCCESS"
          },
          where: {
            id: createdFile.id
          }
        })
        // console.log("✅ File status updated")
        // console.log("\n========================================")
        // console.log("✨ PROCESS COMPLETED SUCCESSFULLY")
        // console.log("========================================\n")

      } catch (err) {
     
           // console.error("\n❌ ========================================")
        // console.error("ERROR OCCURRED DURING PROCESSING")
        // console.error("========================================")
        // console.error("Error type:", err?.constructor?.name)
        // console.error("Error message:", err instanceof Error ? err.message : String(err))
        if (err instanceof Error && err.stack) {
          console.error("\nStack trace:")
          console.error(err.stack)
        }
        
        // console.error("\nFull error object:")
        // console.error(err)
        // console.error("========================================\n")

        // console.log("💔 Updating file status to FAILED...")
        await db.file.update({
          data: {
            uploadStatus: "FAILED",
          },
          where: {
            id: createdFile.id,
          }
        })
        // console.log("✅ File status updated to FAILED")
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;