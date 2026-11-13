import React, { useState, useEffect } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { MenuItem, MenuVariant } from '../types/bakery';
import { ResilientImage } from './ResilientImage';

interface ItemDetailModalProps {
  item: MenuItem | null;
  initialVariant: MenuVariant | null;
  onClose: () => void;
  onAddCustomized: (
    item: MenuItem,
    variant: MenuVariant,
    quantity: number,
    note: string
  ) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  initialVariant,
  onClose,
  onAddCustomized,
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (item) {
      setSelectedVariantId(initialVariant?.id ?? item.variants[0].id);
      setQuantity(1);
      setNote('');
    }
  }, [item, initialVariant]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const activeVariant =
    item.variants.find((v) => v.id === selectedVariantId) ?? item.variants[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCustomized(item, activeVariant, quantity, note.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1815]/55 dark:bg-black/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-item-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3] md:aspect-auto md:h-full bg-[#F3F1ED] dark:bg-[#26211D]">
          <ResilientImage
            src={item.image}
            alt={item.imageAlt}
            fallbackTitle={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-[#57534E] dark:text-[#D6D3D1]">
                {item.category}
                <span aria-hidden="true" className="mx-1.5">
                  ·
                </span>
                {item.availabilityNote}
              </p>
              <h2
                id="modal-item-title"
                className="font-display text-2xl font-semibold text-[#1C1815] dark:text-[#F5F2EC] mt-1 leading-tight"
              >
                {item.name}
              </h2>
              <p className="font-urdu text-base text-[#57534E] dark:text-[#D6D3D1] mt-1" dir="rtl" lang="ur">
                {item.urduName}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1815] dark:hover:text-[#F5F2EC] hover:bg-[#F3F1ED] dark:hover:bg-[#26211D] rounded-lg transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Close item details"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <p className="text-sm text-[#57534E] dark:text-[#D6D3D1] leading-relaxed">{item.description}</p>

          <div>
            <span className="block text-xs font-medium text-[#1C1815] dark:text-[#F5F2EC] mb-2">
              Select Size / Pack
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {item.variants.map((variant) => {
                const isSelected = variant.id === activeVariant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`px-3 py-2 rounded-lg border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#1B4332] dark:border-[#52B788] bg-[#1B4332]/5 dark:bg-[#1B4332]/25 text-[#1C1815] dark:text-[#F5F2EC]'
                        : 'border-[#E5E1DA] dark:border-[#342D28] bg-white dark:bg-[#26211D] text-[#57534E] dark:text-[#D6D3D1] hover:border-[#1C1815]/30 dark:hover:border-[#F5F2EC]/30'
                    }`}
                  >
                    <div className="text-xs font-medium whitespace-nowrap">{variant.label}</div>
                    <div className="text-xs font-semibold text-[#1C1815] dark:text-[#F5F2EC] tabular-nums mt-0.5">
                      Rs. {variant.pricePkr.toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="item-custom-note"
              className="block text-xs font-medium text-[#1C1815] dark:text-[#F5F2EC] mb-1.5"
            >
              {item.supportsCakeNote
                ? 'Cake Message or Preparation Note (Optional)'
                : 'Preparation Note (Optional)'}
            </label>
            <input
              id="item-custom-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={80}
              placeholder={
                item.supportsCakeNote
                  ? 'e.g. Happy Birthday Ayesha!'
                  : 'e.g. Extra mint chutney, less spicy'
              }
              className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F7] dark:bg-[#141210] border border-[#E5E1DA] dark:border-[#342D28] rounded-lg text-[#1C1815] dark:text-[#F5F2EC] placeholder:text-[#57534E] dark:placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1B4332] dark:focus:border-[#52B788]"
            />
          </div>

          <div className="mt-auto pt-4 border-t border-[#F0EDE7] dark:border-[#2E2823] flex items-center justify-between gap-4">
            <div className="inline-flex items-center border border-[#E5E1DA] dark:border-[#342D28] rounded-lg overflow-hidden bg-[#FAF9F7] dark:bg-[#26211D]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 text-[#1C1815] dark:text-[#F5F2EC] hover:bg-[#F3F1ED] dark:hover:bg-[#342D28] cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="px-3 text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC] tabular-nums">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2.5 text-[#1C1815] dark:text-[#F5F2EC] hover:bg-[#F3F1ED] dark:hover:bg-[#342D28] cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <button
              type="submit"
              className="flex-1 bg-[#1B4332] hover:bg-[#143325] text-white text-sm font-medium px-5 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap tabular-nums"
            >
              Add · Rs. {(activeVariant.pricePkr * quantity).toLocaleString()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
