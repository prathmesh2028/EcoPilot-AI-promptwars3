import { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useEco } from '../context/EcoContext';
import { generateRecommendations, generateChallenges } from '../services/gemini';
import { RecommendationCard } from '../components/RecommendationCard';
import { ChallengeCard } from '../components/ChallengeCard';
import { Sparkles, Loader2, RefreshCw, Flame } from 'lucide-react';

const SkeletonCard = () => (
  <div className="flex gap-4 items-start p-5 border-b border-white/5">
    <div className="skeleton h-5 w-5 rounded-full shrink-0" />
    <div className="flex-grow space-y-2">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-1/2" />
    </div>
  </div>
);

export const ActionPlan = () => {
  const {
    userData, carbonMetrics, hasCompletedAssessment,
    aiCache, updateAiCache, acceptedChallenges, acceptChallenge,
  } = useEco();

  const [recs,      setRecs]      = useState(aiCache.recs      || null);
  const [challenges,setChallenges] = useState(aiCache.challenges || null);
  const [loadingRecs,  setLoadingRecs]   = useState(false);
  const [loadingChall, setLoadingChall]  = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');

  const fetchAll = useCallback(async (force = false) => {
    if (!userData) return;
    if (!aiCache.recs || force) {
      setLoadingRecs(true);
      generateRecommendations(userData, carbonMetrics)
        .then(r => { setRecs(r); updateAiCache('recs', r); })
        .finally(() => setLoadingRecs(false));
    }
    if (!aiCache.challenges || force) {
      setLoadingChall(true);
      generateChallenges(userData, carbonMetrics)
        .then(c => { setChallenges(c); updateAiCache('challenges', c); })
        .finally(() => setLoadingChall(false));
    }
  }, [userData, aiCache.recs, aiCache.challenges, carbonMetrics, updateAiCache]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (!hasCompletedAssessment) return <Navigate to="/assessment" replace />;

  const totalSaving = recs
    ? recs.reduce((sum, r) => sum + (Number(r.saving) || 0), 0)
    : 0;

  return (
    <div className="bg-slate-950 min-h-[calc(100vh-68px)] px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/5 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Reduce Your Impact</h1>
            </div>
            <p className="text-slate-500 text-sm">Gemini-generated AI recommendations tailored to help you understand and reduce your carbon footprint.</p>
          </div>
          <div className="flex items-center gap-3">
            {recs && (
              <div className="badge-green">
                Save up to ~{totalSaving.toLocaleString()} kg/yr
              </div>
            )}
            <button
              onClick={() => fetchAll(true)}
              aria-label="Refresh AI Recommendations"
              className="btn-ghost text-sm gap-2"
              title="Regenerate with AI"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────────── */}
        <div className="flex border-b border-white/5 animate-fade-in-up delay-100">
          {[
            { id: 'recommendations', label: `Recommendations ${recs ? `(${recs.length})` : ''}` },
            { id: 'challenges',      label: `Weekly Challenges ${challenges ? `(${challenges.length})` : ''}` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-label={`Switch to ${tab.label}`}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Recommendations Tab ─────────────────────────── */}
        {activeTab === 'recommendations' && (
          <div className="animate-fade-in">
            <div className="card-dark rounded-2xl overflow-hidden">
              {loadingRecs
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
                : recs
                  ? recs.map((rec, idx) => (
                      <RecommendationCard key={rec.id || idx} rec={rec} index={idx} />
                    ))
                  : (
                    <div className="p-16 text-center text-slate-500">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-600" />
                      Loading AI recommendations…
                    </div>
                  )
              }
            </div>

            {/* High-impact summary */}
            {recs && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {['High', 'Medium', 'Low'].map(level => {
                  const count = recs.filter(r => r.impact === level).length;
                  const cls = level === 'High' ? 'text-red-400 border-red-500/20 bg-red-500/5'
                            : level === 'Medium' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                            : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
                  return (
                    <div key={level} className={`card-dark p-4 text-center border ${cls}`}>
                      <div className="text-2xl font-extrabold text-white">{count}</div>
                      <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${cls.split(' ')[0]}`}>{level} Impact</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Challenges Tab ──────────────────────────────── */}
        {activeTab === 'challenges' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  {acceptedChallenges.length} / {challenges?.length || 0} Accepted
                </span>
              </div>
            </div>

            {loadingChall
              ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="card-dark p-6 space-y-4 h-48">
                      <div className="skeleton h-10 w-10 rounded-xl" />
                      <div className="skeleton h-5 w-3/4" />
                      <div className="skeleton h-4 w-full" />
                      <div className="skeleton h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              )
              : challenges
                ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {challenges.map((ch, i) => (
                      <ChallengeCard
                        key={ch.id || i}
                        challenge={ch}
                        accepted={acceptedChallenges.includes(ch.id)}
                        onAccept={() => acceptChallenge(ch.id)}
                      />
                    ))}
                  </div>
                )
                : (
                  <div className="p-16 text-center text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-600" />
                    Generating weekly challenges…
                  </div>
                )
            }

            {/* Pro tip */}
            {challenges && (
              <div className="mt-6 card-glow p-5 flex gap-4 items-start">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 mb-1">Pro Tip</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Accepting challenges adjusts your simulation baseline. Head to the{' '}
                    <a href="/simulator" className="text-emerald-400 underline hover:text-emerald-300">Future Simulator</a>{' '}
                    to project the compounded impact over 1 year.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
