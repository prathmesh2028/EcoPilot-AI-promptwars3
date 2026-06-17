/**
 * Gemini AI Service
 * PURPOSE: Narrative generation ONLY.
 * Carbon calculations are NEVER done here — see utils/carbonCalculators.js.
 *
 * Functions:
 *  1. generateCarbonTwin        — persona name + description
 *  2. generateRecommendations   — 5 tailored recommendations
 *  3. generateChallenges        — 3 weekly eco-challenges
 *  4. generateSimulationInsight — explain what a simulated change means
 *  5. generateSustainabilityReport — full markdown executive report
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL   = 'gemini-1.5-flash';

let genAI = null;
const getModel = () => {
  if (!genAI) genAI = new GoogleGenerativeAI(API_KEY);
  return genAI.getGenerativeModel({ model: MODEL });
};

/** Safe JSON parse with fallback */
const safeJson = (text, fallback) => {
  try {
    return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
  } catch {
    return fallback;
  }
};

/* ─────────────────────────────────────────────
   1. CARBON TWIN
   ───────────────────────────────────────────── */
export const generateCarbonTwin = async (userData, carbonMetrics) => {
  if (!API_KEY) return MOCK_TWIN;
  try {
    const model = getModel();
    const prompt = `You are EcoPilot AI. Based on this professional's carbon profile, generate their "Carbon Twin" persona.

User Profile:
- Commute: ${userData.commuteMode}, ${userData.commuteDistance} miles/day, ${userData.officeDays} days/week
- Diet: ${userData.foodLifestyle}
- Lifestyle intensity: ${userData.lifestylePattern}
- Annual footprint: ${carbonMetrics.total} kg CO₂e

Return ONLY valid JSON with this exact structure:
{
  "name": "A catchy 3-5 word persona title (e.g. 'The Commuting Carnivore')",
  "archetype": "One word archetype (e.g. Explorer, Pioneer, Guardian)",
  "tagline": "One punchy sentence under 12 words describing this persona",
  "topCategory": "The single biggest emission category (Commute | Food | Energy | Lifestyle)",
  "strengths": ["strength 1", "strength 2"],
  "opportunities": ["opportunity 1", "opportunity 2"]
}`;
    const result = await model.generateContent(prompt);
    return safeJson(result.response.text(), MOCK_TWIN);
  } catch (err) {
    console.error('[EcoPilot] Twin generation error:', err);
    return MOCK_TWIN;
  }
};

/* ─────────────────────────────────────────────
   2. RECOMMENDATIONS
   ───────────────────────────────────────────── */
export const generateRecommendations = async (userData, carbonMetrics) => {
  if (!API_KEY) return MOCK_RECOMMENDATIONS;
  try {
    const model = getModel();
    const prompt = `You are EcoPilot AI, a corporate sustainability coach. Provide 5 hyper-specific, actionable recommendations.

Profile:
- Commute: ${userData.commuteMode}, ${userData.commuteDistance} miles, ${userData.officeDays} days/week
- Diet: ${userData.foodLifestyle}
- Lifestyle: ${userData.lifestylePattern}
- Total CO₂e: ${carbonMetrics.total} kg/year
- Breakdown: ${carbonMetrics.breakdown.map(b => `${b.name}: ${b.value}kg`).join(', ')}

Return ONLY valid JSON array of 5 objects:
[
  {
    "id": "REC-001",
    "title": "Short action title (max 6 words)",
    "description": "2-3 sentence actionable recommendation specific to their profile",
    "impact": "High | Medium | Low",
    "category": "Commute | Food | Energy | Lifestyle",
    "saving": "Estimated annual saving in kg CO₂e (number only)",
    "effort": "Easy | Medium | Hard",
    "timeframe": "This week | This month | 3 months"
  }
]`;
    const result = await model.generateContent(prompt);
    return safeJson(result.response.text(), MOCK_RECOMMENDATIONS);
  } catch (err) {
    console.error('[EcoPilot] Recommendations error:', err);
    return MOCK_RECOMMENDATIONS;
  }
};

/* ─────────────────────────────────────────────
   3. CHALLENGES
   ───────────────────────────────────────────── */
