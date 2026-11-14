import React, { useEffect, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { MenuItem, MenuVariant } from '../types/bakery';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  item: MenuItem;
  getCartQuantity: (itemId: string, variantId: string) => number;
  onAddToCart: (item: MenuItem, variant: MenuVariant) => void;
  onUpdateQuantity: (itemId: string, variantId: string, delta: number) => void;
  onInspectItem: (item: MenuItem, selectedVariant: MenuVariant) => void;
  onOpenCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  getCartQuantity,
  onAddToCart,
  onUpdateQuantity,
  onInspectItem,
  onOpenCart,
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(item.variants[0].id);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isDescClamped, setIsDescClamped] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  const activeVariant =
    item.variants.find((v) => v.id === selectedVariantId) ?? item.variants[0];

  const quantityInCart = getCartQuantity(item.id, activeVariant.id);

  useEffect(() => {
    const checkOverflow = () => {
      const el = descRef.current;
      if (!el || isDescExpanded) return;
      setIsDescClamped(el.scrollHeight > el.clientHeight + 1);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [item.description, isDescExpanded]);

  return (
    <article className="group h-full flex flex-col bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-xl overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={() => onInspectItem(item, activeVariant)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3F1ED] dark:bg-[#26211D] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1B4332]"
        aria-label={`View details and customize ${item.name}`}
      >
        <ResilientImage
          src={item.image}
          alt={item.imageAlt}
          fallbackTitle={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </button>

      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs font-medium text-[#57534E] dark:text-[#D6D3D1]">
          <span>{item.category}</span>
          <span aria-hidden="true">·</span>
          <span>{item.availabilityNote}</span>
        </div>

        <div>
          <button
            type="button"
            onClick={() => onInspectItem(item, activeVariant)}
            className="text-left w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
          >
            <h3 className="min-h-[3rem] font-sans text-base font-semibold text-[#1C1815] dark:text-[#F5F2EC] leading-snug group-hover:text-[#1B4332] dark:group-hover:text-[#74C69D] transition-colors">
              {item.name}
            </h3>
          </button>
          <p
            className="font-urdu text-sm text-[#44403C] dark:text-[#D6D3D1] mt-0.5 min-h-[1.5rem]"
            dir="rtl"
            lang="ur"
          >
            {item.urduName}
          </p>
        </div>

        <div className="space-y-1">
          <p
            ref={descRef}
            className={`text-sm text-[#44403C] dark:text-[#D6D3D1] leading-relaxed ${
              isDescExpanded ? '' : 'line-clamp-3'
            }`}
          >
            {item.description}
          </p>
          {(isDescClamped || isDescExpanded) && (
            <button
              type="button"
              onClick={() => setIsDescExpanded((prev) => !prev)}
              aria-expanded={isDescExpanded}
              className="text-xs font-semibold text-[#1B4332] dark:text-[#74C69D] hover:underline underline-offset-2 cursor-pointer"
            >
              {isDescExpanded ? 'Less' : 'More'}
            </button>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-[#F0EDE7] dark:border-[#2E2823] flex flex-col gap-3">
          {item.variants.length > 1 && (
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label={`Select size or pack for ${item.name}`}
            >
              {item.variants.map((variant) => {
                const isSelected = variant.id === activeVariant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-150 whitespace-nowrap max-w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1B4332] ${
                      isSelected
                        ? 'bg-[#1B4332] text-white border-[#1B4332] dark:bg-[#2D6A4F] dark:border-[#52B788]'
                        : 'bg-[#FAF9F7] dark:bg-[#26211D] text-[#44403C] dark:text-[#D6D3D1] border-[#E5E1DA] dark:border-[#342D28] hover:border-[#1B4332] dark:hover:border-[#52B788] hover:text-[#1C1815] dark:hover:text-[#F5F2EC]'
                    }`}
                  >
                    {variant.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2.5">
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-[#57534E] dark:text-[#D6D3D1]">
                {activeVariant.label}
              </span>
              <span className="text-base font-semibold text-[#1C1815] dark:text-[#F5F2EC] tabular-nums whitespace-nowrap">
                Rs. {activeVariant.pricePkr.toLocaleString()}
              </span>
            </div>

            {quantityInCart === 0 ? (
              <button
                type="button"
                onClick={() => onAddToCart(item, activeVariant)}
                className="inline-flex items-center justify-center bg-[#1B4332] hover:bg-[#143325] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[42px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
              >
                Add to Bag
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="inline-flex items-center border border-[#1B4332] dark:border-[#52B788] rounded-lg overflow-hidden bg-[#FAF9F7] dark:bg-[#26211D]">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, activeVariant.id, -1)}
                    className="p-2 text-[#1B4332] dark:text-[#74C69D] hover:bg-[#1B4332] hover:text-white transition-colors duration-150 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1B4332]"
                    aria-label={`Decrease quantity of ${item.name} (${activeVariant.label})`}
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span className="px-2 text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC] tabular-nums min-w-[24px] text-center">
                    {quantityInCart}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, activeVariant.id, 1)}
                    className="p-2 text-[#1B4332] dark:text-[#74C69D] hover:bg-[#1B4332] hover:text-white transition-colors duration-150 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1B4332]"
                    aria-label={`Increase quantity of ${item.name} (${activeVariant.label})`}
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                {onOpenCart && (
                  <button
                    type="button"
                    onClick={onOpenCart}
                    className="text-xs font-semibold text-[#1B4332] dark:text-[#74C69D] hover:underline underline-offset-2 whitespace-nowrap cursor-pointer py-1.5 px-1"
                  >
                    Checkout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
