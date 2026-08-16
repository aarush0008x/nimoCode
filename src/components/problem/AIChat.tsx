import React, { useState } from 'react';
import { Sparkles, Send, Lightbulb, Eye, AlertCircle, Cpu, Clock } from 'lucide-react';
import type { Problem } from '../../types';

interface AIChatProps {
  problem: Problem;
  currentCode: string;
  externalPrompt?: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  showRevealButton?: boolean;
  fullExplanation?: string;
}

export const AIChat: React.FC<AIChatProps> = ({ problem, currentCode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I'm CodeArena AI, your algorithmic coach for "${problem.title}". I've inspected your current ${currentCode.length > 50 ? 'solution snippet' : 'workspace'} and I'm ready to provide hints, analyze time complexity, or explain errors.`
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      let aiText = '';
      let showReveal = false;
      let fullExp = '';

      const lower = textToSend.toLowerCase();

      if (lower.includes('explain this problem') || lower.includes('explain problem')) {
        aiText = `The problem asks us to find indices of two numbers in an array that add up to a target sum.\nKey constraints to consider:\n1. Exactly one valid solution exists.\n2. You cannot use the same element twice.\nWhat data structure can help you look up previous elements in O(1) time?`;
      } else if (lower.includes('hint') || lower.includes('give me a hint')) {
        aiText = `💡 Hint 1: If you are at value X, the complementary value you need to find is (target - X).\n💡 Hint 2: Try building a lookup mapping as you iterate through the array rather than using nested loops.`;
      } else if (lower.includes('error') || lower.includes('why is my solution failing') || lower.includes('failing')) {
        aiText = `Looking at your code, your logic works for simple non-repeating inputs, but make sure your lookup handles duplicate values correctly (e.g. nums = [3, 3], target = 6).\nConsider storing elements as you step through the array rather than pre-populating.`;
      } else if (lower.includes('complexity') || lower.includes('time complexity')) {
        aiText = `⚡ Current Time Complexity: O(N) using Hash Map lookup vs O(N^2) using brute-force nested loops.\n🧠 Space Complexity: O(N) auxiliary space to store elements in hash table.`;
      } else if (lower.includes('optimize') || lower.includes('optimization')) {
        aiText = `You can achieve a single-pass solution by checking if (target - num) exists in your map BEFORE inserting current num. This avoids self-matching bugs and reduces code length.`;
        showReveal = true;
        fullExp = `Complete Solution Walkthrough:\nIterate through the array once. For each element num at index i, check if (target - num) exists in map. If yes, return [map[target - num], i]. Otherwise set map[num] = i.`;
      } else {
        aiText = `Based on your request, consider how your lookup structure behaves when evaluating complements. Would you like me to analyze your time complexity or give you a targeted hint?`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiText,
          showRevealButton: showReveal,
          fullExplanation: fullExp
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleReveal = (msgId: string) => {
    setRevealedIds(prev => new Set(prev).add(msgId));
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
      {/* AI Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold text-xs shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-neutral-900 dark:text-white">CodeArena AI</span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md border border-neutral-300 dark:border-neutral-700">
                COACH
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <button
          onClick={() => handleSendMessage('Give me a hint')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-all shrink-0 shadow-xs"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Give me a hint
        </button>

        <button
          onClick={() => handleSendMessage('Explain my error')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-all shrink-0 shadow-xs"
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          Explain my error
        </button>

        <button
          onClick={() => handleSendMessage('Explain time complexity')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-all shrink-0 shadow-xs"
        >
          <Clock className="w-3.5 h-3.5 text-neutral-500" />
          Time complexity
        </button>

        <button
          onClick={() => handleSendMessage('Suggest optimization')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-all shrink-0 shadow-xs"
        >
          <Cpu className="w-3.5 h-3.5 text-emerald-500" />
          Suggest optimization
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[220px]">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-neutral-900 text-white font-medium rounded-br-none dark:bg-white dark:text-neutral-950 font-semibold'
                  : 'bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.showRevealButton && !revealedIds.has(msg.id) && (
                <button
                  onClick={() => handleReveal(msg.id)}
                  className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Reveal Full Explanation
                </button>
              )}

              {msg.showRevealButton && revealedIds.has(msg.id) && msg.fullExplanation && (
                <div className="mt-3 p-3 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 font-mono">
                  {msg.fullExplanation}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-neutral-100 dark:bg-neutral-950 px-4 py-3 rounded-2xl rounded-bl-none text-xs text-neutral-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse delay-150" />
              <span className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse delay-300" />
              <span className="ml-2">Analyzing code pattern...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={e => setInputPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputPrompt)}
          placeholder="Ask CodeArena AI a question..."
          className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        />
        <button
          onClick={() => handleSendMessage(inputPrompt)}
          disabled={!inputPrompt.trim()}
          className="p-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 disabled:opacity-40 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
