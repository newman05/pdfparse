import { GoogleGenerativeAI } from "@google/generative-ai";

export const model = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!).getGenerativeModel({ 
  model: "gemini-1.5-flash" 
});
