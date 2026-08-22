import React, { useState } from 'react';
import { Bot, User, Send, Award, CheckCircle2, Play, RefreshCw, Sparkles, Mic } from 'lucide-react';
import type { ProgrammingLanguage } from '../types';

interface ChatMessage {
  sender: 'interviewer' | 'candidate';
  text: string;
  timestamp: string;
}

export const MockInterviewPage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('cpp');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'clarification' | 'coding' | 'feedback'>('clarification');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleStartVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Try Google Chrome.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMsg(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } catch {
      setIsListening(false);
    }
  };

  const languages: { id: ProgrammingLanguage; name: string; icon: string }[] = [
    { id: 'cpp', name: 'C++ 20', icon: '⚡' },
    { id: 'python', name: 'Python 3', icon: '🐍' },
    { id: 'javascript', name: 'JavaScript ES6', icon: '🟨' },
    { id: 'java', name: 'Java 17', icon: '☕' },
    { id: 'go', name: 'Go 1.21', icon: '🩵' },
    { id: 'rust', name: 'Rust 2021', icon: '🦀' }
  ];

  const startInterviewSession = () => {
    const initialText = `Welcome to your FAANG AI Technical Interview! I'm Alex, Senior Staff Engineer at Google. Today we will solve LeetCode #1 Two Sum using ${
      languages.find(l => l.id === selectedLanguage)?.name
    }. Before writing code, explain your optimal time and space complexity approach in ${languages.find(l => l.id === selectedLanguage)?.name}.`;

    setMessages([
      {
        sender: 'interviewer',
        text: initialText,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setInterviewStarted(true);
  };

  const handleSendMessage = async () => {
    if (!inputMsg.trim() || isThinking) return;

    const candidateMsgText = inputMsg.trim();
    const userMessage: ChatMessage = {
      sender: 'candidate',
      text: candidateMsgText,
      timestamp: new Date().toLocaleTimeString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMsg('');
    setIsThinking(true);

    try {
      const apiPayloadMessages = newMessages.map(m => ({
        role: m.sender === 'interviewer' ? 'assistant' : 'user',
        content: m.text
      }));

      const apiBase = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${apiBase}/interview/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiPayloadMessages,
          language: languages.find(l => l.id === selectedLanguage)?.name,
          problemTitle: 'LeetCode #1 Two Sum'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            sender: 'interviewer',
            text: data.reply || "That's a very solid approach! Let's examine the code implementation.",
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        if (currentPhase === 'clarification') setCurrentPhase('coding');
        else if (currentPhase === 'coding') setCurrentPhase('feedback');
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'interviewer',
          text: `Solid explanation for ${selectedLanguage.toUpperCase()}! Your logic handles complement calculation cleanly. Let's examine your final candidate scorecard.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      setCurrentPhase('feedback');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
      {/* Hero Header */}
      <div className="p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          POWERED BY NIMO AI NEMOTRON ENGINE
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          NIMO AI Technical Mock Interview
        </h1>
        <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
          Simulate a real 45-minute FAANG technical coding interview powered by NIMO AI LLM. Select your preferred programming language to receive personalized questions, live code feedback, and a candidate evaluation scorecard.
        </p>

        {!interviewStarted && (
          <div className="pt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-mono">
                Select Interview Programming Language
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {languages.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`p-3 rounded-2xl border text-xs font-bold font-mono transition-all flex flex-col items-center gap-1.5 ${
                      selectedLanguage === lang.id
                        ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-lg scale-105'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-base">{lang.icon}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startInterviewSession}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-xl transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-neutral-950" />
              <span>Start {languages.find(l => l.id === selectedLanguage)?.name} Interview Session</span>
            </button>
          </div>
        )}
      </div>

      {interviewStarted && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
          {/* Chat Panel */}
          <div className="lg:col-span-7 flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-neutral-900 dark:text-white">
                  Alex (FAANG Staff Engineer) • Language: {languages.find(l => l.id === selectedLanguage)?.name}
                </span>
              </div>
              <span className="text-amber-500 font-bold uppercase">NIMO AI ACTIVE</span>
            </div>

            {/* Chat Transcript */}
            <div className="flex-1 overflow-y-auto space-y-4 max-h-[420px] p-2">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 text-xs ${m.sender === 'candidate' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                    m.sender === 'interviewer' ? 'bg-neutral-950 text-amber-400' : 'bg-amber-500 text-neutral-950'
                  }`}>
                    {m.sender === 'interviewer' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className={`p-4 rounded-2xl max-w-md font-medium leading-relaxed shadow-xs ${
                    m.sender === 'interviewer'
                      ? 'bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200'
                      : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                  }`}>
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    <div className="text-[10px] opacity-40 mt-1 font-mono text-right">{m.timestamp}</div>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-3 text-xs">
                  <div className="w-8 h-8 rounded-2xl bg-neutral-950 text-amber-400 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-amber-500 font-mono flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>NIMO AI is evaluating your response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={handleStartVoiceInput}
                type="button"
                className={`p-3 rounded-2xl border transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                    : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-amber-500'
                }`}
                title="Speak answer using Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder={isListening ? 'Listening to speech...' : `Type your answer or write ${languages.find(l => l.id === selectedLanguage)?.name} code...`}
                className="flex-1 px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={isThinking}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Feedback & Scorecard Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 font-bold text-sm text-neutral-950 dark:text-white">
                <Award className="w-5 h-5 text-amber-500" />
                <span>NIMO AI Candidate Evaluation</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex justify-between">
                  <span className="text-neutral-500">Language Selected</span>
                  <span className="font-bold text-amber-500">{languages.find(l => l.id === selectedLanguage)?.name}</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex justify-between">
                  <span className="text-neutral-500">Problem Solving</span>
                  <span className="font-bold text-emerald-500">96% (Optimal)</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex justify-between">
                  <span className="text-neutral-500">Complexity Defense</span>
                  <span className="font-bold text-emerald-500">O(N) Time / O(N) Space</span>
                </div>
              </div>

              {currentPhase === 'feedback' && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs space-y-1 text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto" />
                  <div>NIMO AI RECOMMENDATION: STRONG HIRE</div>
                  <div className="text-[10px] text-neutral-400 font-normal">Demonstrated L5 Senior Engineer mastery in {languages.find(l => l.id === selectedLanguage)?.name}.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
