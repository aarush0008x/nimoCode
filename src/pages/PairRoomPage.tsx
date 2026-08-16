import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, ChevronLeft, Share2, Check, Mic, MicOff } from 'lucide-react';
import { CodeEditor } from '../components/problem/CodeEditor';
import { SubmissionResult } from '../components/problem/SubmissionResult';
import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';
import type { ProgrammingLanguage, Submission } from '../types';
import { runCodeExecution } from '../utils/codeRunner';

export const PairRoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { problems } = useDb();
  const { user } = useAuth();
  const problem = problems[0]; // #1 Two Sum

  const [selectedLang, setSelectedLang] = useState<ProgrammingLanguage>('cpp');
  const [code, setCode] = useState<string>(problem.starterCode.cpp);
  const [isRunning, setIsRunning] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [copied, setCopied] = useState(false);
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);

  const toggleWebRTCVoice = async () => {
    if (!isVoiceConnected) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsVoiceConnected(true);
      } catch {
        alert('Microphone permission is required for WebRTC Voice Channel.');
      }
    } else {
      setIsVoiceConnected(false);
    }
  };

  const handleShareRoom = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    const result = await runCodeExecution({ problem, language: selectedLang, code, isSubmission: false });
    setSubmission(result);
    setIsRunning(false);
  };

  const handleSubmitCode = async () => {
    setIsRunning(true);
    const result = await runCodeExecution({ problem, language: selectedLang, code, isSubmission: true });
    setSubmission(result);
    setIsRunning(false);
  };

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] space-y-4">
      {/* Pair Header */}
      <div className="p-4 rounded-2xl bg-neutral-950 text-white border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Link to="/problems" className="p-1.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 font-mono uppercase">
            <Users className="w-4 h-4" />
            LIVE PAIR PROGRAMMING ROOM • {roomId || 'room-101'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Session (@{user?.username || 'aarush'})</span>
          </div>

          <button
            onClick={toggleWebRTCVoice}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
              isVoiceConnected
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {isVoiceConnected ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>{isVoiceConnected ? 'Voice Connected' : 'Enable WebRTC Audio'}</span>
          </button>

          <button
            onClick={handleShareRoom}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share Room URL'}</span>
          </button>
        </div>
      </div>

      {/* Grid Pair Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[640px]">
        <div className="lg:col-span-5 flex flex-col p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-y-auto space-y-4">
          <h2 className="text-sm font-bold text-neutral-950 dark:text-white">#{problem.number} {problem.title}</h2>
          <div className="whitespace-pre-wrap text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {problem.description}
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex-1 min-h-[460px]">
            <CodeEditor
              language={selectedLang}
              code={code}
              onChange={setCode}
              onLanguageChange={setSelectedLang}
              onReset={() => setCode(problem.starterCode[selectedLang] || '')}
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
              isRunning={isRunning}
            />
          </div>

          <div className="min-h-[160px]">
            <SubmissionResult submission={submission} isRunning={isRunning} />
          </div>
        </div>
      </div>
    </div>
  );
};
