import React, { useEffect } from 'react';
import { Award, X, Trash2 } from 'lucide-react';
import { LoyaltyState } from '../types/bakery';
import {
  getLoyaltyTier,
  PKR_PER_POINT,
  REWARD_MILESTONE_POINTS,
} from '../utils/loyaltyRewards';

interface LoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  loyalty: LoyaltyState;
  onResetLoyalty: () => void;
}

export const LoyaltyModal: React.FC<LoyaltyModalProps> = ({
  isOpen,
  onClose,
  loyalty,
  onResetLoyalty,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tier = getLoyaltyTier(loyalty.points);
  const pointsRemaining = Math.max(0, tier.nextGoal - loyalty.points);
  const rewardVouchersUnlocked = Math.floor(loyalty.points / REWARD_MILESTONE_POINTS);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1815]/55 dark:bg-black/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loyalty-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#E5E1DA] dark:border-[#342D28] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#1B4332] dark:text-[#74C69D] shrink-0" aria-hidden="true" />
            <div>
              <h2
                id="loyalty-modal-title"
                className="font-display text-lg font-semibold text-[#1C1815] dark:text-[#F5F2EC]"
              >
                Loyalty Rewards
              </h2>
              <p className="text-xs text-[#5C554E] dark:text-[#B5ACA3]">
                Saved in this browser · 1 pt per Rs. {PKR_PER_POINT} ordered
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#5C554E] dark:text-[#B5ACA3] hover:text-[#1C1815] dark:hover:text-[#F5F2EC] hover:bg-[#F3F1ED] dark:hover:bg-[#26211D] rounded-lg transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Close loyalty rewards"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="bg-[#FAF9F7] dark:bg-[#26211D] border border-[#E5E1DA] dark:border-[#342D28] rounded-xl p-5 space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#5C554E] dark:text-[#B5ACA3]">{tier.name}</p>
                <p className="font-display text-3xl font-semibold text-[#1C1815] dark:text-[#F5F2EC] tabular-nums mt-0.5">
                  {loyalty.points}{' '}
                  <span className="text-base font-sans font-medium text-[#5C554E] dark:text-[#B5ACA3]">
                    pts
                  </span>
                </p>
              </div>
              <div className="text-right text-xs text-[#5C554E] dark:text-[#B5ACA3] tabular-nums">
                <p>{loyalty.ordersCount} {loyalty.ordersCount === 1 ? 'order' : 'orders'}</p>
                <p className="font-medium text-[#1C1815] dark:text-[#F5F2EC] mt-0.5">
                  Rs. {loyalty.lifetimeSpentPkr.toLocaleString()} spent
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="h-2 w-full bg-[#EAE6DE] dark:bg-[#342D28] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1B4332] dark:bg-[#52B788] transition-all duration-300"
                  style={{ width: `${tier.progressPct}%` }}
                />
              </div>
              <p className="text-xs text-[#5C554E] dark:text-[#B5ACA3] tabular-nums">
                {loyalty.points >= 150
                  ? `Top tier reached · ${rewardVouchersUnlocked} Rs. 250 bakery treats unlocked`
                  : `${pointsRemaining} pts away from ${tier.nextGoal} pts milestone (50 pts = Rs. 250 treat credit)`}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC]">Points Activity</h3>
              {loyalty.history.length > 0 && (
                <button
                  type="button"
                  onClick={onResetLoyalty}
                  className="inline-flex items-center gap-1 text-xs text-[#5C554E] dark:text-[#B5ACA3] hover:text-red-700 dark:hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reset Points</span>
                </button>
              )}
            </div>

            {loyalty.history.length === 0 ? (
              <p className="text-xs text-[#5C554E] dark:text-[#B5ACA3] bg-[#FAF9F7] dark:bg-[#26211D] border border-[#E5E1DA] dark:border-[#342D28] rounded-lg p-4">
                No points recorded yet. Complete a WhatsApp order or copy an order summary from your Bakery Bag to earn 1 point per Rs. {PKR_PER_POINT} spent.
              </p>
            ) : (
              <ul className="divide-y divide-[#E5E1DA] dark:divide-[#342D28] border border-[#E5E1DA] dark:border-[#342D28] rounded-xl bg-white dark:bg-[#26211D] px-4">
                {loyalty.history.slice(0, 8).map((tx) => {
                  const dateLabel = new Date(tx.dateIso).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  });
                  return (
                    <li
                      key={tx.id}
                      className="py-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-[#1C1815] dark:text-[#F5F2EC] truncate">
                          {tx.summary}
                        </p>
                        <p className="text-[#5C554E] dark:text-[#B5ACA3] tabular-nums mt-0.5">
                          {dateLabel} · Rs. {tx.orderTotalPkr.toLocaleString()}
                        </p>
                      </div>
                      <span className="font-semibold text-[#1B4332] dark:text-[#74C69D] tabular-nums whitespace-nowrap shrink-0">
                        +{tx.pointsEarned} pts
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