export const generateChallenges = async (userData, carbonMetrics) => {
  if (!API_KEY) return MOCK_CHALLENGES;
  try {
    const model = getModel();
    const prompt = `You are EcoPilot AI. Generate 3 weekly eco-challenges personalized to this user.

Profile:
- Commute: ${userData.commuteMode}, Diet: ${userData.foodLifestyle}
- Office days: ${userData.officeDays}/week, Lifestyle: ${userData.lifestylePattern}
- Annual footprint: ${carbonMetrics.total} kg CO₂e

Return ONLY valid JSON array of 3 challenges:
[
  {
    "id": "CHG-001",
    "title": "Challenge name (max 4 words)",
    "description": "What to do this week, specifically",
    "impact": "High | Medium | Low",
    "category": "Commute | Food | Energy | Lifestyle",
    "metric": "Concrete measurable outcome (e.g. Save ~12 kg CO₂)",
    "duration": "7 days",
    "badge": "Emoji badge for completing this challenge"
  }
]`;
    const result = await model.generateContent(prompt);
    return safeJson(result.response.text(), MOCK_CHALLENGES);
  } catch (err) {
    console.error('[EcoPilot] Challenges error:', err);
    return MOCK_CHALLENGES;
  }
};

/* ─────────────────────────────────────────────
   4. SIMULATION INSIGHT
   ───────────────────────────────────────────── */
export const generateSimulationInsight = async (originalData, simulatedData, baselineTotal, simTotal) => {
  if (!API_KEY) return MOCK_SIM_INSIGHT;
  try {
    const model = getModel();
    const savings = baselineTotal - simTotal;
    const prompt = `You are EcoPilot AI. Explain what this carbon footprint change means in real-world terms.

Original: ${baselineTotal} kg CO₂e/year (${originalData.commuteMode}, ${originalData.foodLifestyle}, ${originalData.officeDays} office days)
Simulated: ${simTotal} kg CO₂e/year (${simulatedData.commuteMode}, ${simulatedData.foodLifestyle}, ${simulatedData.officeDays} office days)
Net change: ${savings > 0 ? '-' : '+'}${Math.abs(savings)} kg CO₂e/year

Return ONLY valid JSON:
{
  "headline": "Punchy one-line summary of the impact (max 12 words)",
  "treesEquivalent": number (trees needed to absorb this saving in 1 year),
  "milesEquivalent": number (equivalent miles not driven in a gas car, if savings > 0),
  "flightsEquivalent": "X hours of flying avoided",
  "narrative": "2-3 sentences explaining the real-world significance of this change"
}`;
    const result = await model.generateContent(prompt);
    return safeJson(result.response.text(), MOCK_SIM_INSIGHT);
  } catch (err) {
    console.error('[EcoPilot] Simulation insight error:', err);
    return MOCK_SIM_INSIGHT;
  }
};

/* ─────────────────────────────────────────────
   5. SUSTAINABILITY REPORT
   ───────────────────────────────────────────── */
