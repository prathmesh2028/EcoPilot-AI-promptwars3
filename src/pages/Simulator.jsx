import { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useEco } from '../context/EcoContext';
import { calculateFootprint } from '../utils/carbonCalculators';
import { generateSimulationInsight } from '../services/gemini';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, ReferenceLine,
} from 'recharts';
import { SlidersHorizontal, TrendingDown, TrendingUp, Minus, Sparkles, Loader2 } from 'lucide-react';

const COMMUTE_OPTIONS  = ['Gas Car', 'Electric Vehicle', 'Public Transit', 'Bike / Walk'];
const FOOD_OPTIONS     = ['Meat Lover', 'Omnivore', 'Flexitarian', 'Vegetarian', 'Vegan'];
const LIFESTYLE_OPTIONS = ['High', 'Medium', 'Low'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.fill }} className="text-sm font-bold">
          {p.name}: {Number(p.value).toLocaleString()} kg
        </p>
      ))}
    </div>
  );
};

export const Simulator = () => {
  const { userData, carbonMetrics, hasCompletedAssessment } = useEco();

  const [sim, setSim]       = useState(userData ? { ...userData } : {});
  const [insight, setInsight] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const simMetrics = useMemo(() => {
    if (!userData) return carbonMetrics;
    return calculateFootprint(sim);
  }, [sim, userData, carbonMetrics]);

  if (!hasCompletedAssessment) return <Navigate to="/assessment" replace />;

  const setSField = (k, v) => setSim(prev => ({ ...prev, [k]: v }));

  const baseline   = carbonMetrics.total;
  const simTotal   = simMetrics.total;
  const savings    = baseline - simTotal;
  const savingsPct = baseline > 0 ? Math.round((savings / baseline) * 100) : 0;

  const chartData = carbonMetrics.breakdown.map(b => ({
    name: b.name.replace('Home/Office Energy', 'Energy').replace('General Lifestyle', 'Lifestyle'),
    Baseline:  b.value,
    Simulated: simMetrics.breakdown.find(s => s.name === b.name)?.value || 0,
  }));

  const fetchInsight = async () => {
    setLoadingAI(true);
    setInsight(null);
    try {
      const data = await generateSimulationInsight(userData, sim, baseline, simTotal);
      setInsight(data);
    } finally {
      setLoadingAI(false);
    }
  };

  const reset = () => { setSim({ ...userData }); setInsight(null); };

  const SavingsIcon = savings > 0 ? TrendingDown : savings < 0 ? TrendingUp : Minus;
  const savColor    = savings > 0 ? 'text-emerald-400' : savings < 0 ? 'text-red-400' : 'text-slate-400';
  const savBg       = savings > 0 ? 'bg-emerald-500/10 border-emerald-500/20' : savings < 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-800 border-white/5';

  return (
    <div className="bg-slate-950 min-h-[calc(100vh-68px)] px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-end justify-between pb-6 border-b border-white/5 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <SlidersHorizontal className="h-4 w-4 text-purple-400" />
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Future Simulator</h1>
            </div>
            <p className="text-slate-500 text-sm">Drag controls to project behavioral changes. All calculations are deterministic — no AI.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Controls panel ──────────────────────────────── */}
          <div className="lg:col-span-4 space-y-4 animate-fade-in-up delay-100">
            <div className="card-dark p-6 space-y-7">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Adjust Variables</h2>
                <button onClick={reset} className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Reset
                </button>
              </div>

              {/* Office days */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-semibold text-white">Office Days / Week</label>
                  <span className="text-base font-black text-emerald-400 font-mono">{sim.officeDays}</span>
                </div>
                <input
                  type="range" min={0} max={7} step={1}
                  value={sim.officeDays ?? 3}
                  onChange={e => setSField('officeDays', Number(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #059669 0%, #059669 ${((sim.officeDays ?? 3) / 7) * 100}%, rgba(255,255,255,0.1) ${((sim.officeDays ?? 3) / 7) * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <div className="flex justify-between text-[10px] text-slate-600 font-medium">
                  <span>0 (Full WFH)</span><span>7 (Full Office)</span>
                </div>
              </div>

              {/* Commute distance */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-semibold text-white">Commute Distance</label>
                  <span className="text-base font-black text-emerald-400 font-mono">{sim.commuteDistance} mi</span>
                </div>
                <input
                  type="range" min={0} max={120} step={5}
                  value={sim.commuteDistance ?? 20}
                  onChange={e => setSField('commuteDistance', Number(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #059669 0%, #059669 ${((sim.commuteDistance ?? 20) / 120) * 100}%, rgba(255,255,255,0.1) ${((sim.commuteDistance ?? 20) / 120) * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </div>

              {/* Commute mode */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white block">Commute Mode</label>
                <select
                  value={sim.commuteMode}
                  onChange={e => setSField('commuteMode', e.target.value)}
                  className="input-dark"
                >
                  {COMMUTE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Diet */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white block">Diet</label>
                <select
                  value={sim.foodLifestyle}
                  onChange={e => setSField('foodLifestyle', e.target.value)}
                  className="input-dark"
                >
                  {FOOD_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Lifestyle */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white block">Lifestyle Intensity</label>
                <select
                  value={sim.lifestylePattern}
                  onChange={e => setSField('lifestylePattern', e.target.value)}
                  className="input-dark"
                >
                  {LIFESTYLE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* AI insight button */}
              <button
                onClick={fetchInsight}
                disabled={loadingAI || savings === 0}
                className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loadingAI
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</>
                  : <><Sparkles className="h-4 w-4" /> Explain with AI</>
                }
              </button>
            </div>

            {/* Insight card */}
            {insight && !loadingAI && (
              <div className="card-glow p-5 space-y-4 animate-fade-in">
                <h3 className="text-sm font-bold text-emerald-400">{insight.headline}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{insight.narrative}</p>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-900/60 rounded-xl p-3 border border-white/5">
                    <div className="text-xl font-extrabold text-white">{insight.treesEquivalent}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Trees Equiv.</div>
                  </div>
                  <div className="bg-slate-900/60 rounded-xl p-3 border border-white/5">
                    <div className="text-xl font-extrabold text-white">{insight.flightsEquivalent}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Flying saved</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Visualization panel ────────────────────────── */}
          <div className="lg:col-span-8 space-y-4 animate-fade-in-up delay-200">
            {/* Delta header */}
            <div className="card-dark p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Simulated Total</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-white font-mono tracking-tighter">
                    {simTotal >= 1000 ? `${(simTotal / 1000).toFixed(1)}t` : simTotal.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-500 font-bold">kg CO₂e</span>
                </div>
              </div>
              <div className={`flex flex-col items-center px-6 py-3 rounded-2xl border ${savBg}`}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Net Change</div>
                <div className={`flex items-center gap-1.5 font-extrabold text-2xl font-mono ${savColor}`}>
                  <SavingsIcon className="h-5 w-5" />
                  {savings >= 0 ? '-' : '+'}{Math.abs(savings).toLocaleString()} kg
                </div>
                {savings !== 0 && (
                  <div className={`text-xs font-bold mt-1 ${savColor}`}>
                    {Math.abs(savingsPct)}% {savings > 0 ? 'reduction' : 'increase'}
                  </div>
                )}
              </div>
            </div>

            {/* Stacked comparison chart */}
            <div className="card-dark p-6 sm:p-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Category Comparison</h2>
              <div className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={v => `${v}kg`} tick={{ fontSize: 11, fill: '#475569' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '16px', fontSize: '12px', fontWeight: '600', color: '#64748b' }} />
                    <ReferenceLine y={baseline / chartData.length} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                    <Bar dataKey="Baseline"  fill="rgba(255,255,255,0.08)" radius={[5, 5, 0, 0]} maxBarSize={48} />
                    <Bar dataKey="Simulated" fill="#059669"               radius={[5, 5, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Per-category delta pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {chartData.map((c) => {
                const delta = c.Simulated - c.Baseline;
                const isDown = delta < 0;
                return (
                  <div key={c.name} className="card-stat flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{c.name}</span>
                    <span className="text-lg font-extrabold text-white">{c.Simulated.toLocaleString()} kg</span>
                    {delta !== 0 && (
                      <span className={`text-xs font-bold ${isDown ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isDown ? '↓' : '↑'} {Math.abs(delta).toLocaleString()} kg
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
