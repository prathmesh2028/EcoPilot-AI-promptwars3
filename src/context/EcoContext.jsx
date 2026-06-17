import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { calculateFootprint, getImpactLevel, getMeterValue, getComparisonStats } from '../utils/carbonCalculators';

const EcoContext = createContext(null);

export const useEco = () => {
  const ctx = useContext(EcoContext);
  if (!ctx) throw new Error('useEco must be used inside <EcoProvider>');
  return ctx;
};

export const EcoProvider = ({ children }) => {
  // ── Persisted user answers ──────────────────────────────
  const [userData, setUserData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ecopilot_user')) || null; }
    catch { return null; }
  });

  // ── AI response cache (avoid re-calling Gemini on page changes) ──
  const [aiCache, setAiCache] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ecopilot_ai_cache')) || {}; }
    catch { return {}; }
  });

  // ── Accepted challenges (badge state) ──────────────────
  const [acceptedChallenges, setAcceptedChallenges] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ecopilot_challenges')) || []; }
    catch { return []; }
  });

  // ── Sync to localStorage ────────────────────────────────
  useEffect(() => {
    if (userData) localStorage.setItem('ecopilot_user', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    if (Object.keys(aiCache).length > 0)
      localStorage.setItem('ecopilot_ai_cache', JSON.stringify(aiCache));
  }, [aiCache]);

  useEffect(() => {
    localStorage.setItem('ecopilot_challenges', JSON.stringify(acceptedChallenges));
  }, [acceptedChallenges]);

  // ── Derived metrics (always in sync with userData) ──────
  const carbonMetrics = userData
    ? calculateFootprint(userData)
    : { total: 0, breakdown: [], categoryMap: {} };

  const impactLevel      = getImpactLevel(carbonMetrics.total);
  const meterValue       = getMeterValue(carbonMetrics.total);
  const comparisonStats  = getComparisonStats(carbonMetrics.total);

  const hasCompletedAssessment = !!(
    userData?.commuteMode && userData?.foodLifestyle
  );

  // ── Actions ─────────────────────────────────────────────
  const updateUserData = useCallback((data) => {
    setUserData(prev => ({ ...prev, ...data }));
    // Clear AI cache on profile change so stale content isn't shown
    setAiCache({});
    localStorage.removeItem('ecopilot_ai_cache');
  }, []);

  const saveAssessment = useCallback((data) => {
    setUserData(data);
    setAiCache({});
    localStorage.removeItem('ecopilot_ai_cache');
  }, []);

  const updateAiCache = useCallback((key, data) => {
    setAiCache(prev => ({ ...prev, [key]: data }));
  }, []);

  const acceptChallenge = useCallback((challengeId) => {
    setAcceptedChallenges(prev =>
      prev.includes(challengeId) ? prev : [...prev, challengeId]
    );
  }, []);

  const resetAll = useCallback(() => {
    setUserData(null);
    setAiCache({});
    setAcceptedChallenges([]);
    ['ecopilot_user', 'ecopilot_ai_cache', 'ecopilot_challenges'].forEach(k =>
      localStorage.removeItem(k)
    );
  }, []);

  const value = {
    // State
    userData,
    aiCache,
    acceptedChallenges,
    // Derived
    carbonMetrics,
    impactLevel,
    meterValue,
    comparisonStats,
    hasCompletedAssessment,
    // Actions
    updateUserData,
    saveAssessment,
    updateAiCache,
    acceptChallenge,
    resetAll,
  };

  return <EcoContext.Provider value={value}>{children}</EcoContext.Provider>;
};
