import React, { useRef, useEffect } from 'react';
import { Send, Plus, Sparkles, Loader2 } from 'lucide-react';

export default function ChatInput({
  input,
  setInput,
  onSend,
  isLoading,
  onNewChat
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea according to input content height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <div className="p-4 bg-[#080c14]/90 backdrop-blur-md border-t border-slate-800/80 sticky bottom-0 z-20">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Floating Glass Input Container */}
        <div className="relative flex items-end space-x-2 glass-input p-2 rounded-2xl border border-slate-700/80 focus-within:border-indigo-500/80 transition-colors shadow-2xl">
          {/* Quick Action (+) button */}
          <button
            onClick={onNewChat}
            className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-slate-800/80 transition-colors flex-shrink-0"
            title="Start new conversation"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Auto-resizing Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Message NEXA AI... (Press Enter to send, Shift+Enter for new line)"
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm md:text-base focus:outline-none resize-none max-h-44 py-2 px-1 custom-scrollbar"
          />

          {/* Character count indicator */}
          {input.length > 0 && (
            <span className="text-[10px] text-slate-500 px-1 self-center hidden sm:inline">
              {input.length} chars
            </span>
          )}

          {/* Send Button */}
          <button
            onClick={onSend}
            disabled={!input.trim() || isLoading}
            className={`
              p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0
              ${input.trim() && !isLoading
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/30 scale-100'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
            `}
            title="Send Message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-300" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Disclaimer Footer Note */}
        <p className="text-[11px] text-center text-slate-500 font-medium">
          NEXA AI can make mistakes. Verify important information for academic use.
        </p>
      </div>
    </div>
  );
}
