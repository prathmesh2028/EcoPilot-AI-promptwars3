import { describe, it, expect } from 'vitest';
import { calculateFootprint, getComparisonStats, getMeterValue } from './carbonCalculators';

describe('carbonCalculators', () => {
  describe('calculateFootprint', () => {
    it('should return 0s if no answers provided', () => {
      const result = calculateFootprint(null);
      expect(result.total).toBe(0);
      expect(result.breakdown).toHaveLength(0);
    });

    it('should calculate accurate baseline using default fallback values if partial data', () => {
      const result = calculateFootprint({});
      // Gas Car (0.192), 0 miles, 3 days office -> 0 commute CO2
      // Omnivore (2500)
      // 3 office days (12.5), 2 WFH days (6) -> 18.5/day * 50 = 925 energy
      expect(result.total).toBe(5890);
      expect(result.categoryMap['Commute']).toBe(0);
      expect(result.categoryMap['Food']).toBe(2500);
    });

    it('should accurately calculate total based on specific inputs', () => {
      const answers = {
        commuteMode: 'Gas Car',
        commuteDistance: 20, // miles
        officeDays: 5,
        foodLifestyle: 'Meat Lover', // 3300
        lifestylePattern: 'High' // 4500
      };
      
      const result = calculateFootprint(answers);
      expect(result.total).toBe(10095);
      expect(result.categoryMap['Food']).toBe(3300);
    });
  });

  describe('getComparisonStats', () => {
    it('should calculate vs global averages', () => {
      const stats = getComparisonStats(7000);
      expect(stats.vsGlobal).toBe(148.9);
    });
  });

  describe('getMeterValue', () => {
    it('should cap meter at 100%', () => {
      expect(getMeterValue(20000)).toBe(100);
      expect(getMeterValue(9000)).toBe(50);
    });
  });
});
