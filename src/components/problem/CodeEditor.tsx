import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, RotateCcw, Settings2, FileCode, Check, Sparkles } from 'lucide-react';
import type { ProgrammingLanguage } from '../../types';

interface CodeEditorProps {
  language: ProgrammingLanguage;
  code: string;
  onChange: (value: string) => void;
  onLanguageChange?: (lang: ProgrammingLanguage) => void;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  isRunning?: boolean;
}

const LANGUAGE_MAP: Record<ProgrammingLanguage, string> = {
  cpp: 'cpp',
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  go: 'go',
  rust: 'rust'
};

const LANGUAGES: { id: ProgrammingLanguage; label: string }[] = [
  { id: 'cpp', label: 'C++ 20' },
  { id: 'python', label: 'Python 3.11' },
  { id: 'javascript', label: 'JavaScript (Node.js)' },
  { id: 'java', label: 'Java 17' },
  { id: 'go', label: 'Go 1.21' },
  { id: 'rust', label: 'Rust 1.75' }
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  code,
  onChange,
  onLanguageChange,
  onRun,
  onSubmit,
  onReset,
  isRunning = false
}) => {
  const [minimap, setMinimap] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copilotEnabled, setCopilotEnabled] = useState(true);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [fontSize, setFontSize] = useState<number>(14);

  const getCopilotSuggestion = () => {
    if (!copilotEnabled) return null;
    const lower = code.toLowerCase();
    if (lower.includes('vector') && !lower.includes('unordered_map') && language === 'cpp') {
      return 'unordered_map<int, int> lookupTable;';
    }
    if (lower.includes('for') && !lower.includes('return') && language === 'cpp') {
      return 'if (lookupTable.find(complement) != lookupTable.end()) return {lookupTable[complement], i};';
    }
    if (language === 'python' && !lower.includes('def twoSum')) {
      return 'seen = {}\n        for i, val in enumerate(nums):\n            if target - val in seen:\n                return [seen[target - val], i]\n            seen[val] = i';
    }
    return null;
  };

  const activeSuggestion = getCopilotSuggestion();

  const handleApplyCopilot = () => {
    if (activeSuggestion) {
      onChange(code + (code.endsWith('\n') ? '' : '\n') + '        ' + activeSuggestion);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="flex flex-col h-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-neutral-100/90 dark:bg-neutral-950/90 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <FileCode className="w-4 h-4 text-neutral-500" />
            <span>Language:</span>
          </div>

          <select
            value={language}
            onChange={e => onLanguageChange ? onLanguageChange(e.target.value as ProgrammingLanguage) : undefined}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>

          <select
            value={editorTheme}
            onChange={e => setEditorTheme(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-neutral-100 focus:outline-none"
            title="Monaco Theme"
          >
            <option value="vs-dark">🌙 VS Dark</option>
            <option value="light">☀️ Light</option>
          </select>

          <select
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100 focus:outline-none"
            title="Font Size"
          >
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
          </select>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCopilotEnabled(!copilotEnabled)}
            title="Toggle AI Copilot Suggestions"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              copilotEnabled
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copilot</span>
          </button>

          <button
            onClick={() => setMinimap(!minimap)}
            title="Toggle Minimap"
            className={`p-1.5 rounded-xl border text-xs font-medium transition-all ${
              minimap
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            title="Copy Code"
            className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-xs font-medium transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <RotateCcw className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onReset}
            title="Reset Starter Code"
            className="px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-xs font-semibold transition-all"
          >
            Reset
          </button>

          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-bold text-xs transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run
          </button>

          <button
            onClick={onSubmit}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            Submit
          </button>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 min-h-[350px] relative">
        <Editor
          height="100%"
          language={LANGUAGE_MAP[language]}
          value={code}
          theme={editorTheme}
          onChange={val => onChange(val || '')}
          options={{
            fontSize: fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            minimap: { enabled: minimap },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            automaticLayout: true,
            tabSize: 4,
            lineNumbers: 'on',
            padding: { top: 12, bottom: 12 },
            cursorBlinking: 'smooth'
          }}
        />

        {/* AI Copilot Ghost Suggestion Pill */}
        {activeSuggestion && (
          <div className="absolute bottom-4 left-4 right-4 z-20 p-2.5 px-4 rounded-2xl bg-neutral-950/90 border border-amber-500/30 text-xs font-mono text-neutral-300 backdrop-blur-md flex items-center justify-between shadow-xl animate-fade-in">
            <div className="flex items-center gap-2 truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-neutral-400">AI Suggestion:</span>
              <span className="text-amber-300 font-bold truncate">{activeSuggestion.split('\n')[0]}</span>
            </div>
            <button
              onClick={handleApplyCopilot}
              className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-[11px] font-extrabold transition-all shrink-0 ml-3"
            >
              Insert Tab ⇥
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

