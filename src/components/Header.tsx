import React from 'react';
import { Moon, ShoppingBag, Sun } from 'lucide-react';

interface HeaderProps {
  totalItems: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalItems,
  theme,
  onToggleTheme,
  onOpenCart,
}) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F7]/95 dark:bg-[#141210]/95 backdrop-blur-sm border-b border-[#E5E1DA] dark:border-[#342D28] transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 lg:gap-8">
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, 'top')}
          className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#1C1815] dark:text-[#F5F2EC] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332] dark:focus-visible:outline-[#74C69D]"
        >
          Hot Cake Bakers
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#44403C] dark:text-[#D6D3D1]"
        >
          <a
            href="#menu"
            onClick={(e) => handleNavClick(e, 'menu')}
            className="hover:text-[#1C1815] dark:hover:text-[#F5F2EC] hover:underline underline-offset-4 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
          >
            Menu
          </a>
          <a
            href="#seasonal"
            onClick={(e) => handleNavClick(e, 'seasonal')}
            className="hover:text-[#1C1815] dark:hover:text-[#F5F2EC] hover:underline underline-offset-4 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
          >
            Specials
          </a>
          <a
            href="#specialties"
            onClick={(e) => handleNavClick(e, 'specialties')}
            className="hover:text-[#1C1815] dark:hover:text-[#F5F2EC] hover:underline underline-offset-4 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
          >
            Craft
          </a>
          <a
            href="#location"
            onClick={(e) => handleNavClick(e, 'location')}
            className="hover:text-[#1C1815] dark:hover:text-[#F5F2EC] hover:underline underline-offset-4 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
          >
            Location
          </a>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center justify-center w-10 h-10 bg-white dark:bg-[#1D1916] hover:bg-[#F3F1ED] dark:hover:bg-[#26211D] text-[#1C1815] dark:text-[#F5F2EC] border border-[#E5E1DA] dark:border-[#342D28] rounded-lg transition-colors duration-150 shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
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
            className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#143325] text-white text-sm font-medium px-3.5 sm:px-4 h-10 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
            aria-label={`Open order bag with ${totalItems} items`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Order Bag</span>
            <span className="tabular-nums font-semibold opacity-90">({totalItems})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
