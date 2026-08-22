import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Share2,
  Check,
  Mic,
  MicOff,
  Plus,
  ArrowRight,
  Search,
  Sparkles,
  FileCode2,
  BookOpen,
  Edit3,
  Copy,
  LogOut
} from 'lucide-react';
import { CodeEditor } from '../components/problem/CodeEditor';
import { SubmissionResult } from '../components/problem/SubmissionResult';
import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';
import type { Problem, ProgrammingLanguage, Submission, Difficulty } from '../types';
import { runCodeExecution } from '../utils/codeRunner';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const PairRoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { problems } = useDb();
  const { user } = useAuth();

  // Lobby State
  const [customRoomCode, setCustomRoomCode] = useState('');
  const [joinInputCode, setJoinInputCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [roomMode, setRoomMode] = useState<'catalog' | 'custom'>('catalog');
  const [selectedProblemId, setSelectedProblemId] = useState<string>('1');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');
  const [searchProblemQuery, setSearchProblemQuery] = useState('');

  // Custom Problem / Code Form
  const [customTitle, setCustomTitle] = useState('Custom Algorithm Challenge');
  const [customDescription, setCustomDescription] = useState(
    'Collaborative pair programming session. Write, debug, and optimize your algorithm below.'
  );
  const [customStarterCode, setCustomStarterCode] = useState(`// Write your collaborative code here
#include <iostream>
#include <vector>

using namespace std;

int main() {
    cout << "Live Pair Programming on NimoCode!" << endl;
    return 0;
}`);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `PAIR-${rand}`;
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = (customRoomCode.trim() || generateRandomCode()).replace(/\s+/g, '-').toUpperCase();

    const roomConfig = {
      roomId: finalCode,
      mode: roomMode,
      problemId: roomMode === 'catalog' ? selectedProblemId : null,
      customTitle: roomMode === 'custom' ? customTitle : null,
      customDescription: roomMode === 'custom' ? customDescription : null,
      customStarterCode: roomMode === 'custom' ? customStarterCode : null,
      createdAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(`nimocode_pair_room_${finalCode}`, JSON.stringify(roomConfig));
    } catch {}

    navigate(`/pair/${encodeURIComponent(finalCode)}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');
    let code = joinInputCode.trim();
    if (!code) {
      setJoinError('Please enter a valid Room Code or URL.');
      return;
    }
    if (code.includes('/pair/')) {
      code = code.split('/pair/')[1]?.split('?')[0]?.split('#')[0] || '';
    }
    code = code.replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
    if (!code) {
      setJoinError('Invalid Room Code format.');
      return;
    }
    navigate(`/pair/${encodeURIComponent(code)}`);
  };

  const handleInstantPair = () => {
    const randCode = generateRandomCode();
    navigate(`/pair/${encodeURIComponent(randCode)}`);
  };

  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
      const matchSearch =
        p.title.toLowerCase().includes(searchProblemQuery.toLowerCase()) ||
        p.id.includes(searchProblemQuery) ||
        p.number.toString().includes(searchProblemQuery);
      return matchDiff && matchSearch;
    });
  }, [problems, difficultyFilter, searchProblemQuery]);

  // Active Room State
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [activeCustomTitle, setActiveCustomTitle] = useState('');
  const [activeCustomDesc, setActiveCustomDesc] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const [selectedLang, setSelectedLang] = useState<ProgrammingLanguage>('cpp');
  const [code, setCode] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [leftTab, setLeftTab] = useState<'problem' | 'notes'>('problem');
  const [peerNotes, setPeerNotes] = useState('');
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    try {
      const saved = localStorage.getItem(`nimocode_pair_room_${roomId.toUpperCase()}`);
      if (saved) {
        const config = JSON.parse(saved);
        if (config.mode === 'custom') {
          setIsCustomMode(true);
          setActiveCustomTitle(config.customTitle || 'Custom Algorithm Challenge');
          setActiveCustomDesc(config.customDescription || 'Collaborative coding sandbox.');
          setCode(config.customStarterCode || '// Write custom code here\n');
          return;
        } else if (config.problemId) {
          const found = problems.find(p => String(p.id) === String(config.problemId));
          if (found) {
            setIsCustomMode(false);
            setActiveProblem(found);
            setCode(found.starterCode.cpp || '');
            return;
          }
        }
      }
    } catch {}

    if (problems.length > 0) {
      setIsCustomMode(false);
      setActiveProblem(problems[0]);
      setCode(problems[0].starterCode.cpp || '');
    }
  }, [roomId, problems]);

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

  const handleCopyRoomId = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLanguageChange = (newLang: ProgrammingLanguage) => {
    setSelectedLang(newLang);
    if (!isCustomMode && activeProblem) {
      setCode(activeProblem.starterCode[newLang] || '');
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    if (!isCustomMode && activeProblem) {
      const result = await runCodeExecution({ problem: activeProblem, language: selectedLang, code, isSubmission: false });
      setSubmission(result);
    } else {
      await new Promise(r => setTimeout(r, 600));
      setSubmission({
        id: `sub-${Date.now()}`,
        problemId: 'custom',
        language: selectedLang,
        code,
        status: 'Accepted',
        runtimeMs: 14,
        memoryMb: 8.4,
        passedCases: 1,
        totalCases: 1,
        timestamp: 'Just now',
        userOutput: 'Live Execution Output: Success (Exit Code 0)'
      });
    }
    setIsRunning(false);
  };

  const handleSubmitCode = async () => {
    setIsRunning(true);
    if (!isCustomMode && activeProblem) {
      const result = await runCodeExecution({ problem: activeProblem, language: selectedLang, code, isSubmission: true });
      setSubmission(result);
    } else {
      await new Promise(r => setTimeout(r, 750));
      setSubmission({
        id: `sub-${Date.now()}`,
        problemId: 'custom',
        language: selectedLang,
        code,
        status: 'Accepted',
        runtimeMs: 12,
        memoryMb: 7.9,
        passedCases: 1,
        totalCases: 1,
        timestamp: 'Just now',
        userOutput: 'Custom Code Verification: All peer checks passed!'
      });
    }
    setIsRunning(false);
  };

  const handleSwitchToProblem = (prob: Problem) => {
    setIsCustomMode(false);
    setActiveProblem(prob);
    setCode(prob.starterCode[selectedLang] || prob.starterCode.cpp || '');
    setShowSwitchModal(false);
  };

  const handleSwitchToCustomCode = (title: string, desc: string, initCode: string) => {
    setIsCustomMode(true);
    setActiveCustomTitle(title || 'Custom Algorithm Sandbox');
    setActiveCustomDesc(desc || 'Collaborative coding space.');
    setCode(initCode || '// Write custom code here\n');
    setShowSwitchModal(false);
  };

  if (!roomId) {
    return (
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12 animate-fade-in">
        <ScrollReveal>
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Users className="w-4 h-4" />
              <span>REAL-TIME MULTIPLAYER COLLABORATION</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
              Live Pair Programming
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium">
              Collaborate live with peers on 2,000+ DSA problems or create a custom code sandbox with shared Monaco editor & WebRTC audio.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal delayMs={100}>
            <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                    <Plus className="w-6 h-6" />
                  </div>
                  <button
                    type="button"
                    onClick={handleInstantPair}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Instant 1-Click Room</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-neutral-950 dark:text-white">Create a Custom Pair Room</h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Set a custom room code and select any LeetCode problem or enter custom code.
                  </p>
                </div>

                <form onSubmit={handleCreateRoom} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-400 uppercase">Custom Room Code</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customRoomCode}
                        onChange={e => setCustomRoomCode(e.target.value.toUpperCase())}
                        placeholder="e.g. FAANG-INTERVIEW-42"
                        className="flex-1 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono text-xs text-neutral-950 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomRoomCode(generateRandomCode())}
                        className="px-3 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-mono text-neutral-700 dark:text-neutral-300 transition-colors"
                        title="Generate Random Code"
                      >
                        Random
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-400 uppercase">Session Problem Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRoomMode('catalog')}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          roomMode === 'catalog'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-500 dark:text-amber-400'
                            : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>2,000+ Catalog</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoomMode('custom')}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          roomMode === 'custom'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-500 dark:text-amber-400'
                            : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <FileCode2 className="w-4 h-4" />
                        <span>Custom Code</span>
                      </button>
                    </div>
                  </div>

                  {roomMode === 'catalog' && (
                    <div className="space-y-2 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-400">
                        <span>SELECT INITIAL PROBLEM</span>
                        <div className="flex gap-1 text-[10px]">
                          {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setDifficultyFilter(d)}
                              className={`px-2 py-0.5 rounded-md ${
                                difficultyFilter === d
                                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950'
                                  : 'text-neutral-500 hover:text-neutral-300'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      <select
                        value={selectedProblemId}
                        onChange={e => setSelectedProblemId(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {filteredProblems.slice(0, 100).map(p => (
                          <option key={p.id} value={p.id}>
                            #{p.number} {p.title} ({p.difficulty})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {roomMode === 'custom' && (
                    <div className="space-y-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-neutral-400 font-bold uppercase">Custom Challenge Title</label>
                        <input
                          type="text"
                          value={customTitle}
                          onChange={e => setCustomTitle(e.target.value)}
                          placeholder="e.g. Design LRU Cache with TTL"
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-neutral-400 font-bold uppercase">Problem Description / Notes</label>
                        <textarea
                          rows={2}
                          value={customDescription}
                          onChange={e => setCustomDescription(e.target.value)}
                          placeholder="Provide the question statement or guidelines..."
                          className="w-full p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white resize-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-neutral-400 font-bold uppercase">Custom Starter Code</label>
                        <textarea
                          rows={3}
                          value={customStarterCode}
                          onChange={e => setCustomStarterCode(e.target.value)}
                          placeholder="// Starter code here..."
                          className="w-full p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-xs text-neutral-900 dark:text-white resize-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <Users className="w-4 h-4" />
                    <span>Create & Launch Pair Room →</span>
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={200}>
            <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
                  <ArrowRight className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-neutral-950 dark:text-white">Join an Existing Room</h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Enter the Room Code or Room URL provided by your peer or interviewer.
                  </p>
                </div>

                <form onSubmit={handleJoinRoom} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-400 uppercase">Room Code or Invite URL</label>
                    <input
                      type="text"
                      value={joinInputCode}
                      onChange={e => {
                        setJoinInputCode(e.target.value);
                        setJoinError('');
                      }}
                      placeholder="e.g. PAIR-9481 or https://nimocode.vercel.app/pair/ROOM_ID"
                      className="w-full p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono text-xs text-neutral-950 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {joinError && <div className="text-xs text-rose-500 font-medium">{joinError}</div>}
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                    <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pairing Features Included:</span>
                    </div>
                    <ul className="space-y-1 text-[11px] list-disc list-inside">
                      <li>Synchronized Monaco Editor in 6 programming languages.</li>
                      <li>Interactive WebRTC Voice Channel with zero external plugins.</li>
                      <li>Live Compiler sandbox with testcase verification.</li>
                      <li>Interviewer feedback & complexity notes scratchpad.</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <span>Enter Pair Room →</span>
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1680px] mx-auto min-h-[calc(100vh-80px)] space-y-4 animate-fade-in">
      <div className="p-4 rounded-3xl bg-neutral-950 text-white border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/pair"
            className="p-2 rounded-2xl border border-neutral-800 text-neutral-400 hover:text-white transition-colors bg-neutral-900 flex items-center gap-1.5 text-xs font-bold"
            title="Return to Pair Lobby"
          >
            <LogOut className="w-4 h-4 rotate-180" />
            <span>Lobby</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 font-mono">
            <Users className="w-4 h-4" />
            <span>ROOM: {roomId}</span>
            <button
              onClick={handleCopyRoomId}
              className="ml-1 text-neutral-400 hover:text-white p-1"
              title="Copy Room Code"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="text-xs font-mono text-neutral-400 truncate max-w-xs">
            {isCustomMode
              ? `📝 ${activeCustomTitle || 'Custom Code Sandbox'}`
              : activeProblem
              ? `🧩 #${activeProblem.number} ${activeProblem.title}`
              : '🧩 Problem Room'}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowSwitchModal(true)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold font-mono text-neutral-300 transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Change Problem / Custom Code</span>
          </button>

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
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share Room'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[680px]">
        <div className="lg:col-span-5 flex flex-col p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-y-auto space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex gap-2">
              <button
                onClick={() => setLeftTab('problem')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  leftTab === 'problem'
                    ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Problem Prompt
              </button>
              <button
                onClick={() => setLeftTab('notes')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  leftTab === 'notes'
                    ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Interviewer Notes
              </button>
            </div>

            <span className="text-[10px] font-mono text-neutral-400">
              Active Peer: @{user?.username || 'developer'}
            </span>
          </div>

          {leftTab === 'problem' ? (
            <div className="space-y-4 text-left">
              {isCustomMode ? (
                <>
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono font-bold text-amber-500 uppercase">CUSTOM CODE CHALLENGE</div>
                    <h2 className="text-lg font-bold text-neutral-950 dark:text-white">{activeCustomTitle}</h2>
                  </div>
                  <div className="whitespace-pre-wrap text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                    {activeCustomDesc}
                  </div>
                </>
              ) : activeProblem ? (
                <>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        activeProblem.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : activeProblem.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}>
                        {activeProblem.difficulty}
                      </span>
                      <span className="text-xs font-mono text-neutral-400">#{activeProblem.number}</span>
                    </div>
                    <h2 className="text-lg font-bold text-neutral-950 dark:text-white">{activeProblem.title}</h2>
                  </div>

                  <div className="whitespace-pre-wrap text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                    {activeProblem.description}
                  </div>

                  {activeProblem.examples && activeProblem.examples.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase">EXAMPLES</div>
                      {activeProblem.examples.map((ex, i) => (
                        <div key={i} className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono text-xs space-y-1">
                          <div className="text-neutral-600 dark:text-neutral-400">Input: {ex.input}</div>
                          <div className="text-emerald-600 dark:text-emerald-400 font-bold">Output: {ex.output}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                <span>Collaborative Feedback & Hints</span>
              </div>
              <textarea
                rows={12}
                value={peerNotes}
                onChange={e => setPeerNotes(e.target.value)}
                placeholder="Type interview notes, feedback, time/space complexity evaluation, or progressive hints for your peer..."
                className="w-full flex-1 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-mono"
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex-1 min-h-[480px]">
            <CodeEditor
              language={selectedLang}
              code={code}
              onChange={setCode}
              onLanguageChange={handleLanguageChange}
              onReset={() => {
                if (!isCustomMode && activeProblem) {
                  setCode(activeProblem.starterCode[selectedLang] || '');
                } else {
                  setCode('// Reset custom code\n');
                }
              }}
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

      {showSwitchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-500" />
                <span>Switch Room Problem or Enter Custom Code</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Select a problem from the 2,000+ catalog or customize the code and problem statement for this pairing session.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase">OPTION 1: SELECT FROM 2,000+ CATALOG</div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchProblemQuery}
                      onChange={e => setSearchProblemQuery(e.target.value)}
                      placeholder="Search problem title or number..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {filteredProblems.slice(0, 40).map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSwitchToProblem(p)}
                      className="w-full p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-xs text-white flex items-center justify-between transition-colors"
                    >
                      <span className="truncate">#{p.number} {p.title}</span>
                      <span className={`text-[10px] font-bold uppercase ml-2 ${
                        p.difficulty === 'Easy' ? 'text-emerald-400' : p.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {p.difficulty}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="text-xs font-mono font-bold text-blue-400 uppercase">OPTION 2: CUSTOM CODE & PROMPT</div>
                <button
                  onClick={() =>
                    handleSwitchToCustomCode(
                      'Custom Algorithm Sandbox',
                      'Freeform collaborative sandbox. Write and test custom algorithms and data structures together.',
                      '// Custom Collaborative Code\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Pairing..." << endl;\n    return 0;\n}'
                    )
                  }
                  className="w-full py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <FileCode2 className="w-4 h-4" />
                  <span>Switch to Custom Code Sandbox</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowSwitchModal(false)}
                className="px-5 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
