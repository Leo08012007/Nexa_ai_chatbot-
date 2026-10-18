import React from 'react';
import { 
  Bot, 
  Sparkles, 
  BrainCircuit, 
  Terminal, 
  Cpu, 
  ArrowRight 
} from 'lucide-react';

export default function WelcomeScreen({ onSelectSuggestion }) {
  const suggestions = [
    {
      title: "Explain Artificial Intelligence",
      description: "Understand AI concepts in simple language",
      icon: Cpu,
      prompt: "Explain Artificial Intelligence in simple terms"
    },
    {
      title: "Natural Language Processing",
      description: "Learn how chatbots comprehend human language",
      icon: BrainCircuit,
      prompt: "What is Natural Language Processing?"
    },
    {
      title: "Machine Learning Concepts",
      description: "Discover supervised vs unsupervised learning",
      icon: Sparkles,
      prompt: "Help me understand Machine Learning"
    },
    {
      title: "Python Code Example",
      description: "Generate Python code with explanations",
      icon: Terminal,
      prompt: "Write a Python program to reverse a string"
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-4xl mx-auto w-full text-center">
      {/* Animated Glowing Logo */}
      <div className="relative mb-6 group">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-600 opacity-60 blur-xl group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow" />
        <div className="relative w-20 h-20 md:w-24 md:h-24 bg-slate-950 border border-slate-700/80 rounded-3xl flex items-center justify-center shadow-2xl">
          <Bot className="w-10 h-10 md:w-12 md:h-12 text-indigo-400" />
        </div>
      </div>

      {/* Hero Headings */}
      <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
        How can I help you today?
      </h1>
      
      <p className="text-slate-400 text-sm md:text-base max-w-xl mb-10 leading-relaxed">
        Ask me anything. I can explain concepts, answer questions, help with programming, summarize information, and more.
      </p>

      {/* Suggestion Prompt Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left">
        {suggestions.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectSuggestion(item.prompt)}
              className="glass-card p-4 rounded-2xl flex items-start justify-between space-x-4 group hover:border-indigo-500/40 text-left transition-all duration-200"
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200 flex-shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    {item.description}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 self-center" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
