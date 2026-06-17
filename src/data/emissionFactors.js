/**
 * EMISSION FACTORS — Single source of truth
 * All values in kg CO₂e.
 * AI must NOT modify or use these for calculations — only humans/engine.
 */

// kg CO₂e per km (converted from miles internally)
export const COMMUTE_FACTORS_PER_KM = {
  'Gas Car':         0.192, // IPCC average petrol sedan
  'Electric Vehicle': 0.070, // grid-average EV (US mix)
  'Public Transit':  0.040, // bus + metro blend
  'Bus':             0.089, // urban bus
  'Metro / Rail':    0.041, // metro rail
  'Bike / Walk':     0.000, // zero emission
};

// Annual kg CO₂e from diet
export const FOOD_FACTORS = {
  'Meat Lover':  3300,
  'Omnivore':    2500,
  'Flexitarian': 1900,
  'Vegetarian':  1700,
  'Vegan':       1500,
};

// kg CO₂e per day per mode
export const ENERGY_FACTORS_PER_DAY = {
  Office: 4.2,  // office energy per occupancy day
  WFH:    1.6,  // home energy per WFH day
};

// Annual kg CO₂e for general lifestyle
export const LIFESTYLE_FACTORS = {
  High:   4200, // frequent flier + heavy consumer
  Medium: 2600,
  Low:    1400,
};

// Comparison benchmarks (kg CO₂e per year)
export const BENCHMARKS = {
  globalAverage: 4700,
  usAverage:    14000,
  parisTarget:   2300,
  excellent:     4000,
  good:          8000,
  average:      14000,
};

// Chart & UI color palette per category
export const CATEGORY_COLORS = {
  Commute:           '#059669',
  Food:              '#10b981',
  'Home/Office Energy': '#34d399',
  'General Lifestyle':  '#6ee7b7',
};

// Impact level thresholds
export const getImpactLevel = (totalCo2) => {
  if (totalCo2 < BENCHMARKS.excellent) return { label: 'Excellent', color: 'green' };
  if (totalCo2 < BENCHMARKS.good)      return { label: 'Good',      color: 'teal'  };
  if (totalCo2 < BENCHMARKS.average)   return { label: 'Average',   color: 'amber' };
  return { label: 'High', color: 'red' };
};
