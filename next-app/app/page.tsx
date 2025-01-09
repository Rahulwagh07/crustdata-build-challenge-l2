import Actions from '@/components/actions'
import ChatInterface from '../components/chat-interface'

export default function Home() {
  return (
    <div className="h-screen">
      <main className="h-full p-4">
        <div className="h-full w-full md:max-w-3xl mx-auto space-y-4">
          <div className="text-center">
            <h1 className="text-xl md:text-3xl font-bold">
              Crustdata Level 2
            </h1>
          </div>
          <div className="flex md:justify-center">
          <Actions />
          </div>
          <div className="h-[calc(100%-8rem)] w-full">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  )
}

