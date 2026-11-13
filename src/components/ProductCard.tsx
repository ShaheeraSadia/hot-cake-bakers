import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { MenuItem, MenuVariant } from '../types/bakery';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  item: MenuItem;
  getCartQuantity: (itemId: string, variantId: string) => number;
  onAddToCart: (item: MenuItem, variant: MenuVariant) => void;
  onUpdateQuantity: (itemId: string, variantId: string, delta: number) => void;
  onInspectItem: (item: MenuItem, selectedVariant: MenuVariant) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  getCartQuantity,
  onAddToCart,
  onUpdateQuantity,
  onInspectItem,
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(item.variants[0].id);

  const activeVariant =
    item.variants.find((v) => v.id === selectedVariantId) ?? item.variants[0];

  const quantityInCart = getCartQuantity(item.id, activeVariant.id);

  return (
    <article className="group flex flex-col bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-xl overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md">
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

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center justify-between gap-2 text-xs text-[#5C554E] dark:text-[#B5ACA3]">
          <span className="truncate">
            {item.category}
            <span aria-hidden="true" className="mx-1.5">
              ·
            </span>
            {item.availabilityNote}
          </span>
        </div>

        <div>
          <button
            type="button"
            onClick={() => onInspectItem(item, activeVariant)}
            className="text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
          >
            <h3 className="font-sans text-lg font-semibold text-[#1C1815] dark:text-[#F5F2EC] leading-snug group-hover:text-[#1B4332] dark:group-hover:text-[#74C69D] transition-colors">
              {item.name}
            </h3>
          </button>
          <p className="font-urdu text-sm text-[#5C554E] dark:text-[#B5ACA3] mt-0.5" dir="rtl" lang="ur">
            {item.urduName}
          </p>
        </div>

        <p className="text-sm text-[#5C554E] dark:text-[#B5ACA3] leading-relaxed line-clamp-2">
          {item.description}
        </p>

        <div className="mt-auto pt-3 border-t border-[#F0EDE7] dark:border-[#2E2823] flex flex-col gap-3">
          {item.variants.length > 1 && (
            <div
              className="flex items-center gap-1 p-1 bg-[#F3F1ED] dark:bg-[#26211D] rounded-lg"
              role="group"
              aria-label={`Select size or pack for ${item.name}`}
            >
              {item.variants.map((variant) => {
                const isSelected = variant.id === activeVariant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap truncate cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1B4332] ${
                      isSelected
                        ? 'bg-white dark:bg-[#342D28] text-[#1C1815] dark:text-[#F5F2EC] shadow-xs'
                        : 'text-[#5C554E] dark:text-[#B5ACA3] hover:text-[#1C1815] dark:hover:text-[#F5F2EC]'
                    }`}
                  >
                    {variant.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-[#5C554E] dark:text-[#B5ACA3]">{activeVariant.label}</span>
              <span className="text-base font-semibold text-[#1C1815] dark:text-[#F5F2EC] tabular-nums">
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
              <div className="inline-flex items-center border border-[#1B4332] dark:border-[#52B788] rounded-lg overflow-hidden bg-[#FAF9F7] dark:bg-[#26211D]">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, activeVariant.id, -1)}
                  className="p-2.5 text-[#1B4332] dark:text-[#74C69D] hover:bg-[#1B4332] hover:text-white transition-colors duration-150 cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1B4332]"
                  aria-label={`Decrease quantity of ${item.name} (${activeVariant.label})`}
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="px-3 text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC] tabular-nums min-w-[32px] text-center">
                  {quantityInCart}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, activeVariant.id, 1)}
                  className="p-2.5 text-[#1B4332] dark:text-[#74C69D] hover:bg-[#1B4332] hover:text-white transition-colors duration-150 cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1B4332]"
                  aria-label={`Increase quantity of ${item.name} (${activeVariant.label})`}
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
