import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  RotateCw, 
  Sparkles,
  Code2
} from 'lucide-react';

export default function ChatMessage({ message, isLast, onRegenerate }) {
  const isUser = message.role === 'user';
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleCopyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  return (
    <div className={`py-5 px-4 md:px-6 transition-colors ${
      isUser ? 'bg-transparent' : 'bg-[#0e1424]/40 border-y border-slate-800/40'
    }`}>
      <div className="max-w-4xl mx-auto flex space-x-3.5 md:space-x-4">
        {/* Avatar Icon */}
        <div className="flex-shrink-0 pt-0.5">
          {isUser ? (
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md">
              <User className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          ) : (
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/30 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Bot className="w-4 h-4 md:w-5 md:h-5 text-indigo-200" />
            </div>
          )}
        </div>

        {/* Message Content Container */}
        <div className="flex-1 space-y-2 overflow-hidden">
          {/* Header Name & Timestamp */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 font-semibold">
              <span className={isUser ? 'text-cyan-300' : 'text-indigo-400 flex items-center gap-1'}>
                {isUser ? 'You' : 'NEXA AI'}
                {!isUser && <Sparkles className="w-3 h-3 text-cyan-400" />}
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                {message.timestamp || 'Just now'}
              </span>
            </div>

            {/* Quick Action buttons for AI response */}
            {!isUser && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleCopyMessage}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-1 text-[11px]"
                  title="Copy response"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>

                {isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="p-1 rounded-md text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors flex items-center space-x-1 text-[11px]"
                    title="Regenerate AI response"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Regenerate</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Render User Bubble vs AI Markdown Container */}
          {isUser ? (
            <div className="bg-indigo-950/40 border border-indigo-500/20 text-slate-100 rounded-2xl rounded-tl-none p-3.5 text-sm md:text-[15px] leading-relaxed shadow-sm max-w-3xl whitespace-pre-wrap">
              {message.content}
            </div>
          ) : (
            <div className="prose prose-invert max-w-none text-slate-200 text-sm md:text-[15px] leading-relaxed space-y-3">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    const codeIndex = props.key || Math.random();

                    if (!inline) {
                      return (
                        <div className="my-4 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-xl">
                          {/* Code Header bar */}
                          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                            <div className="flex items-center space-x-2">
                              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                              <span className="uppercase text-[11px] font-bold text-slate-300">
                                {match ? match[1] : 'code'}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopyCode(codeString, codeIndex)}
                              className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md text-[11px]"
                            >
                              {copiedCodeIndex === codeIndex ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-medium">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Code</span>
                                </>
                              )}
                            </button>
                          </div>
                          {/* Code content block */}
                          <pre className="p-4 text-xs md:text-sm font-mono overflow-x-auto text-emerald-300 leading-relaxed custom-scrollbar">
                            <code>{children}</code>
                          </pre>
                        </div>
                      );
                    }
                    return (
                      <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono border border-slate-700" {...props}>
                        {children}
                      </code>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-4 border border-slate-800 rounded-xl">
                        <table className="min-w-full text-xs md:text-sm border-collapse text-slate-300">
                          {children}
                        </table>
                      </div>
                    );
                  },
                  th({ children }) {
                    return <th className="bg-slate-900 px-4 py-2 text-left font-semibold text-indigo-300 border-b border-slate-800">{children}</th>;
                  },
                  td({ children }) {
                    return <td className="px-4 py-2 border-b border-slate-800/60 bg-slate-950/40">{children}</td>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc list-inside space-y-1 my-2 text-slate-300">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal list-inside space-y-1 my-2 text-slate-300">{children}</ol>;
                  },
                  h1({ children }) {
                    return <h1 className="text-lg md:text-xl font-bold text-white mt-4 mb-2">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-base md:text-lg font-bold text-white mt-3 mb-2">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-sm md:text-base font-semibold text-indigo-300 mt-2 mb-1">{children}</h3>;
                  },
                  p({ children }) {
                    return <p className="mb-2 leading-relaxed text-slate-300">{children}</p>;
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
