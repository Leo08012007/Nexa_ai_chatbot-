import React from 'react';
import { 
  Bot, 
  Plus, 
  Trash2, 
  Download, 
  Settings, 
  Menu, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function Header({
  onNewChat,
  onClearChat,
  onExportChat,
  onOpenSettings,
  onOpenMobileMenu,
  hasMessages,
  providerInfo
}) {
  return (
    <header className="h-16 px-4 md:px-6 bg-[#080c14]/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between z-30 sticky top-0">
      {/* Left Title & Status */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 md:hidden transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-100 tracking-tight">NEXA AI</h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />
                ● AI Online
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              {providerInfo?.provider === 'smart_engine' 
                ? 'NEXA Intelligent Core (Local)' 
                : 'Multi-Engine Resilient Assistant'}
            </p>
          </div>
        </div>
      </div>

      {/* Right Action Icons / Buttons */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        <button
          onClick={onNewChat}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors"
          title="Start a new chat"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {hasMessages && (
          <>
            <button
              onClick={onExportChat}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              title="Export Conversation TXT"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClearChat}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
