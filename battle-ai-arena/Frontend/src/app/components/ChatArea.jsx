import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';

export function ChatArea({ messages }) {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pt-8">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center -mt-10 animate-in fade-in duration-700">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <span className="text-3xl">⚔️</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-on-surface mb-3 tracking-tight">
            Welcome to the AI Arena
          </h2>
          <p className="text-on-surface-variant tracking-wide font-sans text-center max-w-sm">
            Enter a coding problem below to see two AI models battle for the best solution.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto flex flex-col justify-end pb-2">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </main>
  );
}
