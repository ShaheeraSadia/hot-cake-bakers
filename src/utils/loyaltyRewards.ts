import { LoyaltyState } from '../types/bakery';

export const LOYALTY_STORAGE_KEY = 'hot_cake_bakers_sialkot_loyalty_v1';
export const PKR_PER_POINT = 100;
export const REWARD_MILESTONE_POINTS = 50;

export const DEFAULT_LOYALTY_STATE: LoyaltyState = {
  points: 0,
  lifetimeSpentPkr: 0,
  ordersCount: 0,
  history: [],
};

export function calculateOrderPoints(totalPkr: number): number {
  if (!Number.isFinite(totalPkr) || totalPkr <= 0) return 0;
  return Math.floor(totalPkr / PKR_PER_POINT);
}

export function loadLoyaltyState(): LoyaltyState {
  try {
    const raw = localStorage.getItem(LOYALTY_STORAGE_KEY);
    if (!raw) return DEFAULT_LOYALTY_STATE;
    const parsed = JSON.parse(raw) as Partial<LoyaltyState>;
    return {
      points: typeof parsed.points === 'number' ? parsed.points : 0,
      lifetimeSpentPkr:
        typeof parsed.lifetimeSpentPkr === 'number' ? parsed.lifetimeSpentPkr : 0,
      ordersCount: typeof parsed.ordersCount === 'number' ? parsed.ordersCount : 0,
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return DEFAULT_LOYALTY_STATE;
  }
}

export function saveLoyaltyState(state: LoyaltyState): void {
  try {
    localStorage.setItem(LOYALTY_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function getLoyaltyTier(points: number): {
  name: string;
  nextGoal: number;
  progressPct: number;
} {
  if (points >= 150) {
    return {
      name: 'Gold Family Member',
      nextGoal: 150,
      progressPct: 100,
    };
  }
  if (points >= 50) {
    return {
      name: 'Silver Baker Member',
      nextGoal: 150,
      progressPct: Math.min(100, Math.round((points / 150) * 100)),
    };
  }
  return {
    name: 'Neighborhood Regular',
    nextGoal: REWARD_MILESTONE_POINTS,
    progressPct: Math.min(100, Math.round((points / REWARD_MILESTONE_POINTS) * 100)),
  };
}
