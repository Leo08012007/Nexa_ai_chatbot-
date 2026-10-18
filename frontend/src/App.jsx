import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ClearModal from './components/ClearModal';
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import { Bot, AlertCircle, Sparkles } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

export default function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [apiConfigured, setApiConfigured] = useState(false);
  const [providerInfo, setProviderInfo] = useState(null);

  // Modals state
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom smoothly when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial check on backend health and fetch existing conversation history
  useEffect(() => {
    checkBackendHealth();
    fetchConversations();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (res.ok) {
        const data = await res.json();
        setApiConfigured(data.openai_configured);
        setProviderInfo(data);
      }
    } catch (err) {
      console.warn("Backend API endpoint not reachable yet or offline.");
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error("Failed to load conversation history:", err);
    }
  };

  // Handle selecting an existing conversation
  const handleSelectConversation = async (id) => {
    setCurrentConvId(id);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE_URL}/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      setErrorMsg("Unable to load conversation history.");
    }
  };

  // Handle "+ New Chat"
  const handleNewChat = () => {
    setCurrentConvId(null);
    setMessages([]);
    setErrorMsg(null);
    setInput('');
  };

  // Handle Delete a conversation
  const handleDeleteConversation = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/conversations/${id}`, { method: 'DELETE' });
      setConversations(prev => prev.filter(c => c.id !== id));
      if (currentConvId === id) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  // Handle Clear Chat
  const handleConfirmClearChat = async () => {
    if (currentConvId) {
      handleDeleteConversation(currentConvId);
    } else {
      setMessages([]);
    }
  };

  // Handle Export Chat as TXT file
  const handleExportChat = () => {
    if (messages.length === 0) return;
    
    let textContent = `NEXA AI Chat Transcript\n`;
    textContent += `Date: ${new Date().toLocaleString()}\n`;
    textContent += `==================================================\n\n`;

    messages.forEach(msg => {
      const sender = msg.role === 'user' ? 'USER' : 'NEXA AI';
      textContent += `[${msg.timestamp || ''}] ${sender}:\n${msg.content}\n\n`;
    });

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nexa_AI_Chat_${currentConvId || 'session'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Send Message Logic
  const handleSendMessage = async (customPrompt = null) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    setErrorMsg(null);
    setInput('');

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsgObj = { role: 'user', content: textToSend, timestamp: userTimestamp };
    
    setMessages(prev => [...prev, newMsgObj]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversation_id: currentConvId
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error (${res.status}). Please check backend.`);
      }

      const data = await res.json();
      
      // Update state with backend conversation response
      setCurrentConvId(data.conversation_id);
      setMessages(data.messages || []);
      
      // Refresh sidebar conversation list
      fetchConversations();
    } catch (err) {
      console.error("Chat API Error:", err);
      setErrorMsg(err.message || "Sorry, I couldn't process that request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate Response
  const handleRegenerateResponse = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  return (
    <div className="flex h-screen bg-[#080c14] text-slate-100 overflow-hidden font-sans bg-grid-pattern">
      {/* Sidebar Navigation */}
      <Sidebar
        conversations={conversations}
        currentConvId={currentConvId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Header */}
        <Header
          onNewChat={handleNewChat}
          onClearChat={() => setIsClearModalOpen(true)}
          onExportChat={handleExportChat}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          hasMessages={messages.length > 0}
          providerInfo={providerInfo}
        />

        {/* Error Toast Banner */}
        {errorMsg && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between shadow-lg animate-fade-in">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-slate-400 hover:text-white px-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Chat Area Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            <WelcomeScreen onSelectSuggestion={(prompt) => handleSendMessage(prompt)} />
          ) : (
            <div className="pb-6">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg}
                  isLast={index === messages.length - 1}
                  onRegenerate={handleRegenerateResponse}
                />
              ))}

              {/* Typing / Thinking Indicator */}
              {isLoading && (
                <div className="py-5 px-4 md:px-6 bg-[#0e1424]/40 border-y border-slate-800/40">
                  <div className="max-w-4xl mx-auto flex space-x-3.5 items-center">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/30 flex items-center justify-center text-white shadow-md">
                      <Bot className="w-4 h-4 text-indigo-200 animate-pulse" />
                    </div>
                    <div className="flex items-center space-x-2 text-indigo-300 text-xs font-medium">
                      <span>NEXA AI is thinking</span>
                      <div className="flex space-x-1 items-center pl-1">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full dot-bounce-1" />
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full dot-bounce-2" />
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full dot-bounce-3" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Floating Input */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={() => handleSendMessage()}
          isLoading={isLoading}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Modals */}
      <ClearModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleConfirmClearChat}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        apiConfigured={apiConfigured}
        onSettingsUpdated={checkBackendHealth}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}
