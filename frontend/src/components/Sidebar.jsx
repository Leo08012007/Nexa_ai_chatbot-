import React, { useState } from 'react';
import { 
  Bot, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Settings, 
  HelpCircle, 
  X, 
  Search,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({
  conversations,
  currentConvId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onOpenSettings,
  onOpenHelp,
  isOpenMobile,
  onCloseMobile
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 bg-[#0e1424] border-r border-slate-800/80
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top Header & Brand */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-6 h-6 text-indigo-400 animate-pulse-slow" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#0e1424] rounded-full" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  NEXA AI
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">Intelligent Chat Assistant</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => {
              onNewChat();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35 transition-all duration-200 group active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            <span>+ New Chat</span>
          </button>

          {/* Conversation Search Bar */}
          {conversations.length > 0 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Conversation History List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Recent Conversations
          </div>

          {filteredConversations.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-slate-500">
              {searchQuery ? 'No matching conversations' : 'No previous chats yet.'}
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === currentConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    if (isOpenMobile) onCloseMobile();
                  }}
                  className={`
                    group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200
                    ${isActive 
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm' 
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'}
                  `}
                >
                  <div className="flex items-center space-x-2.5 truncate pr-2">
                    <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                    <span className="truncate">{conv.title || 'Untitled Conversation'}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    title="Delete conversation"
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-opacity rounded-md hover:bg-slate-700/50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Section: Settings & Help */}
        <div className="p-3 border-t border-slate-800/80 space-y-1 bg-slate-950/40">
          <button
            onClick={() => {
              onOpenSettings();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors group"
          >
            <div className="flex items-center space-x-2.5">
              <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span>Settings</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </button>

          <button
            onClick={() => {
              onOpenHelp();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors group"
          >
            <div className="flex items-center space-x-2.5">
              <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span>Help & Viva Guide</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </button>
        </div>
      </aside>
    </>
  );
}
