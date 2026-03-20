import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'


const Dashboard = () => {
  const chat = useChat()
  const [chatInput, setChatInput] = useState('')
  const [hoveredChatId, setHoveredChatId] = useState(null)
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoading = useSelector((state) => state.chat.isLoading)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const handleSubmitMessage = (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) {
      return
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenchat(chatId, chats)
  }

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this chat?')) {
      chat.handleDeleteChat(chatId)
    }
  }

  const handleNewChat = () => {
    chat.handleNewChat()
  }

  return (
    <main className='min-h-screen w-full bg-[#112] p-3 text-white md:p-5'>
      <section className='mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 rounded-2xl overflow-hidden shadow-2xl md:h-[calc(100vh-2.5rem)] md:gap-6'>
        <aside className='hidden h-full w-72 shrink-0 rounded-2xl bg-[#01011b] p-4 md:flex md:flex-col border border-white/5'>
          <div className='mb-6'>
            <h1 className='text-3xl font-bold tracking-tight bg-[#720ada] bg-clip-text text-transparent'>Perplexity</h1>
          </div>

          <button
            onClick={handleNewChat}
            className='w-full mb-4 rounded-xl border border-purple-500/50 bg-[#113] px-4 py-3 text-center font-semibold text-white transition-all duration-200 hover:border-purple-400 hover:from-purple-600/40 hover:to-blue-600/40 hover:shadow-lg hover:shadow-purple-500/20'
          >
            + New Chat
          </button>

          <div className='space-y-2 flex-1 overflow-y-auto'>
            {Object.values(chats).map((chatItem) => (
              <div
                key={chatItem.id}
                onMouseEnter={() => setHoveredChatId(chatItem.id)}
                onMouseLeave={() => setHoveredChatId(null)}
                className='group relative'
              >
                <button
                  onClick={() => { openChat(chatItem.id) }}
                  type='button'
                  className={`w-full text-left rounded-xl px-3 py-2.5 text-base font-medium transition-all duration-200 ${currentChatId === chatItem.id
                      ? 'bg-[#080821] text-white shadow-lg shadow-purple-500/10'
                      : 'border border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <p className='truncate pr-8'>{chatItem.title}</p>
                </button>

                {hoveredChatId === chatItem.id && (
                  <button
                    onClick={(e) => handleDeleteChat(e, chatItem.id)}
                    className='absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-red-600/80 p-1.5 text-white transition-all duration-200 hover:bg-red-700 shadow-lg'
                    title='Delete chat'
                  >
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </aside>

        <section className='relative flex h-full min-w-0 flex-1 flex-col gap-4'>
          <div className='messages flex-1 space-y-4 overflow-y-auto pr-1 pb-36'>
            {currentChatId && chats[currentChatId]?.messages ? (
              chats[currentChatId].messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm md:text-base backdrop-blur-sm ${message.role === 'user'
                        ? 'rounded-br-none bg-[#05052c] text-white shadow-lg shadow-purple-500/10'
                        : 'rounded-bl-none bg-white/10 border border-white/10 text-white/90 shadow-lg shadow-white/5'
                      }`}
                  >
                    {message.role === 'user' ? (
                      <p>{message.content}</p>
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                          ul: ({ children }) => <ul className='mb-2 list-disc pl-5'>{children}</ul>,
                          ol: ({ children }) => <ol className='mb-2 list-decimal pl-5'>{children}</ol>,
                          code: ({ children }) => <code className='rounded bg-black/40 px-2 py-1 font-mono text-sm text-purple-200'>{children}</code>,
                          pre: ({ children }) => <pre className='mb-2 overflow-x-auto rounded-xl bg-black/50 p-3 border border-white/10'>{children}</pre>
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className='flex h-full items-center justify-center'>
                <div className='text-center'>
                  <p className='text-6xl font-semibold text-white/60 mb-2'>Perplexity</p>
                  <p className='text-white/40'>Click "New Chat" or open an existing chat to begin</p>
                </div>
              </div>
            )}
          </div>

          {isLoading && (
            <div className='flex justify-start'>
              <div className='rounded-2xl rounded-bl-none bg-white/10 border border-white/10 px-4 py-3 shadow-lg'>
                <div className='flex items-center gap-2'>
                  <div className='flex gap-1'>
                    <span className='w-2 h-2 bg-purple-400 rounded-full animate-bounce'></span>
                    <span className='w-2 h-2 bg-purple-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></span>
                    <span className='w-2 h-2 bg-purple-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className='text-sm text-white/70 ml-2'>Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <footer className='rounded-2xl w-full border border-white/10 bg-[#0f0f2a] p-4 md:p-5 shadow-2xl'>
            <form onSubmit={handleSubmitMessage} className='flex flex-col gap-3 md:flex-row'>
              <input
                type='text'
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder='Ask me anything...'
                className='w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-lg text-white outline-none transition placeholder:text-white/30 focus:border-purple-400/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20'
              />
              <button
                type='submit'
                disabled={!chatInput.trim()}
                className='rounded-xl border border-purple-500/50 bg-[#228] px-6 py-3 text-lg font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:from-purple-600/50 disabled:to-blue-600/50'
              >
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default Dashboard