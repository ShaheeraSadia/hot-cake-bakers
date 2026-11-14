import React, { useState, useEffect, useMemo } from 'react';
import { MessageCircle, Star, X } from 'lucide-react';
import { BAKERY_INFO } from '../data/menuData';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Needs improvement',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent',
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeStars = hoveredRating ?? rating;

  const whatsappUrl = useMemo(() => {
    const starsVisual = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const lines = [
      `Assalam o Alaikum ${BAKERY_INFO.name},`,
      'Here is my feedback on my order experience:',
      `Rating: ${starsVisual} (${rating}/5 — ${RATING_LABELS[rating]})`,
      `Name: ${customerName.trim() || 'Valued Customer'}`,
    ];
    if (comment.trim()) {
      lines.push(`Feedback: ${comment.trim()}`);
    }
    return `https://wa.me/${BAKERY_INFO.whatsappDigits}?text=${encodeURIComponent(
      lines.join('\n')
    )}`;
  }, [rating, customerName, comment]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C1815]/60 dark:bg-black/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[90dvh] overflow-y-auto bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 sm:px-6 py-4 border-b border-[#E5E1DA] dark:border-[#342D28] flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              id="feedback-modal-title"
              className="font-display text-xl font-semibold text-[#1C1815] dark:text-[#F5F2EC]"
            >
              Share Feedback
            </h2>
            <p className="text-xs text-[#57534E] dark:text-[#D6D3D1] mt-0.5">
              Rate your experience with {BAKERY_INFO.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1815] dark:hover:text-[#F5F2EC] hover:bg-[#F3F1ED] dark:hover:bg-[#26211D] rounded-lg transition-colors cursor-pointer min-w-[40px] min-h-[40px] shrink-0 flex items-center justify-center"
            aria-label="Close feedback modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#1C1815] dark:text-[#F5F2EC]">
                Your Rating
              </span>
              <span className="text-xs font-medium text-[#1B4332] dark:text-[#74C69D] tabular-nums">
                {rating}/5 · {RATING_LABELS[rating]}
              </span>
            </div>

            <div
              className="flex items-center gap-1.5"
              role="radiogroup"
              aria-label="Rate your order from 1 to 5 stars"
              onMouseLeave={() => setHoveredRating(null)}
            >
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isFilled = starValue <= activeStars;
                return (
                  <button
                    key={starValue}
                    type="button"
                    role="radio"
                    aria-checked={rating === starValue}
                    aria-label={`${starValue} ${starValue === 1 ? 'star' : 'stars'} — ${RATING_LABELS[starValue]}`}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onClick={() => {
                      setRating(starValue);
                      setSubmitted(false);
                    }}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center ${
                      isFilled
                        ? 'bg-[#1B4332]/8 dark:bg-[#2D6A4F]/25 border-[#1B4332]/35 dark:border-[#52B788]/50 text-[#D97706] dark:text-[#F3C669]'
                        : 'bg-[#FAF9F7] dark:bg-[#26211D] border-[#E5E1DA] dark:border-[#342D28] text-[#A8A29E] dark:text-[#57534E]'
                    }`}
                  >
                    <Star
                      className={`w-5 h-5 ${isFilled ? 'fill-current' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="feedback-name"
                className="block text-xs font-medium text-[#57534E] dark:text-[#D6D3D1] mb-1"
              >
                Your Name (Optional)
              </label>
              <input
                id="feedback-name"
                type="text"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  setSubmitted(false);
                }}
                placeholder="e.g. Ayesha Tariq"
                className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[#FAF9F7] dark:bg-[#141210] border border-[#E5E1DA] dark:border-[#342D28] rounded-lg text-[#1C1815] dark:text-[#F5F2EC] placeholder:text-[#57534E] dark:placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1B4332] dark:focus:border-[#52B788]"
              />
            </div>

            <div>
              <label
                htmlFor="feedback-comment"
                className="block text-xs font-medium text-[#57534E] dark:text-[#D6D3D1] mb-1"
              >
                Comments or Suggestions (Optional)
              </label>
              <textarea
                id="feedback-comment"
                rows={3}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setSubmitted(false);
                }}
                placeholder="Tell us about cake freshness, delivery speed, or your favorite item..."
                className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[#FAF9F7] dark:bg-[#141210] border border-[#E5E1DA] dark:border-[#342D28] rounded-lg text-[#1C1815] dark:text-[#F5F2EC] placeholder:text-[#57534E] dark:placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1B4332] dark:focus:border-[#52B788] resize-none"
              />
            </div>
          </div>

          {submitted && (
            <p className="text-xs font-medium text-[#1B4332] dark:text-[#74C69D] bg-[#1B4332]/8 dark:bg-[#1B4332]/25 border border-[#1B4332]/25 dark:border-[#52B788]/40 rounded-lg px-3.5 py-2.5">
              Thank you! Your feedback opened in WhatsApp for our Kashmir Road team.
            </p>
          )}

          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-[#F0EDE7] dark:border-[#2E2823]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1815] dark:hover:text-[#F5F2EC] bg-[#FAF9F7] dark:bg-[#26211D] border border-[#E5E1DA] dark:border-[#342D28] rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setSubmitted(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#143325] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Send Feedback on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
