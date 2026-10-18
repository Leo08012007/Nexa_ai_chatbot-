import React from 'react';
import { HelpCircle, X, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const vivaQuestions = [
    {
      q: "1. What is an Intelligent Chatbot?",
      a: "A software application that uses Natural Language Processing (NLP) and Machine Learning models to understand human text or speech input and generate contextually relevant, human-like responses."
    },
    {
      q: "2. What is NLP (Natural Language Processing)?",
      a: "A branch of Artificial Intelligence that enables computers to comprehend, interpret, manipulate, and generate human languages using semantic flow and syntax analysis."
    },
    {
      q: "3. How does OpenAI API work?",
      a: "It exposes Large Language Models (LLMs) like gpt-4o-mini via REST endpoints. The backend sends tokenized conversation prompts and receives probability-guided text completions."
    },
    {
      q: "4. Why is Python & FastAPI used for backend?",
      a: "Python is the industry standard for AI/NLP with official SDK support. FastAPI provides asynchronous high performance, auto OpenAPI documentation, Pydantic type validation, and low latency."
    },
    {
      q: "5. How is conversation context maintained?",
      a: "The FastAPI backend stores the history of messages for each conversation_id. On every new user query, the complete system prompt + prior chat history + new message is passed to OpenAI so the AI understands references like 'give me an example'."
    },
    {
      q: "6. What is Semantic Flow & Understanding?",
      a: "Semantic understanding refers to extracting the underlying meaning and intent of words in context, rather than simple keyword matching."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-2xl p-6 shadow-2xl shadow-indigo-950/50 max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-indigo-400 mb-4 flex-shrink-0">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <HelpCircle className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Help & Practical Viva Guide</h3>
            <p className="text-xs text-slate-400">AIT Laboratory Task 9 Conceptual Explanations</p>
          </div>
        </div>

        <div className="overflow-y-auto pr-2 space-y-4 text-sm flex-1 custom-scrollbar">
          {/* Architecture Card */}
          <div className="bg-slate-900/80 border border-indigo-500/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-indigo-300 font-semibold mb-2">
              <Layers className="w-4 h-4" />
              <span>End-to-End System Flow Architecture</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-indigo-300 text-center leading-relaxed border border-slate-800">
              User ➔ React UI ➔ FastAPI Backend ➔ OpenAI Responses API ➔ AI Model ➔ Generated Response ➔ User
            </div>
          </div>

          {/* Viva Questions Accordion/Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Core Practical Viva Concepts</span>
            </h4>

            {vivaQuestions.map((item, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                <div className="text-slate-200 font-semibold text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span>{item.q}</span>
                </div>
                <p className="text-slate-400 text-xs pl-5 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
