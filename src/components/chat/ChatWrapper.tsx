'use client'


import { ChevronLeft, Loader2, XCircle } from "lucide-react"
import ChatInput from "./ChatInput"
import Messages from "./Messages"
import { trpc } from "@/app/_trpc/client"
import { buttonVariants } from "../ui/button"
import Link from "next/link"
import { ChatContextProvider } from "./ChatContext"
import { file } from "zod/v4"


interface ChatWrapperProps{
  fileId: string
}


const ChatWrapper = ({fileId}: ChatWrapperProps) => {

 const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
  { fileId },
  {
    refetchInterval: (query) => {
      return query.state.data?.status === "SUCCESS" || 
             query.state.data?.status === "FAILED" 
        ? false 
        : 500;
    },
  }
);

  if(isLoading) return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2" >
      <div className="flex-1 flex justify-center items-center flex-col mb-28" >
        <div className="flex flex-col items-center gap-2" >
          <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
          <h3 className="font-semibold text-xl" >Loading...</h3>
          <p className="text-zinc-500 text-sm">
            We are preparing your PDF.
          </p>
        </div>
      </div>

      <ChatInput isDisabled />

    </div>
  )

  if(data?.status === "PROCESSING") return (
       <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2" >
      <div className="flex-1 flex justify-center items-center flex-col mb-28" >
        <div className="flex flex-col items-center gap-2" >
          <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
          <h3 className="font-semibold text-xl" >Processing PDF</h3>
          <p className="text-zinc-500 text-sm">
            This will not take much long 👍
          </p>
        </div>
      </div>

      <ChatInput isDisabled />

    </div>
  )

  if(data?.status=== "FAILED") return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2" >
      <div className="flex-1 flex justify-center items-center flex-col mb-28" >
        <div className="flex flex-col items-center gap-2" >
          <XCircle className='h-8 w-8 text-red-500' />
          <h3 className="font-semibold text-xl" >Standard plan.</h3>
          <p className="text-zinc-500 text-sm">
            Buy the <span className="font-medium"> Pro </span>plan
          </p>
          <Link href='/dashboard' className={buttonVariants({
            variant: "secondary",
            className:"mt-4"
          })} ><ChevronLeft className="h-3 w-3 mr-1.5"/>Back</Link>
        </div>
      </div>

      <ChatInput isDisabled />

    </div>
  )

  return  (
  <ChatContextProvider fileId={fileId}>
  <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
    <div className='flex-1 flex justify-center items-center flex-col mb-28'>
      <Messages fileId={fileId} />
    </div>

    <ChatInput />
  
  </div>
  </ChatContextProvider>
  )
}

export default  ChatWrapper 