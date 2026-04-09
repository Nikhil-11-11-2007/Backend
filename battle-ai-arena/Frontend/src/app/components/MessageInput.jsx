import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

export function MessageInput({ onSendMessage }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text.trim());
      setText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 sticky bottom-0">
      <form 
        onSubmit={handleSubmit}
        className="relative bg-surface-container-lowest shadow-[0px_12px_32px_rgba(43,52,55,0.06)] rounded-full flex items-center transition-all duration-300 focus-within:ring-1 focus-within:ring-outline/20"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a coding problem..."
          className="w-full bg-transparent outline-none py-4 pl-6 pr-14 resize-none h-14 font-sans text-on-surface placeholder:text-outline max-h-32 rounded-full overflow-hidden leading-relaxed"
          rows={1}
        />
        <button 
          type="submit" 
          disabled={!text.trim()}
          className="absolute right-2 p-3 bg-primary text-on-primary rounded-full hover:bg-primary-dim transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-sm"
        >
          <SendHorizontal size={20} />
        </button>
      </form>
    </div>
  );
}
