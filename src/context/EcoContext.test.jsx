import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { EcoProvider, useEco } from './EcoContext';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: vi.fn(key => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('EcoContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with null userData', () => {
    const { result } = renderHook(() => useEco(), { wrapper: EcoProvider });
    expect(result.current.userData).toBeNull();
    expect(result.current.hasCompletedAssessment).toBe(false);
  });

  it('should save assessment to state and localStorage', () => {
    const { result } = renderHook(() => useEco(), { wrapper: EcoProvider });
    const mockData = { commuteMode: 'Gas Car', foodLifestyle: 'Omnivore' };
    
    act(() => {
      result.current.saveAssessment(mockData);
    });

    expect(result.current.userData).toEqual(mockData);
    expect(result.current.hasCompletedAssessment).toBe(true);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('ecopilot_user', JSON.stringify(mockData));
  });

  it('should clear data', () => {
    const { result } = renderHook(() => useEco(), { wrapper: EcoProvider });
    act(() => {
      result.current.saveAssessment({ test: true });
    });
    
    act(() => {
      result.current.resetAll();
    });

    expect(result.current.userData).toBeNull();
    expect(result.current.hasCompletedAssessment).toBe(false);
  });
});
