import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

// Mock the AI service to prevent actual API calls during App render
vi.mock('./services/gemini', () => ({
  generateCarbonTwin: vi.fn().mockResolvedValue({}),
  generateSustainabilityReport: vi.fn().mockResolvedValue('MOCK'),
  generateChallenges: vi.fn().mockResolvedValue([]),
  generateRecommendations: vi.fn().mockResolvedValue([]),
  generateSimulationInsight: vi.fn().mockResolvedValue({}),
}));

// Mock the Recharts ResponsiveContainer to prevent ResizeObserver errors in JSDOM
vi.mock('recharts', async () => {
  const OriginalRecharts = await vi.importActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: '100%', height: '300px' }}>{children}</div>
    ),
  };
});

describe('App Smoke Test', () => {
  it('renders the application root without crashing', () => {
    // The App component already includes the BrowserRouter, so we don't wrap it in MemoryRouter.
    // Instead, we just mount the App directly to achieve full tree coverage.
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
