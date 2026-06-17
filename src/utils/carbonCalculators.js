/**
 * Carbon Calculation Engine
 * PURPOSE: Deterministic, rule-based calculation of carbon footprint.
 * The AI (Gemini) must NEVER be used for calculations — only for narrative.
 */

import {
  COMMUTE_FACTORS_PER_KM,
  FOOD_FACTORS,
  ENERGY_FACTORS_PER_DAY,
  LIFESTYLE_FACTORS,
  BENCHMARKS,
  getImpactLevel,
} from '../data/emissionFactors';

const MILES_TO_KM = 1.60934;
const WEEKS_PER_YEAR = 50;

/**
 * Main footprint calculator.
 * @param {object} answers — user form answers from Assessment
 * @returns {{ total: number, breakdown: Array, categoryMap: object }}
 */
export const calculateFootprint = (answers) => {
  if (!answers) return { total: 0, breakdown: [], categoryMap: {} };

  // 1. COMMUTE
  const commuteMode     = answers.commuteMode || 'Gas Car';
  const distanceMiles   = Number(answers.commuteDistance) || 0;
  const distanceKm      = distanceMiles * MILES_TO_KM;
  const officeDays      = answers.officeDays !== undefined ? Number(answers.officeDays) : 3;
  const commuteDaysPerYear = officeDays * WEEKS_PER_YEAR;
  const factorPerKm     = COMMUTE_FACTORS_PER_KM[commuteMode] ?? 0.192;
  // Round trip is already baked into commuteDistance (user enters round-trip)
  const commuteCO2      = distanceKm * factorPerKm * commuteDaysPerYear;

  // 2. FOOD
  const foodMode  = answers.foodLifestyle || 'Omnivore';
  const foodCO2   = FOOD_FACTORS[foodMode] ?? 2500;

  // 3. HOME / OFFICE ENERGY
  const wfhDays         = Math.max(0, 5 - officeDays);
  const energyCO2       = (
    officeDays * ENERGY_FACTORS_PER_DAY.Office +
    wfhDays   * ENERGY_FACTORS_PER_DAY.WFH
  ) * WEEKS_PER_YEAR;

  // 4. GENERAL LIFESTYLE  (flights, deliveries, purchases)
  const lifestyleMode   = answers.lifestylePattern || 'Medium';
  const lifestyleCO2    = LIFESTYLE_FACTORS[lifestyleMode] ?? 2600;

  const total = commuteCO2 + foodCO2 + energyCO2 + lifestyleCO2;

  const breakdown = [
    { name: 'Commute',           value: Math.round(commuteCO2),   pct: 0 },
    { name: 'Food',              value: Math.round(foodCO2),       pct: 0 },
    { name: 'Home/Office Energy', value: Math.round(energyCO2),   pct: 0 },
    { name: 'General Lifestyle', value: Math.round(lifestyleCO2), pct: 0 },
  ].map(item => ({
    ...item,
    pct: total > 0 ? Math.round((item.value / total) * 100) : 0,
  }));

  const categoryMap = Object.fromEntries(breakdown.map(b => [b.name, b.value]));

  return {
    total: Math.round(total),
    breakdown,
    categoryMap,
  };
};

/**
 * Returns comparison stats vs global benchmarks.
 */
export const getComparisonStats = (total) => ({
  vsGlobal:  Number(((total / BENCHMARKS.globalAverage) * 100).toFixed(1)),
  vsUS:      Number(((total / BENCHMARKS.usAverage)     * 100).toFixed(1)),
  vsParis:   Number(((total / BENCHMARKS.parisTarget)   * 100).toFixed(1)),
  savings:   Math.max(0, Math.round(total - BENCHMARKS.parisTarget)),
});

/**
 * Meter position 0-100 scale.
 */
export const getMeterValue = (total) => {
  const MAX = 18000;
  return Math.round(Math.min((total / MAX) * 100, 100));
};

export { getImpactLevel };
