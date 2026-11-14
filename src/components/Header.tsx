import React, { useState, useEffect } from 'react';
import { Menu, Moon, ShoppingBag, Sun, X } from 'lucide-react';
import { TrackedOrder } from '../types/bakery';
import { OrderStatusMenu } from './OrderStatusMenu';

interface HeaderProps {
  totalItems: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenCart: () => void;
  trackedOrder: TrackedOrder | null;
  onAdvanceOrderStage: () => void;
  onDismissOrder: () => void;
  onQuickReorder?: () => void;
}

const NAV_LINKS = [
  { id: 'menu', label: 'Menu' },
  { id: 'seasonal', label: 'Specials' },
  { id: 'specialties', label: 'Craft' },
  { id: 'location', label: 'Location' },
] as const;

export const Header: React.FC<HeaderProps> = ({
  totalItems,
  theme,
  onToggleTheme,
  onOpenCart,
  trackedOrder,
  onAdvanceOrderStage,
  onDismissOrder,
  onQuickReorder,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setIsMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F7]/95 dark:bg-[#141210]/95 backdrop-blur-sm border-b border-[#E5E1DA] dark:border-[#342D28] transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, 'top')}
          className="font-display text-base sm:text-xl lg:text-2xl font-semibold tracking-tight text-[#1C1815] dark:text-[#F5F2EC] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332] dark:focus-visible:outline-[#74C69D]"
        >
          Hot Cake Bakers
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-4 lg:gap-7 text-sm font-medium text-[#44403C] dark:text-[#D6D3D1]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className="hover:text-[#1C1815] dark:hover:text-[#F5F2EC] hover:underline underline-offset-4 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <OrderStatusMenu
            trackedOrder={trackedOrder}
            onAdvanceStage={onAdvanceOrderStage}
            onDismissOrder={onDismissOrder}
            onQuickReorder={onQuickReorder}
          />

          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-white dark:bg-[#1D1916] hover:bg-[#F3F1ED] dark:hover:bg-[#26211D] text-[#1C1815] dark:text-[#F5F2EC] border border-[#E5E1DA] dark:border-[#342D28] rounded-lg transition-colors duration-150 shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F3C669]" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-[#44403C]" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#1B4332] hover:bg-[#143325] text-white text-xs sm:text-sm font-medium px-2 sm:px-3 lg:px-4 h-9 sm:h-10 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
            aria-label={`Open order bag with ${totalItems} items`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              <span className="hidden lg:inline">Order </span>Bag
            </span>
            <span className="tabular-nums font-semibold opacity-90">({totalItems})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 bg-white dark:bg-[#1D1916] hover:bg-[#F3F1ED] dark:hover:bg-[#26211D] text-[#1C1815] dark:text-[#F5F2EC] border border-[#E5E1DA] dark:border-[#342D28] rounded-lg transition-colors duration-150 shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Menu className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav
          id="mobile-nav-panel"
          aria-label="Mobile navigation"
          className="md:hidden border-t border-[#E5E1DA] dark:border-[#342D28] bg-[#FAF9F7] dark:bg-[#141210] px-4 py-3"
        >
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="flex items-center justify-center py-2.5 px-3 rounded-lg text-sm font-medium text-[#1C1815] dark:text-[#F5F2EC] bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] hover:border-[#1B4332] dark:hover:border-[#52B788] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
