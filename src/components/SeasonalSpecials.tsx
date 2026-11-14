import React, { useEffect, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import gajarHalwaImg from '../assets/images/seasonal_gajar_halwa_1794567029278.jpg';
import winterPinniImg from '../assets/images/seasonal_winter_pinni_1794567030094.jpg';
import walnutCakeImg from '../assets/images/seasonal_walnut_cake_1794567031075.jpg';
import { MenuItem, MenuVariant } from '../types/bakery';
import { ProductCard } from './ProductCard';

interface RawSeasonalItem {
  id: string;
  name: string;
  urduName: string;
  category: MenuItem['category'];
  availabilityNote: string;
  description: string;
  imageKey: 'gajarHalwa' | 'winterPinni' | 'walnutCake';
  imageAlt: string;
  variants: MenuVariant[];
  supportsCakeNote?: boolean;
}

const IMAGE_MAP: Record<RawSeasonalItem['imageKey'], string> = {
  gajarHalwa: gajarHalwaImg,
  winterPinni: winterPinniImg,
  walnutCake: walnutCakeImg,
};

interface SeasonalSpecialsProps {
  getCartQuantity: (itemId: string, variantId: string) => number;
  onAddToCart: (item: MenuItem, variant: MenuVariant) => void;
  onUpdateQuantity: (itemId: string, variantId: string, delta: number) => void;
  onInspectItem: (item: MenuItem, variant: MenuVariant) => void;
  onOpenCart?: () => void;
  onItemsLoaded?: (items: MenuItem[]) => void;
}

export const SeasonalSpecials: React.FC<SeasonalSpecialsProps> = ({
  getCartQuantity,
  onAddToCart,
  onUpdateQuantity,
  onInspectItem,
  onOpenCart,
  onItemsLoaded,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const loadSpecials = useCallback(async () => {
    setStatus('loading');
    try {
      const response = await fetch('/data/seasonal-specials.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const raw: RawSeasonalItem[] = await response.json();
      const hydrated: MenuItem[] = raw.map((entry) => ({
        id: entry.id,
        name: entry.name,
        urduName: entry.urduName,
        category: entry.category,
        availabilityNote: entry.availabilityNote,
        description: entry.description,
        image: IMAGE_MAP[entry.imageKey] ?? gajarHalwaImg,
        imageAlt: entry.imageAlt,
        variants: entry.variants,
        supportsCakeNote: entry.supportsCakeNote,
      }));
      setItems(hydrated);
      setStatus('ready');
      onItemsLoaded?.(hydrated);
    } catch {
      setStatus('error');
    }
  }, [onItemsLoaded]);

  useEffect(() => {
    loadSpecials();
  }, [loadSpecials]);

  return (
    <div
      id="seasonal"
      className="scroll-mt-24 bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-xl p-4 sm:p-6 space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#1B4332] dark:text-[#74C69D]">
            Limited-Time Winter &amp; Evening Batch
            {status === 'ready' && (
              <>
                <span aria-hidden="true" className="mx-1.5">
                  ·
                </span>
                <span className="tabular-nums">{items.length} specials available</span>
              </>
            )}
          </p>
          <h3 className="font-display text-2xl font-semibold text-[#1C1815] dark:text-[#F5F2EC] mt-0.5">
            Seasonal Specials
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          aria-expanded={isVisible}
          aria-controls="seasonal-specials-panel"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FAF9F7] dark:bg-[#26211D] hover:bg-[#F3F1ED] dark:hover:bg-[#342D28] text-[#1C1815] dark:text-[#F5F2EC] border border-[#E5E1DA] dark:border-[#342D28] text-xs font-medium px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
        >
          <span>{isVisible ? 'Hide Seasonal Specials' : 'Show Seasonal Specials'}</span>
          {isVisible ? (
            <ChevronUp className="w-4 h-4 text-[#57534E] dark:text-[#D6D3D1]" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#57534E] dark:text-[#D6D3D1]" aria-hidden="true" />
          )}
        </button>
      </div>

      {isVisible && (
        <div id="seasonal-specials-panel">
          {status === 'loading' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
              {[0, 1, 2].map((skeletonIdx) => (
                <div
                  key={skeletonIdx}
                  className="border border-[#E5E1DA] dark:border-[#342D28] rounded-xl overflow-hidden bg-[#FAF9F7] dark:bg-[#26211D] animate-pulse"
                >
                  <div className="aspect-[4/3] bg-[#EAE6DE] dark:bg-[#342D28]" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-1/2 bg-[#EAE6DE] dark:bg-[#342D28] rounded" />
                    <div className="h-5 w-3/4 bg-[#EAE6DE] dark:bg-[#342D28] rounded" />
                    <div className="h-4 w-full bg-[#EAE6DE] dark:bg-[#342D28] rounded" />
                    <div className="h-9 w-full bg-[#EAE6DE] dark:bg-[#342D28] rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {status === 'error' && (
            <div className="bg-[#FAF9F7] dark:bg-[#26211D] border border-[#E5E1DA] dark:border-[#342D28] rounded-lg p-6 text-center space-y-3">
              <p className="text-sm font-medium text-[#1C1815] dark:text-[#F5F2EC]">
                Unable to load Seasonal Specials right now.
              </p>
              <button
                type="button"
                onClick={loadSpecials}
                className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#143325] text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Retry Loading Specials</span>
              </button>
            </div>
          )}

          {status === 'ready' && items.length === 0 && (
            <p className="text-sm text-[#57534E] dark:text-[#D6D3D1] py-4">
              No seasonal specials are active right now. Check our main bakery menu below.
            </p>
          )}

          {status === 'ready' && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  getCartQuantity={getCartQuantity}
                  onAddToCart={onAddToCart}
                  onUpdateQuantity={onUpdateQuantity}
                  onInspectItem={onInspectItem}
                  onOpenCart={onOpenCart}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
