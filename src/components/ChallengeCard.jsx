/**
 * ChallengeCard — one weekly eco-challenge with accept mechanic.
 * Props:
 *   challenge { id, title, description, impact, category, metric, duration, badge }
 *   accepted  : boolean
 *   onAccept  : () => void
 */
import { CheckCircle2, Flame } from 'lucide-react';

const IMPACT_COLORS = {
  High:   { ring: 'ring-red-500/30',    bg: 'bg-red-500/10',    text: 'text-red-400'    },
  Medium: { ring: 'ring-amber-500/30',  bg: 'bg-amber-500/10',  text: 'text-amber-400'  },
  Low:    { ring: 'ring-emerald-500/30',bg: 'bg-emerald-500/10',text: 'text-emerald-400' },
};

const CATEGORY_GRADIENTS = {
  Commute:   'from-emerald-500/10 to-emerald-600/5',
  Food:      'from-amber-500/10   to-amber-600/5',
  Energy:    'from-blue-500/10    to-blue-600/5',
  Lifestyle: 'from-purple-500/10  to-purple-600/5',
};

export const ChallengeCard = ({ challenge, accepted, onAccept }) => {
  const impact  = IMPACT_COLORS[challenge.impact] || IMPACT_COLORS.Low;
  const gradient = CATEGORY_GRADIENTS[challenge.category] || CATEGORY_GRADIENTS.Lifestyle;

  return (
    <div
      className={`relative card-dark overflow-hidden flex flex-col transition-all duration-300 cursor-default
        ${accepted ? 'ring-2 ring-emerald-500/30' : 'hover:ring-1 hover:ring-white/10'}
      `}
    >
      {/* Top gradient band */}
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${gradient} pointer-events-none`} />

      <div className="relative p-5 flex flex-col h-full gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <span className="text-3xl">{challenge.badge}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${impact.bg} ${impact.text} ring-1 ${impact.ring}`}>
            {challenge.impact} Impact
          </span>
        </div>

        {/* Title & description */}
        <div className="flex-grow">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {challenge.duration} · {challenge.category}
            </span>
          </div>
          <h3 className="text-base font-bold text-white mb-2">{challenge.title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{challenge.description}</p>
        </div>

        {/* Metric & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-sm font-semibold text-emerald-400">{challenge.metric}</span>
          <button
            onClick={onAccept}
            disabled={accepted}
            aria-label={`Accept ${challenge.title} challenge`}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              accepted
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                : 'bg-white/10 text-white hover:bg-emerald-600 hover:text-white border border-white/10 hover:border-emerald-600 active:scale-95'
            }`}
          >
            {accepted
              ? <><CheckCircle2 className="h-3.5 w-3.5" /> Accepted</>
              : 'Accept Challenge'
            }
          </button>
        </div>
      </div>
    </div>
  );
};
