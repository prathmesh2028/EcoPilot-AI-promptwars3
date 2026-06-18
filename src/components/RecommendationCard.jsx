/**
 * RecommendationCard — displays one AI-generated recommendation.
 * Props: rec { id, title, description, impact, category, saving, effort, timeframe }
 */
import { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';

const IMPACT_STYLES = {
  High:   'badge-red',
  Medium: 'badge-amber',
  Low:    'badge-green',
};

const EFFORT_STYLES = {
  Easy:   'text-emerald-400',
  Medium: 'text-amber-400',
  Hard:   'text-red-400',
};

const CATEGORY_DOT = {
  Commute:   'bg-emerald-500',
  Food:      'bg-amber-500',
  Energy:    'bg-blue-500',
  Lifestyle: 'bg-purple-500',
};

export const RecommendationCard = ({ rec }) => {
  const [done, setDone]       = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`group flex gap-4 items-start p-5 border-b border-white/5 last:border-0 transition-all duration-200 ${
        done ? 'opacity-50' : 'hover:bg-white/[0.02]'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => setDone(v => !v)}
        aria-label={done ? 'Mark incomplete' : 'Mark complete'}
        className="mt-0.5 shrink-0 transition-transform active:scale-90"
        title={done ? 'Mark incomplete' : 'Mark complete'}
      >
        {done
          ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          : <Circle className="h-5 w-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
        }
      </button>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          {/* Category dot */}
          <span className={`h-2 w-2 rounded-full ${CATEGORY_DOT[rec.category] || 'bg-slate-500'}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {rec.id}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${EFFORT_STYLES[rec.effort] || ''}`}>
            {rec.effort}
          </span>
        </div>

        <h3 className={`text-sm font-semibold mb-1 ${done ? 'line-through text-slate-500' : 'text-white'}`}>
          {rec.title}
        </h3>

        {/* Expandable description */}
        {expanded && (
          <p className="text-sm text-slate-400 leading-relaxed mb-3 animate-fade-in">
            {rec.description}
          </p>
        )}

        {/* Footer meta */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className={IMPACT_STYLES[rec.impact] || 'badge-green'}>
            {rec.impact} Impact
          </span>
          <span className="text-xs text-slate-500 font-medium">
            ~{Number(rec.saving).toLocaleString()} kg saved
          </span>
          <span className="text-xs text-slate-600">
            {rec.timeframe}
          </span>
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(v => !v)}
        aria-label={expanded ? 'Collapse description' : 'Expand description'}
        className="shrink-0 p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all"
      >
        {expanded
          ? <ChevronUp className="h-4 w-4" />
          : <ChevronDown className="h-4 w-4" />
        }
      </button>
    </div>
  );
};
