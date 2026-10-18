import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Cpu, 
  ShieldCheck, 
  Key, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Eye, 
  EyeOff, 
  ExternalLink,
  Save,
  Check
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

export default function SettingsModal({ isOpen, onClose, apiConfigured, onSettingsUpdated }) {
  const [provider, setProvider] = useState('auto');
  const [model, setModel] = useState('gpt-4o-mini');
  const [openaiKey, setOpenaiKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);

  // Status info from backend
  const [settingsData, setSettingsData] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
      setTestResult(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettingsData(data);
        if (data.provider) setProvider(data.provider);
        if (data.model) setModel(data.model);
      }
    } catch (err) {
      console.warn("Could not load backend settings:", err);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    let keyToTest = '';
    if (provider === 'openai') keyToTest = openaiKey;
    else if (provider === 'groq') keyToTest = groqKey;
    else if (provider === 'gemini') keyToTest = geminiKey;

    try {
      const res = await fetch(`${API_BASE_URL}/settings/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: provider === 'auto' ? 'openai' : provider,
          api_key: keyToTest,
          model: model
        })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Could not connect to backend test service.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const payload = {
        provider: provider,
        openai_model: model
      };
      if (openaiKey.trim()) payload.openai_api_key = openaiKey.trim();
      if (groqKey.trim()) payload.groq_api_key = groqKey.trim();
      if (geminiKey.trim()) payload.gemini_api_key = geminiKey.trim();

      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaveSuccess(true);
        fetchSettings();
        if (onSettingsUpdated) onSettingsUpdated();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0b101d] border border-slate-700/80 rounded-2xl p-6 shadow-2xl shadow-indigo-950/70 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 text-indigo-400 mb-5">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <Settings className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">NEXA AI Configuration</h3>
            <p className="text-xs text-slate-400">Manage AI providers, API keys, and resilient fallback settings</p>
          </div>
        </div>

        <div className="space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
          {/* Provider Selection */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-400" />
                Active AI Provider Mode
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                Smart Fallback Enabled
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {[
                { id: 'auto', label: 'Auto (Recommended)', desc: 'Tries live API; uses Smart Core if quota exhausted' },
                { id: 'smart_engine', label: 'NEXA Smart Core', desc: '100% Free & Offline (Zero API Keys required)' },
                { id: 'openai', label: 'OpenAI (GPT-4o)', desc: 'Requires active OpenAI billing credits' },
                { id: 'groq', label: 'Groq (Free Tier)', desc: 'Ultra-fast Llama 3 models via Groq API' },
                { id: 'gemini', label: 'Google Gemini', desc: 'Free API tier via Google AI Studio' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setProvider(item.id)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    provider === item.id
                      ? 'bg-indigo-600/15 border-indigo-500/60 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${provider === item.id ? 'text-indigo-300' : 'text-slate-200'}`}>
                      {item.label}
                    </span>
                    {provider === item.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-tight">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Language Model
              </span>
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="gpt-4o-mini">gpt-4o-mini (Fast & Intelligent)</option>
              <option value="gpt-4o">gpt-4o (High Reasoning)</option>
              <option value="gpt-3.5-turbo">gpt-3.5-turbo (Legacy Fast)</option>
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Groq)</option>
              <option value="gemini-1.5-flash">gemini-1.5-flash (Google Gemini)</option>
            </select>
          </div>

          {/* API Keys Configuration */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-200 font-semibold text-xs">
                <Key className="w-4 h-4 text-amber-400" />
                <span>API Keys Configuration</span>
              </div>
              <button
                type="button"
                onClick={() => setShowKeys(!showKeys)}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                {showKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showKeys ? 'Hide Keys' : 'Show Keys'}
              </button>
            </div>

            {/* OpenAI Key */}
            <div>
              <div className="flex justify-between items-center text-[11px] mb-1">
                <span className="text-slate-300 font-medium">OpenAI API Key:</span>
                <span className="text-slate-400 font-mono text-[10px]">
                  {settingsData?.openai_configured ? `Current: ${settingsData.openai_preview}` : 'Not set'}
                </span>
              </div>
              <input
                type={showKeys ? 'text' : 'password'}
                placeholder="sk-proj-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Note: OpenAI accounts require funded billing credits. If quota is 0, NEXA automatically switches to Smart Core.
              </p>
            </div>

            {/* Groq Key (Free) */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-[11px] mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  Groq API Key
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-semibold">100% Free</span>
                </span>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-indigo-400 hover:underline flex items-center gap-0.5"
                >
                  Get free key <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <input
                type={showKeys ? 'text' : 'password'}
                placeholder="gsk_..."
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Google Gemini Key */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-[11px] mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  Google Gemini API Key
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-semibold">Free Tier</span>
                </span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-indigo-400 hover:underline flex items-center gap-0.5"
                >
                  Get free key <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <input
                type={showKeys ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Test Connection Result Box */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 ${
              testResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-semibold">
                  {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                  {testResult.latency_ms && (
                    <span className="ml-2 font-mono text-[10px] font-normal opacity-80">
                      ({testResult.latency_ms}ms)
                    </span>
                  )}
                </div>
                <div className="text-[11px] opacity-90 mt-0.5">{testResult.message}</div>
              </div>
            </div>
          )}

          {/* Security Note */}
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-indigo-950/30 border border-indigo-900/40 p-3 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>API keys are encrypted in backend memory and saved only to your local backend .env file.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center space-x-1.5 disabled:opacity-50"
          >
            {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{saveSuccess ? 'Saved!' : isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
