import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, BrainCircuit, SlidersHorizontal, Leaf, Zap, Globe2, ChevronRight } from 'lucide-react';
import { useEco } from '../context/EcoContext';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Live Dashboard',
    desc: 'Interactive breakdown of your commute, food, energy, and lifestyle emissions — calculated with IPCC-aligned factors.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/5',
  },
  {
    icon: BrainCircuit,
    title: 'AI Recommendations',
    desc: 'Gemini AI reads your exact profile and generates hyper-targeted action items — not generic advice.',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/5',
  },
  {
    icon: SlidersHorizontal,
    title: 'Future Simulator',
    desc: 'Drag sliders to project "what if" scenarios. See exactly how one WFH day saves metric tons of CO₂/year.',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/5',
  },
];

const STATS = [
  { value: '4.7t',  label: 'Global avg CO₂/yr' },
  { value: '14t',   label: 'US avg CO₂/yr' },
  { value: '2.3t',  label: 'Paris Agreement target' },
];

export const Landing = () => {
  const navigate  = useNavigate();
  const { hasCompletedAssessment } = useEco();

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 overflow-x-hidden">

      {/* ── Background mesh ─────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-800/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-slate-800/30 rounded-full blur-[100px]" />
      </div>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pt-32 pb-24 sm:pt-44 sm:pb-32 max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 animate-fade-in">
          <Leaf className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-400 tracking-wide">
            AI-Powered Sustainability Intelligence
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold leading-[1.08] tracking-tight text-white mb-8 animate-fade-in-up">
          Measure, simulate, and{' '}
          <br className="hidden sm:block" />
          <span className="text-gradient">shrink your footprint.</span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium mb-12 animate-fade-in-up delay-100">
          EcoPilot AI gives working professionals a precise carbon baseline, then uses Gemini AI to generate a personalized reduction roadmap — in under 2 minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
          <button
            id="cta-start-assessment"
            onClick={() => navigate('/assessment')}
            className="btn-primary text-base px-8 py-4 group"
          >
            {hasCompletedAssessment ? 'View Dashboard' : 'Start Free Assessment'}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          {hasCompletedAssessment && (
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-ghost text-base px-8 py-4"
            >
              My Dashboard
            </button>
          )}
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────── */}
      <section className="relative z-10 border-y border-white/5 bg-slate-900/40 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <div className="text-3xl sm:text-4xl font-extrabold text-gradient mb-1">{s.value}</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" className="relative z-10 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="badge-green mb-4 inline-flex">
              <Zap className="h-3 w-3" /> The Engine
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 mb-5">
              Everything you need to act.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              Built for hackathon speed. Designed for enterprise clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`card-dark p-8 border ${f.border} ${f.bg} animate-fade-in-up`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`h-12 w-12 rounded-xl border ${f.border} flex items-center justify-center mb-6 ${f.bg}`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              From zero to AI insights in 3 steps.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Answer 5 questions', desc: 'Commute mode, distance, diet, office frequency, lifestyle.' },
              { step: '02', title: 'Get your carbon baseline', desc: 'Physics-based calculation using IPCC emission factors — no AI guesswork.' },
              { step: '03', title: 'Receive AI action plan', desc: 'Gemini generates your Carbon Twin, recommendations, challenges, and a full report.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-5 items-start">
                <span className="text-4xl font-black text-emerald-600/40 font-mono shrink-0">{item.step}</span>
                <div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────── */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Globe2 className="h-12 w-12 text-emerald-500 mx-auto mb-8 animate-float" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Ready to know your number?
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Takes 90 seconds. No account required.
          </p>
          <button
            onClick={() => navigate('/assessment')}
            className="btn-primary text-lg px-10 py-5 group animate-pulse-green"
          >
            Analyze My Footprint <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};
