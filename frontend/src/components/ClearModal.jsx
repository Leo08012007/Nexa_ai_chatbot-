import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ClearModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700/80 rounded-2xl p-6 shadow-2xl shadow-indigo-950/50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-rose-400 mb-4">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100">Clear Conversation?</h3>
        </div>

        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Are you sure you want to clear this conversation? All message history for this chat session will be deleted.
        </p>

        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-sm font-medium transition-all shadow-lg shadow-rose-600/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
