import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, X, Phone, MessageCircle, MapPin, Clock, ArrowRight, ShoppingBag, RotateCcw, ExternalLink } from 'lucide-react';
import {
  BAKERY_INFO,
  HERO_SLIDES,
  MENU_CATEGORIES,
  MENU_ITEMS,
} from './data/menuData';
import { CartItem, MenuCategory, MenuItem, MenuVariant, OrderType, RecentOrder } from './types/bakery';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { SeasonalSpecials } from './components/SeasonalSpecials';
import { ProductCard } from './components/ProductCard';
import { ItemDetailModal } from './components/ItemDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ResilientImage } from './components/ResilientImage';

const CART_STORAGE_KEY = 'hot_cake_bakers_sialkot_cart_v1';
const RECENT_ORDERS_STORAGE_KEY = 'hot_cake_bakers_sialkot_recent_orders_v1';
const THEME_STORAGE_KEY = 'hot_cake_bakers_theme_v1';
const MAX_RECENT_ORDERS = 5;

export default function App() {
  const [showTopNotice, setShowTopNotice] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_ORDERS_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as RecentOrder[]) : [];
    } catch {
      return [];
    }
  });
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationImageOpen, setIsLocationImageOpen] = useState(false);
  const [seasonalItems, setSeasonalItems] = useState<MenuItem[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return 'dark';
      }
    } catch {
      // Ignore storage or matchMedia errors
    }
    return 'light';
  });
  const [inspectedItem, setInspectedItem] = useState<{
    item: MenuItem;
    variant: MenuVariant;
  } | null>(null);

  const handleSeasonalItemsLoaded = useCallback((loaded: MenuItem[]) => {
    setSeasonalItems(loaded);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_ORDERS_STORAGE_KEY, JSON.stringify(recentOrders));
    } catch {
      // Ignore storage quota errors
    }
  }, [recentOrders]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage write errors
    }
  }, [theme]);

  useEffect(() => {
    if (!isLocationImageOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLocationImageOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocationImageOpen]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.urduName.includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotalPkr = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPricePkr * item.quantity, 0),
    [cart]
  );

  const getCartQuantity = (itemId: string, variantId: string): number => {
    return cart
      .filter((entry) => entry.itemId === itemId && entry.variantId === variantId)
      .reduce((sum, entry) => sum + entry.quantity, 0);
  };

  const addToCart = (
    item: MenuItem,
    variant: MenuVariant,
    quantity = 1,
    note = ''
  ) => {
    const cleanNote = note.trim();
    const cartKey = `${item.id}__${variant.id}__${cleanNote}`;

    setCart((prev) => {
      const existing = prev.find((entry) => entry.cartKey === cartKey);
      if (existing) {
        return prev.map((entry) =>
          entry.cartKey === cartKey
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      return [
        ...prev,
        {
          cartKey,
          itemId: item.id,
          name: item.name,
          urduName: item.urduName,
          category: item.category,
          variantId: variant.id,
          variantLabel: variant.label,
          unitPricePkr: variant.pricePkr,
          quantity,
          image: item.image,
          note: cleanNote || undefined,
        },
      ];
    });
  };

  const updateItemVariantQuantity = (
    itemId: string,
    variantId: string,
    delta: number
  ) => {
    setCart((prev) => {
      const targetIndex = prev.findIndex(
        (entry) => entry.itemId === itemId && entry.variantId === variantId
      );
      if (targetIndex === -1) return prev;

      const updated = [...prev];
      const nextQty = updated[targetIndex].quantity + delta;
      if (nextQty <= 0) {
        updated.splice(targetIndex, 1);
      } else {
        updated[targetIndex] = { ...updated[targetIndex], quantity: nextQty };
      }
      return updated;
    });
  };

  const updateCartKeyQuantity = (cartKey: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.cartKey === cartKey
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const removeCartKey = (cartKey: string) => {
    setCart((prev) => prev.filter((entry) => entry.cartKey !== cartKey));
  };

  const handleOrderCompleted = (
    order: Omit<RecentOrder, 'id' | 'createdAtIso'>
  ) => {
    const signature = (list: CartItem[], type: OrderType) =>
      `${type}::${list.map((i) => `${i.cartKey}=${i.quantity}`).join('|')}`;

    const incomingSig = signature(order.items, order.orderType);
    const latest = recentOrders[0];
    const isRepeatClickOnLatest =
      Boolean(latest) && signature(latest.items, latest.orderType) === incomingSig;

    if (isRepeatClickOnLatest) {
      setRecentOrders((prev) => [
        { ...prev[0], createdAtIso: new Date().toISOString(), totalPkr: order.totalPkr },
        ...prev.slice(1),
      ]);
      return;
    }

    const nowIso = new Date().toISOString();
    const nextEntry: RecentOrder = {
      id: `ord_${Date.now()}`,
      createdAtIso: nowIso,
      ...order,
    };
    setRecentOrders((prev) => [nextEntry, ...prev].slice(0, MAX_RECENT_ORDERS));
  };

  const handleReorder = (order: RecentOrder) => {
    const allCatalog = [...MENU_ITEMS, ...seasonalItems];
    setCart((prev) => {
      const merged = [...prev];
      order.items.forEach((pastItem) => {
        const menuMatch = allCatalog.find((m) => m.id === pastItem.itemId);
        const variantMatch = menuMatch?.variants.find(
          (v) => v.id === pastItem.variantId
        );
        const freshUnitPrice = variantMatch?.pricePkr ?? pastItem.unitPricePkr;
        const freshImage = menuMatch?.image ?? pastItem.image;

        const existingIndex = merged.findIndex(
          (c) => c.cartKey === pastItem.cartKey
        );
        if (existingIndex >= 0) {
          merged[existingIndex] = {
            ...merged[existingIndex],
            quantity: merged[existingIndex].quantity + pastItem.quantity,
            unitPricePkr: freshUnitPrice,
            image: freshImage,
          };
        } else {
          merged.push({
            ...pastItem,
            unitPricePkr: freshUnitPrice,
            image: freshImage,
          });
        }
      });
      return merged;
    });
    setOrderType(order.orderType);
    setIsCartOpen(true);
  };

  const handleClearRecentOrders = () => {
    setRecentOrders([]);
  };

  const quickWhatsAppUrl = `https://wa.me/${BAKERY_INFO.whatsappDigits}?text=${encodeURIComponent(
    `Assalam-o-Alaikum ${BAKERY_INFO.name}, I would like to inquire about placing an order.`
  )}`;

  return (
    <div
      id="top"
      className="min-h-screen flex flex-col bg-[#FAF9F7] dark:bg-[#141210] text-[#1C1815] dark:text-[#F5F2EC] transition-colors duration-200"
    >
      {showTopNotice && (
        <div className="bg-[#1B4332] text-white text-xs h-9 px-4 flex items-center justify-center relative">
          <p className="truncate pr-6 text-center">
            {BAKERY_INFO.address}
            <span aria-hidden="true" className="mx-2 opacity-60">
              ·
            </span>
            {BAKERY_INFO.shortHours} ({BAKERY_INFO.services})
          </p>
          <button
            type="button"
            onClick={() => setShowTopNotice(false)}
            className="absolute right-3 p-1 text-white/80 hover:text-white cursor-pointer"
            aria-label="Dismiss bakery hours banner"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      <Header
        totalItems={totalItems}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {/* Section 1: Editorial Storefront Hero & 4-Column Highlights */}
        <section className="border-b border-[#E5E1DA] dark:border-[#342D28]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center gap-6">
                <div className="space-y-3">
                  <p className="text-xs font-medium tracking-wide text-[#57534E] dark:text-[#D6D3D1]">
                    Kashmir Road, Kotli Behram, Sialkot
                    <span aria-hidden="true" className="mx-2">
                      ·
                    </span>
                    Takeout &amp; Delivery
                  </p>
                  <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1C1815] dark:text-[#F5F2EC] leading-[1.12] tracking-tight text-balance">
                    Freshly baked cakes, savories, and Sialkot sweets.
                  </h1>
                  <p
                    className="font-urdu text-xl sm:text-2xl text-[#1B4332] dark:text-[#74C69D] pt-1"
                    dir="rtl"
                    lang="ur"
                  >
                    {BAKERY_INFO.urduName}
                  </p>
                </div>

                <p className="text-base text-[#44403C] dark:text-[#D6D3D1] leading-relaxed max-w-xl">
                  From morning Halwa Puri platters and golden tea-time cake rusk to evening chicken pizza, crispy chicken samosas, celebration cakes, and pure khoya mithai—order directly via WhatsApp for pickup or delivery across Sialkot.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <a
                    href="#menu"
                    className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#143325] text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0"
                  >
                    <span>Explore Menu &amp; Order</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href={`tel:${BAKERY_INFO.whatsappDigits}`}
                    className="inline-flex items-center gap-2 bg-white dark:bg-[#1D1916] hover:bg-[#F3F1ED] dark:hover:bg-[#26211D] text-[#1C1815] dark:text-[#F5F2EC] border border-[#E5E1DA] dark:border-[#342D28] text-sm font-medium px-5 py-3 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0"
                  >
                    <Phone className="w-4 h-4 text-[#1B4332] dark:text-[#74C69D]" aria-hidden="true" />
                    <span className="tabular-nums">{BAKERY_INFO.phoneDisplay}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                <HeroCarousel
                  slides={HERO_SLIDES}
                  intervalMs={5000}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-[#E5E1DA] dark:border-[#342D28] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-xs font-medium text-[#57534E] dark:text-[#D6D3D1]">Daily Schedule</p>
                <p className="text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC] mt-1">
                  Fresh Batches All Day
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#57534E] dark:text-[#D6D3D1]">Fulfillment</p>
                <p className="text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC] mt-1">
                  Takeout &amp; Sialkot Delivery
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#57534E] dark:text-[#D6D3D1]">Popular Specialties</p>
                <p className="text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC] mt-1">
                  Cakes, Rusk, Halwa Puri &amp; Pizza
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#57534E] dark:text-[#D6D3D1]">Direct WhatsApp Desk</p>
                <p className="text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC] mt-1 tabular-nums">
                  {BAKERY_INFO.phoneDisplay}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Interactive Menu & Ordering Catalog */}
        <section id="menu" className="scroll-mt-24 py-12 lg:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#57534E] dark:text-[#D6D3D1]">
                  Freshly Prepared Daily · Cash on Delivery &amp; Pickup
                </p>
                <h2 className="font-display text-3xl font-semibold text-[#1C1815] dark:text-[#F5F2EC] mt-1 text-balance">
                  Bakery &amp; Kitchen Menu
                </h2>
              </div>

              <div className="relative w-full md:w-72">
                <Search
                  className="w-4 h-4 text-[#57534E] dark:text-[#D6D3D1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cakes, samosa, halwa puri..."
                  aria-label="Search menu items"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-lg text-[#1C1815] dark:text-[#F5F2EC] placeholder:text-[#57534E] dark:placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1B4332] dark:focus:border-[#52B788]"
                />
              </div>
            </div>

            <SeasonalSpecials
              getCartQuantity={getCartQuantity}
              onAddToCart={(menuItem, variant) => {
                addToCart(menuItem, variant, 1);
                setIsCartOpen(true);
              }}
              onUpdateQuantity={updateItemVariantQuantity}
              onInspectItem={(menuItem, variant) =>
                setInspectedItem({ item: menuItem, variant })
              }
              onOpenCart={() => setIsCartOpen(true)}
              onItemsLoaded={handleSeasonalItemsLoaded}
            />

            {recentOrders.length > 0 && (
              <div className="bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC]">
                      Recent Orders
                    </h3>
                    <p className="text-xs text-[#57534E] dark:text-[#D6D3D1] mt-0.5">
                      Quickly re-order your previous items saved on this device
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearRecentOrders}
                    className="text-xs font-medium text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1815] dark:hover:text-[#F5F2EC] underline underline-offset-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Clear History
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentOrders.slice(0, 3).map((order) => {
                    const formattedDate = new Date(order.createdAtIso).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    });
                    const formattedTime = new Date(order.createdAtIso).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                    });
                    const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
                    const previewSummary = order.items
                      .map((i) => `${i.name} ×${i.quantity}`)
                      .join(', ');

                    return (
                      <div
                        key={order.id}
                        className="flex flex-col justify-between gap-3 p-4 rounded-lg bg-[#FAF9F7] dark:bg-[#26211D] border border-[#E5E1DA] dark:border-[#342D28]"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2 text-xs text-[#57534E] dark:text-[#D6D3D1]">
                            <span className="tabular-nums truncate">
                              {formattedDate} · {formattedTime}
                            </span>
                            <span className="font-semibold text-[#1C1815] dark:text-[#F5F2EC] tabular-nums shrink-0">
                              Rs. {order.totalPkr.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-[#1C1815] dark:text-[#F5F2EC] line-clamp-2 leading-snug">
                            {previewSummary}
                          </p>
                          <p className="text-xs text-[#57534E] dark:text-[#D6D3D1]">
                            {order.orderType === 'delivery' ? 'Sialkot Delivery' : 'Store Takeout'}
                            <span aria-hidden="true" className="mx-1.5">
                              ·
                            </span>
                            <span className="tabular-nums">
                              {itemCount} {itemCount === 1 ? 'item' : 'items'}
                            </span>
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="w-full inline-flex items-center justify-center gap-1.5 bg-white dark:bg-[#1D1916] hover:bg-[#1B4332] dark:hover:bg-[#1B4332] text-[#1C1815] dark:text-[#F5F2EC] hover:text-white border border-[#E5E1DA] dark:border-[#342D28] hover:border-[#1B4332] text-xs font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>Re-order</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div
                className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0"
                role="tablist"
                aria-label="Menu categories"
              >
                {MENU_CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] dark:focus-visible:outline-[#52B788] ${
                        isActive
                          ? 'bg-[#1B4332] text-white'
                          : 'bg-[#F3F1ED] dark:bg-[#26211D] text-[#44403C] dark:text-[#D6D3D1] hover:text-[#1C1815] dark:hover:text-[#F5F2EC] hover:bg-[#EAE6DE] dark:hover:bg-[#342D28]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs font-medium text-[#57534E] dark:text-[#D6D3D1] whitespace-nowrap tabular-nums">
                Showing {filteredItems.length} of {MENU_ITEMS.length} items
              </p>
            </div>

            {filteredItems.length === 0 ? (
              <div className="bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-xl p-12 text-center space-y-3">
                <p className="font-display text-xl text-[#1C1815] dark:text-[#F5F2EC]">
                  No items match &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-sm text-[#57534E] dark:text-[#D6D3D1]">
                  Try clearing your search or switching back to all bakery categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="inline-flex items-center justify-center bg-[#1B4332] hover:bg-[#143325] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    getCartQuantity={getCartQuantity}
                    onAddToCart={(menuItem, variant) => {
                      addToCart(menuItem, variant, 1);
                      setIsCartOpen(true);
                    }}
                    onUpdateQuantity={updateItemVariantQuantity}
                    onInspectItem={(menuItem, variant) =>
                      setInspectedItem({ item: menuItem, variant })
                    }
                    onOpenCart={() => setIsCartOpen(true)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Craftsmanship & Kashmir Road Counter */}
        <section
          id="specialties"
          className="scroll-mt-24 bg-white dark:bg-[#1D1916] border-t border-b border-[#E5E1DA] dark:border-[#342D28] py-12 lg:py-16"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5">
                <button
                  type="button"
                  onClick={() => setIsLocationImageOpen(true)}
                  className="group relative w-full h-[280px] sm:h-[340px] lg:h-[380px] rounded-xl overflow-hidden border border-[#E5E1DA] dark:border-[#342D28] bg-[#F3F1ED] dark:bg-[#26211D] block text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332] dark:focus-visible:outline-[#52B788]"
                  aria-label="Enlarge Hot Cake Bakers Kashmir Road counter display photo"
                >
                  <ResilientImage
                    src={BAKERY_INFO.secondaryShowcaseImage}
                    alt="Hot Cake Bakers Kashmir Road counter display with celebration cakes, puff patties, and mithai"
                    fallbackTitle="Kashmir Road Bakery Counter"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur-xs">
                    View Full Photo
                  </span>
                </button>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-center gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[#1B4332] dark:text-[#74C69D]">
                    Daily Kitchen &amp; Bakery Craft · Kotli Behram
                  </p>
                  <h2 className="font-display text-3xl font-semibold text-[#1C1815] dark:text-[#F5F2EC] text-balance">
                    From morning Halwa Puri to midnight celebrations.
                  </h2>
                </div>

                <p className="text-base text-[#44403C] dark:text-[#D6D3D1] leading-relaxed">
                  Situated on Kashmir Road near Lari Adda in Kotli Behram, Hot Cake Bakers pairs traditional Sialkoti breakfast and mithai craftsmanship with fresh evening baking for takeout and home delivery.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={quickWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#143325] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Message on WhatsApp</span>
                  </a>
                  <a
                    href="#location"
                    className="inline-flex items-center gap-2 bg-[#FAF9F7] dark:bg-[#26211D] hover:bg-[#F3F1ED] dark:hover:bg-[#342D28] text-[#1C1815] dark:text-[#F5F2EC] border border-[#E5E1DA] dark:border-[#342D28] text-sm font-medium px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <MapPin className="w-4 h-4 text-[#1B4332] dark:text-[#74C69D]" aria-hidden="true" />
                    <span>View Map &amp; Directions</span>
                  </a>
                  <a
                    href={BAKERY_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1B4332] dark:text-[#74C69D] hover:underline underline-offset-4 px-2 py-2 whitespace-nowrap"
                  >
                    <span>View on Google</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location & Live Map Section */}
        <section
          id="location"
          className="scroll-mt-24 bg-[#FAF9F7] dark:bg-[#141210] border-b border-[#E5E1DA] dark:border-[#342D28] py-12 lg:py-16"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium text-[#1B4332] dark:text-[#74C69D]">
                  Visit Our Bakery
                </p>
                <h2 className="font-display text-3xl font-semibold text-[#1C1815] dark:text-[#F5F2EC] mt-1 text-balance">
                  Kashmir Road, Kotli Behram, Sialkot
                </h2>
              </div>

              <p className="text-sm text-[#44403C] dark:text-[#D6D3D1] leading-relaxed">
                Located near Lari Adda on Main Kashmir Road, Sialkot. Stop by for fresh counter takeout, morning Halwa Puri, or custom celebration cakes.
              </p>

              <ul className="space-y-3 text-sm text-[#1C1815] dark:text-[#F5F2EC] pt-2 border-t border-[#E5E1DA] dark:border-[#342D28]">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#1B4332] dark:text-[#74C69D] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold">Exact Address:</strong> GG6C+JPM, {BAKERY_INFO.address}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#1B4332] dark:text-[#74C69D] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="tabular-nums">
                    <strong className="font-semibold">Opening Hours:</strong> {BAKERY_INFO.hoursDisplay}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#1B4332] dark:text-[#74C69D] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="tabular-nums">
                    <strong className="font-semibold">Phone / WhatsApp:</strong> {BAKERY_INFO.phoneDisplay}
                  </span>
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={BAKERY_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#143325] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={`tel:${BAKERY_INFO.whatsappDigits}`}
                  className="inline-flex items-center gap-2 bg-white dark:bg-[#1D1916] hover:bg-[#F3F1ED] dark:hover:bg-[#26211D] text-[#1C1815] dark:text-[#F5F2EC] border border-[#E5E1DA] dark:border-[#342D28] text-sm font-medium px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 text-[#1B4332] dark:text-[#74C69D]" aria-hidden="true" />
                  <span className="tabular-nums">Call {BAKERY_INFO.phoneDisplay}</span>
                </a>
              </div>
            </div>

            <div className="w-full h-80 rounded-xl overflow-hidden shadow-xs border border-[#E5E1DA] dark:border-[#342D28] bg-[#F3F1ED] dark:bg-[#26211D]">
              <iframe
                title="Hot Cake Bakers Kashmir Road Sialkot Location Map"
                src="https://maps.google.com/maps?q=Kashmir%20Road%20Kotli%20Behram%20Sialkot&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 dark:brightness-90 dark:contrast-110"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Section 4: Footer */}
      <footer className="bg-[#FAF9F7] dark:bg-[#141210] py-10 pb-24 md:pb-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="font-display text-lg font-semibold text-[#1C1815] dark:text-[#F5F2EC]">
              {BAKERY_INFO.name}{' '}
              <span className="font-urdu text-base font-normal text-[#57534E] dark:text-[#D6D3D1] ms-2" lang="ur">
                {BAKERY_INFO.urduName}
              </span>
            </p>
            <p className="text-xs font-medium text-[#57534E] dark:text-[#D6D3D1]">
              {BAKERY_INFO.address} · {BAKERY_INFO.shortHours} · {BAKERY_INFO.phoneDisplay}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#57534E] dark:text-[#D6D3D1]">
            <a href="#menu" className="hover:text-[#1C1815] dark:hover:text-[#F5F2EC] transition-colors">
              Full Menu
            </a>
            <a href="#location" className="hover:text-[#1C1815] dark:hover:text-[#F5F2EC] transition-colors">
              Location &amp; Hours
            </a>
            <a
              href={quickWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1C1815] dark:hover:text-[#F5F2EC] transition-colors"
            >
              WhatsApp Order
            </a>
            <span className="text-[#57534E] dark:text-[#A8A29E]">
              © {new Date().getFullYear()} {BAKERY_INFO.name}
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Bag Bar */}
      {totalItems > 0 && !isCartOpen && (
        <div className="md:hidden fixed bottom-3 inset-x-4 z-30">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#1B4332] hover:bg-[#143325] text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-3 cursor-pointer"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span className="tabular-nums">{totalItems} items in bag</span>
            </span>
            <span className="text-sm font-semibold tabular-nums">
              Checkout · Rs. {subtotalPkr.toLocaleString()}
            </span>
          </button>
        </div>
      )}

      <ItemDetailModal
        item={inspectedItem?.item ?? null}
        initialVariant={inspectedItem?.variant ?? null}
        onClose={() => setInspectedItem(null)}
        onAddCustomized={(item, variant, qty, note) => {
          addToCart(item, variant, qty, note);
          setIsCartOpen(true);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        orderType={orderType}
        onChangeOrderType={setOrderType}
        recentOrders={recentOrders}
        onOrderCompleted={handleOrderCompleted}
        onReorder={handleReorder}
        onClearRecentOrders={handleClearRecentOrders}
        onUpdateCartKeyQuantity={updateCartKeyQuantity}
        onRemoveItem={removeCartKey}
        onClearCart={() => setCart([])}
      />

      {isLocationImageOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1815]/75 dark:bg-black/80 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="location-modal-title"
          onClick={() => setIsLocationImageOpen(false)}
        >
          <div
            className="w-full max-w-3xl bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#E5E1DA] dark:border-[#342D28] flex items-center justify-between gap-4">
              <div>
                <h2 id="location-modal-title" className="font-display text-lg font-semibold text-[#1C1815] dark:text-[#F5F2EC]">
                  {BAKERY_INFO.name} — Kashmir Road Counter
                </h2>
                <p className="text-xs text-[#57534E] dark:text-[#D6D3D1] mt-0.5">
                  {BAKERY_INFO.address} · {BAKERY_INFO.services}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLocationImageOpen(false)}
                className="p-2 text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1815] dark:hover:text-[#F5F2EC] hover:bg-[#F3F1ED] dark:hover:bg-[#26211D] rounded-lg transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Close location photo"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="bg-[#F3F1ED] dark:bg-[#26211D] max-h-[70vh] overflow-hidden">
              <ResilientImage
                src={BAKERY_INFO.secondaryShowcaseImage}
                alt="Hot Cake Bakers Kashmir Road Sialkot counter display"
                fallbackTitle={BAKERY_INFO.address}
                className="w-full h-full max-h-[70vh] object-cover"
              />
            </div>
            <div className="px-5 py-3.5 bg-[#FAF9F7] dark:bg-[#26211D] border-t border-[#E5E1DA] dark:border-[#342D28] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#57534E] dark:text-[#D6D3D1]">
                Kashmir Road near Lari Adda, Kotli Behram, Sialkot
              </span>
              <a
                href={BAKERY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B4332] dark:text-[#74C69D] hover:underline underline-offset-4"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