export const generateSustainabilityReport = async (userData, carbonMetrics) => {
  if (!API_KEY) return MOCK_REPORT;
  try {
    const model = getModel();
    const prompt = `You are EcoPilot AI. Generate a professional sustainability capability report for a working professional.

Profile:
- Commute: ${userData.commuteMode}, ${userData.commuteDistance} miles/day, ${userData.officeDays} days/week in office
- Diet: ${userData.foodLifestyle}
- Lifestyle pattern: ${userData.lifestylePattern}
- Annual footprint: ${carbonMetrics.total} kg CO₂e
- Breakdown: ${carbonMetrics.breakdown.map(b => `${b.name}: ${b.value} kg (${b.pct}%)`).join(', ')}

Write a 500-700 word executive report in markdown. Use these exact sections:

## Executive Overview
## Current Carbon Footprint Analysis
## Key Emission Vectors
## Priority Reduction Opportunities
## 90-Day Action Roadmap
## Long-Term Sustainability Targets

Tone: corporate, confident, action-oriented. Use specific numbers from the profile. Do NOT use generic advice.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('[EcoPilot] Report generation error:', err);
    return MOCK_REPORT;
  }
};

/* ─────────────────────────────────────────────
   MOCK DATA (used when API key is missing)
   ───────────────────────────────────────────── */
const MOCK_TWIN = {
  name: 'The Aware Professional',
  archetype: 'Pioneer',
  tagline: 'Making conscious choices, one commute at a time.',
  topCategory: 'Commute',
  strengths: ['Environmentally conscious mindset', 'Open to behavioral change'],
  opportunities: ['Reduce commute frequency', 'Shift to plant-forward diet'],
};

const MOCK_RECOMMENDATIONS = [
  { id: 'REC-001', title: 'Switch to 2 WFH days', description: 'Reduce office days from your current schedule to 2 days/week. This single change cuts your commute emissions by up to 40%.', impact: 'High', category: 'Commute', saving: 820, effort: 'Easy', timeframe: 'This month' },
  { id: 'REC-002', title: 'Try Flexitarian Mondays', description: 'Replace meat with plant-based protein every Monday. A flexitarian shift can reduce food emissions by ~20% annually.', impact: 'Medium', category: 'Food', saving: 320, effort: 'Easy', timeframe: 'This week' },
  { id: 'REC-003', title: 'Audit phantom power loads', description: 'Unplug workstation peripherals overnight. Phantom loads account for 5-10% of home office energy consumption.', impact: 'Low', category: 'Energy', saving: 90, effort: 'Easy', timeframe: 'This week' },
  { id: 'REC-004', title: 'Batch delivery orders', description: 'Consolidate online orders to 1 per week instead of daily. Last-mile logistics account for 15% of your lifestyle footprint.', impact: 'Medium', category: 'Lifestyle', saving: 210, effort: 'Easy', timeframe: 'This week' },
  { id: 'REC-005', title: 'Carpool on office days', description: 'Find a colleague within 5 miles and share the commute 2 days/week. This alone saves ~600 kg CO₂e annually.', impact: 'High', category: 'Commute', saving: 600, effort: 'Medium', timeframe: 'This month' },
];

const MOCK_CHALLENGES = [
  { id: 'CHG-001', title: 'Meatless Monday', description: 'Go fully plant-based for one day this week — breakfast, lunch, and dinner.', impact: 'Medium', category: 'Food', metric: 'Save ~6 kg CO₂', duration: '7 days', badge: '🥗' },
  { id: 'CHG-002', title: 'WFH Sprint', description: 'Work from home for an extra day this week if possible. No commute = zero transport emissions.', impact: 'High', category: 'Commute', metric: 'Save ~15 kg CO₂', duration: '7 days', badge: '🏠' },
  { id: 'CHG-003', title: 'Zero Waste Week', description: 'Bring a re-usable cup, no single-use plastics, and bike or walk for any errand under 2 miles.', impact: 'Low', category: 'Lifestyle', metric: 'Save ~4 kg CO₂', duration: '7 days', badge: '♻️' },
];

const MOCK_SIM_INSIGHT = {
  headline: 'Significant annual reduction achieved with minor lifestyle shift.',
  treesEquivalent: 18,
  milesEquivalent: 2400,
  flightsEquivalent: '~2 hours of flying',
  narrative: 'These changes compound over time. Sustaining this pattern for a decade saves the equivalent of planting an entire grove of trees. This is exactly the kind of systemic shift the Paris Agreement depends on at scale.',
};

const MOCK_REPORT = `## Executive Overview\nThis sustainability report has been generated based on your profile. Add your Gemini API key to generate a real AI report.\n\n## Current Carbon Footprint Analysis\nYour estimated annual footprint is calculated from commute, food, energy, and lifestyle vectors using IPCC-aligned emission factors.\n\n## Key Emission Vectors\nReview your dashboard breakdown to identify the highest-impact categories.\n\n## Priority Reduction Opportunities\n1. Reduce commute frequency\n2. Shift to a plant-forward diet\n3. Minimize phantom energy loads\n\n## 90-Day Action Roadmap\n- Week 1-2: WFH days audit\n- Week 3-6: Dietary adjustments\n- Week 7-12: Energy and lifestyle optimization\n\n## Long-Term Sustainability Targets\nTarget 50% reduction in 3 years, aligned with science-based targets.`;
