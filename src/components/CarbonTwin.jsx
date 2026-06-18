/**
 * CarbonTwin — AI-generated persona card.
 * Props: twin { name, archetype, tagline, topCategory, strengths, opportunities }
 *        isLoading: boolean
 */
import { Sparkles, TrendingUp, Zap } from 'lucide-react';

const ARCHETYPE_ICONS = {
  Pioneer:  '🚀',
  Explorer: '🌍',
  Guardian: '🛡️',
  Catalyst: '⚡',
  Visionary:'🔭',
};

const CATEGORY_COLORS = {
  Commute:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Food:     'text-amber-400   bg-amber-500/10   border-amber-500/20',
  Energy:   'text-blue-400    bg-blue-500/10    border-blue-500/20',
  Lifestyle:'text-purple-400  bg-purple-500/10  border-purple-500/20',
};

export const CarbonTwin = ({ twin, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card-dark p-6 space-y-4 animate-fade-in">
        <div className="skeleton h-5 w-24 rounded-full" />
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="flex gap-3 mt-4">
          <div className="skeleton h-24 flex-1 rounded-xl" />
          <div className="skeleton h-24 flex-1 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!twin) return null;

  const categoryClass = CATEGORY_COLORS[twin.topCategory] || CATEGORY_COLORS.Lifestyle;
  const icon = ARCHETYPE_ICONS[twin.archetype] || '🌱';

  return (
    <div className="card-glow p-6 flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-400">
            AI Carbon Twin
          </span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${categoryClass}`}>
          {twin.topCategory}
        </span>
      </div>

      {/* Persona name */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{icon}</span>
          <h2 className="text-2xl font-extrabold text-white leading-tight">
            {twin.name}
          </h2>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          {twin.tagline}
        </p>
      </div>

      {/* Strengths & Opportunities */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">Strengths</span>
          </div>
          <ul className="space-y-1.5">
            {twin.strengths?.map((s, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                <span className="text-emerald-500 mt-0.5">•</span> {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400">Opportunities</span>
          </div>
          <ul className="space-y-1.5">
            {twin.opportunities?.map((o, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                <span className="text-amber-500 mt-0.5">•</span> {o}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
