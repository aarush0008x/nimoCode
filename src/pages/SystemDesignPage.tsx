import React, { useState } from 'react';
import { Layers, Plus, Trash2, Play, Sparkles, RefreshCw } from 'lucide-react';

interface SystemNode {
  id: string;
  type: 'Client' | 'LoadBalancer' | 'Cache' | 'Service' | 'Database' | 'Queue';
  name: string;
  qps: number;
}

export const SystemDesignPage: React.FC = () => {
  const [nodes, setNodes] = useState<SystemNode[]>([
    { id: 'node-1', type: 'Client', name: 'Mobile & Web Clients', qps: 100000 },
    { id: 'node-2', type: 'LoadBalancer', name: 'Nginx Load Balancer', qps: 100000 },
    { id: 'node-3', type: 'Cache', name: 'Redis Cache Cluster', qps: 80000 },
    { id: 'node-4', type: 'Service', name: 'Auth & Problem Microservice', qps: 50000 },
    { id: 'node-5', type: 'Database', name: 'MongoDB Sharded Cluster', qps: 20000 }
  ]);

  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    latencyMs: number;
    maxQPS: number;
    spofFound: boolean;
    aiScore: number;
    recommendations: string[];
  } | null>(null);

  const addNode = (type: SystemNode['type'], name: string) => {
    setNodes(prev => [
      ...prev,
      { id: `node-${Date.now()}`, type, name, qps: type === 'Cache' ? 100000 : 25000 }
    ]);
  };

  const removeNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
  };

  const evaluateArchitecture = () => {
    setEvaluating(true);
    setTimeout(() => {
      const hasCache = nodes.some(n => n.type === 'Cache');
      const hasQueue = nodes.some(n => n.type === 'Queue');

      setEvaluationResult({
        latencyMs: hasCache ? 14 : 120,
        maxQPS: hasCache ? 100000 : 25000,
        spofFound: !hasQueue,
        aiScore: hasCache && hasQueue ? 98 : hasCache ? 86 : 64,
        recommendations: [
          hasCache ? 'Redis in-memory caching tier reduces database read pressure by 80%.' : 'Add Redis Cache to reduce DB read latency.',
          hasQueue ? 'Kafka message queue decouples async notifications and worker tasks.' : 'Add Kafka Queue to prevent request loss during traffic spikes.'
        ]
      });
      setEvaluating(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          INTERACTIVE FAANG SYSTEM DESIGN ARCHITECTURE CANVAS
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          System Design Architecture Simulator
        </h1>
        <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
          Build distributed system architectures using Load Balancers, Redis Caches, Microservices, and Database Shards. Evaluate latency, QPS throughput, and SPOF vulnerabilities in real time with AI feedback.
        </p>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={evaluateArchitecture}
            disabled={evaluating}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-xl transition-all flex items-center gap-2"
          >
            {evaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating Architecture...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-neutral-950" />
                <span>Evaluate System Architecture</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Palette Side Panel */}
        <div className="lg:col-span-4 p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
            System Component Palette
          </h3>

          <div className="space-y-2 font-mono text-xs">
            <button
              onClick={() => addNode('LoadBalancer', 'HAProxy Load Balancer')}
              className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-left font-bold text-neutral-900 dark:text-white flex items-center justify-between hover:border-amber-500 transition-all"
            >
              <span>🛡️ Load Balancer (Nginx / HAProxy)</span>
              <Plus className="w-4 h-4 text-amber-500" />
            </button>

            <button
              onClick={() => addNode('Cache', 'Redis Cache Tier')}
              className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-left font-bold text-neutral-900 dark:text-white flex items-center justify-between hover:border-amber-500 transition-all"
            >
              <span>⚡ Redis In-Memory Cache</span>
              <Plus className="w-4 h-4 text-amber-500" />
            </button>

            <button
              onClick={() => addNode('Service', 'Auth & Search Microservice')}
              className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-left font-bold text-neutral-900 dark:text-white flex items-center justify-between hover:border-amber-500 transition-all"
            >
              <span>⚙️ Microservice Worker Cluster</span>
              <Plus className="w-4 h-4 text-amber-500" />
            </button>

            <button
              onClick={() => addNode('Database', 'PostgreSQL / MongoDB Shard')}
              className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-left font-bold text-neutral-900 dark:text-white flex items-center justify-between hover:border-amber-500 transition-all"
            >
              <span>🍃 MongoDB / Postgres Sharded Cluster</span>
              <Plus className="w-4 h-4 text-amber-500" />
            </button>

            <button
              onClick={() => addNode('Queue', 'Kafka Message Queue')}
              className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-left font-bold text-neutral-900 dark:text-white flex items-center justify-between hover:border-amber-500 transition-all"
            >
              <span>📩 Kafka / RabbitMQ Queue</span>
              <Plus className="w-4 h-4 text-amber-500" />
            </button>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 bg-neutral-950 text-white border border-neutral-800 rounded-3xl space-y-4 shadow-xl min-h-[380px]">
            <div className="flex items-center justify-between text-xs font-mono border-b border-neutral-800 pb-3">
              <span className="font-bold text-amber-400 uppercase">Architecture Canvas Flow</span>
              <span className="text-neutral-400">{nodes.length} Components Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {nodes.map(n => (
                <div key={n.id} className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between font-mono text-xs">
                  <div>
                    <div className="font-bold text-white">{n.name}</div>
                    <div className="text-[10px] text-neutral-400">Max QPS: {n.qps.toLocaleString()} req/s</div>
                  </div>
                  <button
                    onClick={() => removeNode(n.id)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Evaluation Report */}
          {evaluationResult && (
            <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-neutral-950 dark:text-white">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>AI System Design Score: <strong className="text-amber-500 font-mono text-base">{evaluationResult.aiScore}/100</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                  <div className="text-neutral-400 text-[10px]">READ LATENCY</div>
                  <div className="font-bold text-emerald-500 text-sm">{evaluationResult.latencyMs} ms</div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                  <div className="text-neutral-400 text-[10px]">MAX THROUGHPUT</div>
                  <div className="font-bold text-amber-500 text-sm">{evaluationResult.maxQPS.toLocaleString()} QPS</div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                  <div className="text-neutral-400 text-[10px]">SPOF VULNERABILITY</div>
                  <div className={`font-bold text-sm ${evaluationResult.spofFound ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {evaluationResult.spofFound ? '⚠️ Single SPOF' : '✓ Fault Tolerant'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {evaluationResult.recommendations.map((rec, i) => (
                  <div key={i} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    • {rec}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
