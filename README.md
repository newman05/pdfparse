# PdfParse

A lightweight web app for interacting with PDF documents using AI-powered search and chat. Upload PDFs, extract searchable content, and ask natural-language questions about them.

This README focuses on getting you up and running locally and contributing. 

## Highlights

- Upload PDFs and extract text for retrieval
- Semantic search using embeddings
- Chat interface to ask questions about documents
- Dashboard to manage uploaded files and view chat history

## Tech overview

- Next.js (App Router) + TypeScript
- tRPC for backend procedures
- Prisma + PostgreSQL for persistence
- Pinecone (or any vector DB) for vector search
- Google Gemini (or compatible embeddings/LLM) for AI
- UploadThing for file uploads

Core integrations are implemented in `src/lib` and `src/api`.

## Quick start (local)

Requirements:
- Node.js 18+ (or newest LTS)
- A PostgreSQL instance (local or cloud)
- API keys for services you plan to use (Gemini/Pinecone/UploadThing). You can run parts of the app without all services for local testing.

1. Clone and install

```powershell
git clone https://github.com/yourusername/pdfparse.git
cd pdfparse
npm install
```

2. Create a `.env.local` in the project root and add the values you have. Example variables used by this project:

```text
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"

# Optional: Kinde Auth (or your preferred auth provider)
KINDE_CLIENT_ID=""
KINDE_CLIENT_SECRET=""
KINDE_ISSUER_URL=""

# AI / Vector services
GEMINI_API_KEY=""
PINECONE_API_KEY=""
PINECONE_ENVIRONMENT=""

# UploadThing
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
```

Tip: You can leave external services blank to run UI and internal flows; features that depend on those services will be disabled or return placeholder behavior.

3. Prepare the database

```powershell
npx prisma generate
npx prisma db push
```

4. Run the app

```powershell
npm run dev

# Open http://localhost:3001
```

## Project layout (short)

- `src/app` — Next.js routes and pages
- `src/components` — UI components (chat, PDF viewer, navbar, etc.)
- `src/lib` — Integrations and helpers (Gemini, Pinecone, Stripe, etc.)
- `src/trpc` — tRPC router and procedures
- `prisma/schema.prisma` — database schema

## Usage (typical)

1. Sign up or sign in (if auth configured)
2. Upload a PDF from the Dashboard
3. Wait for the file to be processed (text extraction + embeddings)
4. Open the document and ask questions in the chat UI

Notes:
- If you don't configure a vector DB, search features will be limited to whatever local storage or fallbacks are implemented.

## Environment variables reference

See `.env.example` (if present) or inspect `src/lib` and `src/api` for the set of variables the app reads. Common names: `DATABASE_URL`, `GEMINI_API_KEY`, `PINECONE_API_KEY`, `UPLOADTHING_*`, `KINDE_*`.

## Tests & linting

- Run linter: `npm run lint`
- Run unit tests (if present): `npm test` or check `package.json` scripts

## Contributing

Contributions are welcome. Recommended workflow:

1. Fork the repo
2. Create a feature branch
3. Open a PR with a clear description of the change

If you add integrations that require secrets, document them in the README and prefer `.env.local` for local testing.

## License

MIT — see the `LICENSE` file.

## Acknowledgements

- Built with Next.js, tRPC and Prisma
- UI utilities from shadcn/ui
- AI integrations demonstrated with Google Gemini and Pinecone (replaceable)
# PdfParse - Chat with Your PDFs

A modern web application that allows you to have intelligent conversations with your PDF documents using AI. Built with Next.js, TypeScript, and powered by Google's Gemini AI.

## Features

- **PDF Upload & Processing**: Upload PDF documents and have them processed for intelligent querying
- **AI-Powered Chat**: Ask questions about your documents and get accurate, context-aware responses
- **Real-time Conversations**: Interactive chat interface with message history
- **Document Management**: Dashboard to manage all your uploaded PDFs
- **Responsive Design**: Mobile-friendly interface that works seamlessly across all devices
- **Secure Authentication**: User authentication powered by Kinde Auth
- **Vector Search**: Efficient document search using Pinecone vector database

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **React PDF** - PDF rendering and viewing

### Backend
- **tRPC** - End-to-end typesafe APIs
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Pinecone** - Vector database for semantic search
- **Google Gemini AI** - AI model for document understanding

### Infrastructure
- **Kinde Auth** - Authentication and user management
- **UploadThing** - File upload handling
- **Stripe** - Payment processing
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Pinecone account
- Google Gemini API key
- Kinde Auth account
- UploadThing account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pdfparse.git
cd pdfparse

2.Install dependencies:
npm install

3.Set up environment variables:
# Database
DATABASE_URL="your_postgresql_url"

# Kinde Auth
KINDE_CLIENT_ID="your_kinde_client_id"
KINDE_CLIENT_SECRET="your_kinde_client_secret"
KINDE_ISSUER_URL="your_kinde_issuer_url"
KINDE_SITE_URL="http://localhost:3001"
KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3001"
KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3001/dashboard"

# Google Gemini
GEMINI_API_KEY="your_gemini_api_key"

# Pinecone
PINECONE_API_KEY="your_pinecone_api_key"

# UploadThing
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"

# Stripe (optional)
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"

4.Set up the database:
npx prisma generate

npx prisma db push

5. Run the development server:
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

6.Open http://localhost:3001 in your browser

Project Structure
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   └── chat/        # Chat-related components
├── lib/             # Utility functions and integrations
│   ├── gemini.ts    # Gemini AI integration
│   ├── pinecone.ts  # Pinecone vector DB
│   └── stripe.ts    # Stripe payment processing
├── trpc/            # tRPC API routes and procedures
├── db/              # Database configuration
└── config/          # Application configuration


Usage
1.Sign Up/Login: Create an account or sign in using Kinde Auth
2.Upload PDF: Navigate to the dashboard and upload your PDF document
3.Wait for Processing: The system will process your PDF and prepare it for querying
4.Start Chatting: Once processed, click on your document and start asking questions
5.View History: All your conversations are saved and can be accessed anytime


Key Features Explained
PDF Processing
PDFs are uploaded via UploadThing
Text is extracted and split into chunks
Embeddings are generated using Google's Gemini AI
Vectors are stored in Pinecone for efficient retrieval
AI Chat
User questions are converted to embeddings
Relevant document sections are retrieved from Pinecone
Context is provided to Gemini AI for accurate responses
Streaming responses for better user experience
Document Management
View all uploaded documents in the dashboard
Delete documents when no longer needed
Track upload and processing status
Access chat history for each document
Scripts
npm run dev - Start development server
npm run build - Build for production
npm run start - Start production server
npm run lint - Run ESLint
Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
License
This project is licensed under the MIT License.
Acknowledgments
Built with Next.js
UI components from shadcn/ui
AI powered by Google Gemini
Vector search by Pinecone
