import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronRight, ClipboardCheck, Clock, PackageCheck, RotateCcw, X } from 'lucide-react';
import { OrderStatusStage, TrackedOrder } from '../types/bakery';

interface OrderStatusMenuProps {
  trackedOrder: TrackedOrder | null;
  onAdvanceStage: () => void;
  onDismissOrder: () => void;
  onQuickReorder?: () => void;
}

const STAGE_ORDER: OrderStatusStage[] = ['received', 'preparing', 'ready'];

export const OrderStatusMenu: React.FC<OrderStatusMenuProps> = ({
  trackedOrder,
  onAdvanceStage,
  onDismissOrder,
  onQuickReorder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!trackedOrder) return null;

  const currentStageIndex = STAGE_ORDER.indexOf(trackedOrder.stage);
  const finalStepTitle =
    trackedOrder.orderType === 'delivery' ? 'Ready for Delivery' : 'Ready for Pickup';

  const shortStageLabel =
    trackedOrder.stage === 'received'
      ? 'Received'
      : trackedOrder.stage === 'preparing'
      ? 'Preparing'
      : 'Ready';

  const steps: {
    key: OrderStatusStage;
    title: string;
    detail: string;
  }[] = [
    {
      key: 'received',
      title: 'Received',
      detail: `Order ${trackedOrder.orderNumber} logged via WhatsApp flow.`,
    },
    {
      key: 'preparing',
      title: 'Preparing',
      detail: `Baking and packing your ${trackedOrder.itemCount} ${
        trackedOrder.itemCount === 1 ? 'item' : 'items'
      } fresh at Kashmir Road.`,
    },
    {
      key: 'ready',
      title: finalStepTitle,
      detail:
        trackedOrder.orderType === 'delivery'
          ? 'Packed and ready for Sialkot Cash on Delivery dispatch.'
          : 'Packed and ready at our Lari Ada counter for pickup.',
    },
  ];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="order-status-popover"
        aria-label={`Order Status: ${shortStageLabel}`}
        className={`inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 w-9 sm:w-auto sm:px-3 rounded-lg border text-xs sm:text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] ${
          isOpen || trackedOrder.stage === 'ready'
            ? 'bg-[#1B4332]/10 dark:bg-[#2D6A4F]/30 text-[#1B4332] dark:text-[#74C69D] border-[#1B4332]/30 dark:border-[#52B788]/50'
            : 'bg-white dark:bg-[#1D1916] hover:bg-[#F3F1ED] dark:hover:bg-[#26211D] text-[#1C1815] dark:text-[#F5F2EC] border-[#E5E1DA] dark:border-[#342D28]'
        }`}
      >
        {trackedOrder.stage === 'ready' ? (
          <PackageCheck className="w-4 h-4 text-[#1B4332] dark:text-[#74C69D] shrink-0" aria-hidden="true" />
        ) : (
          <Clock className="w-4 h-4 text-[#1B4332] dark:text-[#74C69D] shrink-0" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">
          <span className="hidden lg:inline">Order </span>Status
        </span>
      </button>

      {isOpen && (
        <div
          id="order-status-popover"
          role="region"
          aria-label="Current order status timeline"
          className="fixed left-3 right-3 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 z-40 bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-xl shadow-xl overflow-hidden"
        >
          <div className="px-4 py-3.5 bg-[#FAF9F7] dark:bg-[#26211D] border-b border-[#E5E1DA] dark:border-[#342D28] flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1B4332] dark:text-[#74C69D]">
                <ClipboardCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Order Status</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{trackedOrder.orderNumber}</span>
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#D6D3D1] mt-1 tabular-nums truncate">
                {trackedOrder.customerName || 'Guest'} ·{' '}
                {trackedOrder.orderType === 'delivery' ? 'Delivery' : 'Pickup'} · Rs.{' '}
                {trackedOrder.totalPkr.toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1815] dark:hover:text-[#F5F2EC] hover:bg-[#EFECE6] dark:hover:bg-[#342D28] rounded-md transition-colors cursor-pointer shrink-0"
              aria-label="Close order status panel"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <ol className="p-4 space-y-0">
            {steps.map((step, index) => {
              const isCompleted = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const isReached = index <= currentStageIndex;
              const isLast = index === steps.length - 1;

              return (
                <li key={step.key} className="relative flex gap-3 pb-4 last:pb-0">
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className={`absolute left-[11px] top-6 bottom-0 w-px ${
                        index < currentStageIndex
                          ? 'bg-[#1B4332] dark:bg-[#52B788]'
                          : 'bg-[#E5E1DA] dark:bg-[#342D28]'
                      }`}
                    />
                  )}

                  <span
                    aria-hidden="true"
                    className={`relative z-10 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                      isReached
                        ? 'bg-[#1B4332] dark:bg-[#2D6A4F] border-[#1B4332] dark:border-[#52B788] text-white'
                        : 'bg-[#FAF9F7] dark:bg-[#26211D] border-[#D6D0C6] dark:border-[#443C35] text-[#57534E] dark:text-[#A8A29E]'
                    }`}
                  >
                    {isCompleted || (isCurrent && trackedOrder.stage === 'ready') ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-[11px] font-semibold tabular-nums">{index + 1}</span>
                    )}
                  </span>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-sm font-semibold leading-snug ${
                          isReached
                            ? 'text-[#1C1815] dark:text-[#F5F2EC]'
                            : 'text-[#57534E] dark:text-[#A8A29E]'
                        }`}
                      >
                        {step.title}
                      </p>
                      <span
                        className={`text-[11px] font-medium whitespace-nowrap ${
                          isCurrent
                            ? 'text-[#1B4332] dark:text-[#74C69D]'
                            : isCompleted
                            ? 'text-[#57534E] dark:text-[#D6D3D1]'
                            : 'text-[#57534E]/75 dark:text-[#A8A29E]/75'
                        }`}
                      >
                        {isCurrent ? 'Current' : isCompleted ? 'Done' : 'Upcoming'}
                      </span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed mt-0.5 ${
                        isReached
                          ? 'text-[#44403C] dark:text-[#D6D3D1]'
                          : 'text-[#57534E]/80 dark:text-[#A8A29E]/80'
                      }`}
                    >
                      {step.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="px-4 py-3 bg-[#FAF9F7] dark:bg-[#26211D] border-t border-[#E5E1DA] dark:border-[#342D28] space-y-2.5">
            {onQuickReorder && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onQuickReorder();
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-[#1B4332] hover:bg-[#143325] text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Quick Reorder</span>
              </button>
            )}

            <div className="flex items-center justify-between gap-3">
              {trackedOrder.stage !== 'ready' ? (
                <button
                  type="button"
                  onClick={onAdvanceStage}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B4332] dark:text-[#74C69D] hover:underline underline-offset-2 cursor-pointer"
                >
                  <span>Update to next step</span>
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              ) : (
                <span className="text-xs font-medium text-[#1B4332] dark:text-[#74C69D]">
                  {trackedOrder.orderType === 'delivery'
                    ? 'Out for Sialkot delivery'
                    : 'Ready at Kashmir Road counter'}
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onDismissOrder();
                }}
                className="text-xs font-medium text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1815] dark:hover:text-[#F5F2EC] underline underline-offset-2 cursor-pointer whitespace-nowrap"
              >
                Clear Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
