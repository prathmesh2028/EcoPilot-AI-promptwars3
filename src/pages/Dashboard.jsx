import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useEco } from '../context/EcoContext';
import { generateCarbonTwin } from '../services/gemini';
import { EcoImpactMeter } from '../components/EcoImpactMeter';
import { CarbonTwin } from '../components/CarbonTwin';

import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { Activity, Wind, ArrowRight, Users, Target } from 'lucide-react';

const PIE_COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7'];

const StatCard = ({ label, value, sub, icon: Icon, accent }) => (
  <div className="card-stat flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>
      {Icon && <Icon className={`h-4 w-4 ${accent || 'text-slate-600'}`} />}
    </div>
    <div>
      <span className="text-4xl font-extrabold text-white font-mono tracking-tighter">{value}</span>
      {sub && <span className="text-sm text-slate-500 ml-2 font-medium">{sub}</span>}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-sm font-bold text-white">
          {p.value.toLocaleString()} <span className="text-slate-400 font-normal">kg CO₂e</span>
        </p>
      ))}
    </div>
  );
};

export const Dashboard = () => {
  const { userData, carbonMetrics, impactLevel, meterValue, comparisonStats, hasCompletedAssessment, aiCache, updateAiCache } = useEco();
  const [twin, setTwin]         = useState(aiCache.twin || null);
  const [twinLoading, setTwinLoading] = useState(false);

  useEffect(() => {
    if (!userData || aiCache.twin) return;
    setTwinLoading(true);
    generateCarbonTwin(userData, carbonMetrics)
      .then(t => { setTwin(t); updateAiCache('twin', t); })
      .finally(() => setTwinLoading(false));
  }, [userData]);

  if (!hasCompletedAssessment) return <Navigate to="/assessment" replace />;

  const { total, breakdown } = carbonMetrics;
  const benchmarkData = [
    { name: 'You',    value: total },
    { name: 'Global', value: 4700 },
    { name: 'US Avg', value: 14000 },
    { name: 'Paris',  value: 2300 },
  ];

  return (
    <div className="bg-slate-950 min-h-[calc(100vh-68px)] px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Page header ────────────────────────────────── */}
        <div className="flex items-end justify-between pb-6 border-b border-white/5 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Your personal carbon intelligence overview.</p>
          </div>
          <Link to="/action-plan" className="btn-primary text-sm hidden sm:inline-flex">
            Get AI Plan <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ── Top row: stats ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up delay-100">
          <StatCard
            label="Annual Emissions"
            value={total >= 1000 ? `${(total / 1000).toFixed(1)}t` : total.toLocaleString()}
            sub="kg CO₂e"
            icon={Wind}
            accent="text-emerald-500"
          />
          <StatCard
            label="vs Global Average"
            value={`${comparisonStats.vsGlobal}%`}
            sub="of 4.7t baseline"
            icon={Activity}
            accent="text-blue-400"
          />
          <StatCard
            label="vs Paris Target"
            value={`+${Math.round(Math.max(0, total - 2300)).toLocaleString()}`}
            sub="kg above 2.3t target"
            icon={Target}
            accent="text-amber-400"
          />
        </div>

        {/* ── Middle: Meter + Pie ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-200">
          {/* Impact Meter */}
          <div className="card-dark p-8 flex flex-col items-center justify-center gap-6">
            <div className="text-center">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-1">Impact Meter</h2>
            </div>
            <EcoImpactMeter value={meterValue} total={total} impactLevel={impactLevel} />
            <div className="w-full bg-slate-900 rounded-xl p-4 text-sm text-slate-400 leading-relaxed border border-white/5">
              Your footprint is in the{' '}
              <strong className="text-white">
                {meterValue < 30 ? 'excellent' : meterValue < 55 ? 'good' : meterValue < 78 ? 'average' : 'high'}
              </strong>{' '}
              range. The Paris Agreement target is{' '}
              <strong className="text-emerald-400">2.3 tonnes</strong> per person.
            </div>
          </div>

          {/* Pie Chart */}
          <div className="card-dark p-8 lg:col-span-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Emissions Breakdown</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    cx="50%" cy="48%"
                    innerRadius={75}
                    outerRadius={115}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {breakdown.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', paddingTop: '12px' }}
                    formatter={v => <span style={{ color: '#94a3b8' }}>{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {breakdown.map((b, i) => (
                <div key={b.name} className="bg-slate-900/60 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 truncate">{b.name}</span>
                  </div>
                  <div className="text-lg font-bold text-white">{b.pct}%</div>
                  <div className="text-xs text-slate-500">{b.value.toLocaleString()} kg</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom: Carbon Twin + Benchmark Bar ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-300">
          {/* Carbon Twin */}
          <CarbonTwin twin={twin} isLoading={twinLoading} />

          {/* Benchmark bar chart */}
          <div className="card-dark p-8">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Global Benchmark</h2>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}t`} tick={{ fontSize: 11, fill: '#475569' }} dx={-4} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={52}>
                    {benchmarkData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={i === 0 ? '#059669' : i === 3 ? '#34d399' : 'rgba(255,255,255,0.08)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── CTA row ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up delay-400">
          {[
            { to: '/action-plan', label: 'Get AI Recommendations', emoji: '✨', sub: 'Personalised action items' },
            { to: '/simulator',   label: 'Simulate Changes',        emoji: '⚗️', sub: 'Project future scenarios' },
            { to: '/report',      label: 'Generate Report',         emoji: '📄', sub: 'Full executive PDF' },
          ].map(c => (
            <Link key={c.to} to={c.to} className="card-dark p-5 flex items-center gap-4 group hover:border-emerald-500/20 transition-all">
              <span className="text-3xl">{c.emoji}</span>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{c.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{c.sub}</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};
