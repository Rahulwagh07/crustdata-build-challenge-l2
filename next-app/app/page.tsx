import ChatInterface from './components/chat-interface'

export default function Home() {
  return (
    <div className="h-screen">
      <main className="h-full p-4">
        <div className="h-full max-w-3xl mx-auto space-y-4">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              Crustdata API Support
            </h1>
          </div>
          <div className="h-[calc(100%-4rem)]">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  )
}

