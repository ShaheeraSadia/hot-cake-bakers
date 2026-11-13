import React, { useMemo, useState, useEffect } from 'react';
import { X, Minus, Plus, Trash2, MessageCircle, Copy, Check, ArrowRight, Clock, RotateCcw } from 'lucide-react';
import { BAKERY_INFO } from '../data/menuData';
import { CartItem, CustomerDetails, OrderType, RecentOrder } from '../types/bakery';
import { calculateDeliveryEstimate } from '../utils/deliveryEstimator';
import { calculateOrderPoints } from '../utils/loyaltyRewards';
import { ResilientImage } from './ResilientImage';

const CUSTOMER_STORAGE_KEY = 'hot_cake_bakers_sialkot_customer_v1';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  recentOrders: RecentOrder[];
  onOrderCompleted: (order: Omit<RecentOrder, 'id' | 'createdAtIso'>) => void;
  onReorder: (order: RecentOrder) => void;
  onClearRecentOrders: () => void;
  onUpdateCartKeyQuantity: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  onChangeOrderType,
  recentOrders,
  onOrderCompleted,
  onReorder,
  onClearRecentOrders,
  onUpdateCartKeyQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customer, setCustomer] = useState<CustomerDetails>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as CustomerDetails;
      }
    } catch {
      // Ignore storage read errors
    }
    return {
      name: '',
      phone: '',
      address: '',
      instructions: '',
    };
  });
  const [copied, setCopied] = useState(false);
  const [orderPrepared, setOrderPrepared] = useState(false);
  const [formError, setFormError] = useState('');
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
    } catch {
      // Ignore storage write errors
    }
  }, [customer]);

  useEffect(() => {
    if (!isOpen) return;
    setNow(new Date());
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 30_000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const subtotalPkr = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPricePkr * item.quantity, 0),
    [items]
  );

  const deliveryFeePkr = useMemo(() => {
    if (orderType === 'takeout' || items.length === 0) return 0;
    return subtotalPkr >= BAKERY_INFO.freeDeliveryThresholdPkr
      ? 0
      : BAKERY_INFO.deliveryFeePkr;
  }, [orderType, items.length, subtotalPkr]);

  const grandTotalPkr = subtotalPkr + deliveryFeePkr;

  const deliveryEstimate = useMemo(
    () => calculateDeliveryEstimate(now, orderType, items),
    [now, orderType, items]
  );

  const formattedWhatsAppText = useMemo(() => {
    const lines: string[] = [
      `*New Order — ${BAKERY_INFO.name}*`,
      `(${BAKERY_INFO.urduName})`,
      `Order Type: ${orderType === 'delivery' ? 'Home Delivery (Sialkot)' : 'Store Takeout (Kashmir Road)'}`,
      `${deliveryEstimate.headline}`,
      '',
      '*Items Ordered:*',
    ];

    items.forEach((item, idx) => {
      const lineTotal = item.unitPricePkr * item.quantity;
      lines.push(
        `${idx + 1}. ${item.name} (${item.variantLabel}) x${item.quantity} — Rs. ${lineTotal.toLocaleString()}`
      );
      if (item.note) {
        lines.push(`   Note: ${item.note}`);
      }
    });

    lines.push('');
    lines.push(`Subtotal: Rs. ${subtotalPkr.toLocaleString()}`);
    if (orderType === 'delivery') {
      lines.push(
        `Delivery Fee: ${deliveryFeePkr === 0 ? 'FREE' : `Rs. ${deliveryFeePkr}`}`
      );
    }
    lines.push(`*Total Payable (Cash on ${orderType === 'delivery' ? 'Delivery' : 'Pickup'}): Rs. ${grandTotalPkr.toLocaleString()}*`);
    lines.push('');
    lines.push('*Customer Details:*');
    lines.push(`Name: ${customer.name.trim() || 'Guest'}`);
    lines.push(`Phone: ${customer.phone.trim() || 'Not provided'}`);
    if (orderType === 'delivery') {
      lines.push(`Address: ${customer.address.trim() || 'Sialkot'}`);
    }
    if (customer.instructions.trim()) {
      lines.push(`Instructions: ${customer.instructions.trim()}`);
    }

    return lines.join('\n');
  }, [items, orderType, subtotalPkr, deliveryFeePkr, grandTotalPkr, customer, deliveryEstimate]);

  const whatsappUrl = useMemo(() => {
    return `https://wa.me/${BAKERY_INFO.whatsappDigits}?text=${encodeURIComponent(
      formattedWhatsAppText
    )}`;
  }, [formattedWhatsAppText]);

  const isFormValid = useMemo(() => {
    if (!customer.name.trim() || !customer.phone.trim()) return false;
    if (orderType === 'delivery' && !customer.address.trim()) return false;
    return true;
  }, [customer, orderType]);

  const recordCurrentOrder = () => {
    if (items.length === 0) return;
    onOrderCompleted({
      orderType,
      items: items.map((item) => ({ ...item })),
      totalPkr: grandTotalPkr,
      customerName: customer.name.trim(),
    });
  };

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isFormValid) {
      e.preventDefault();
      setFormError(
        orderType === 'delivery'
          ? 'Please enter your name, phone number, and Sialkot delivery address.'
          : 'Please enter your name and phone number for store pickup.'
      );
      return;
    }
    setFormError('');
    recordCurrentOrder();
    setOrderPrepared(true);
  };

  const handleCopyMessage = async () => {
    if (!isFormValid) {
      setFormError(
        orderType === 'delivery'
          ? 'Please enter your name, phone number, and Sialkot delivery address first.'
          : 'Please enter your name and phone number first.'
      );
      return;
    }
    setFormError('');
    try {
      await navigator.clipboard.writeText(formattedWhatsAppText);
      recordCurrentOrder();
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setFormError('Could not copy automatically. Use the Send on WhatsApp button below.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1C1815]/50 dark:bg-black/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-md bg-[#FAF9F7] dark:bg-[#141210] h-full flex flex-col border-l border-[#E5E1DA] dark:border-[#342D28] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-white dark:bg-[#1D1916] border-b border-[#E5E1DA] dark:border-[#342D28] flex items-center justify-between gap-4">
          <div>
            <h2 id="cart-drawer-title" className="font-display text-xl font-semibold text-[#1C1815] dark:text-[#F5F2EC]">
              Your Bakery Bag
            </h2>
            <p className="text-xs text-[#5C554E] dark:text-[#B5ACA3] mt-0.5">
              Direct WhatsApp Checkout · {BAKERY_INFO.phoneDisplay}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#5C554E] dark:text-[#B5ACA3] hover:text-[#1C1815] dark:hover:text-[#F5F2EC] hover:bg-[#F3F1ED] dark:hover:bg-[#26211D] rounded-lg transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Close bag drawer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {items.length === 0 ? (
            <div className="py-10 space-y-8">
              <div className="text-center space-y-3">
                <p className="font-display text-xl text-[#1C1815] dark:text-[#F5F2EC]">Your bag is empty</p>
                <p className="text-sm text-[#5C554E] dark:text-[#B5ACA3] max-w-xs mx-auto">
                  Add fresh cakes, pastries, cake rusk, halwa puri, chicken samosas, or pizza to prepare a WhatsApp order.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#143325] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer mt-2"
                >
                  Browse Menu
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {recentOrders.length > 0 && (
                <div className="pt-6 border-t border-[#E5E1DA] dark:border-[#342D28] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC]">
                      Recent Orders
                    </h3>
                    <button
                      type="button"
                      onClick={onClearRecentOrders}
                      className="text-xs text-[#5C554E] dark:text-[#B5ACA3] hover:text-[#1C1815] dark:hover:text-[#F5F2EC] underline underline-offset-2 cursor-pointer"
                    >
                      Clear History
                    </button>
                  </div>

                  <ul className="space-y-2.5">
                    {recentOrders.map((order) => {
                      const formattedDate = new Date(order.createdAtIso).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      });
                      const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
                      const summaryText = order.items
                        .map((i) => `${i.name} (${i.variantLabel}) ×${i.quantity}`)
                        .join(', ');

                      return (
                        <li
                          key={order.id}
                          className="bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-xl p-4 space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs text-[#5C554E] dark:text-[#B5ACA3]">
                            <span className="tabular-nums">
                              {formattedDate}
                              <span aria-hidden="true" className="mx-1.5">
                                ·
                              </span>
                              {order.orderType === 'delivery' ? 'Delivery' : 'Takeout'}
                              <span aria-hidden="true" className="mx-1.5">
                                ·
                              </span>
                              {itemCount} {itemCount === 1 ? 'item' : 'items'}
                            </span>
                            <span className="font-semibold text-[#1C1815] dark:text-[#F5F2EC] tabular-nums">
                              Rs. {order.totalPkr.toLocaleString()}
                            </span>
                          </div>

                          <p className="text-xs text-[#1C1815] dark:text-[#F5F2EC] leading-relaxed line-clamp-2">
                            {summaryText}
                          </p>

                          <button
                            type="button"
                            onClick={() => onReorder(order)}
                            className="w-full inline-flex items-center justify-center gap-1.5 bg-[#FAF9F7] dark:bg-[#26211D] hover:bg-[#1B4332] dark:hover:bg-[#1B4332] text-[#1C1815] dark:text-[#F5F2EC] hover:text-white border border-[#E5E1DA] dark:border-[#342D28] hover:border-[#1B4332] text-xs font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Re-order Items</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC]">
                    Order Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      onClearCart();
                      setOrderPrepared(false);
                    }}
                    className="text-xs text-[#5C554E] dark:text-[#B5ACA3] hover:text-[#1C1815] dark:hover:text-[#F5F2EC] underline underline-offset-2 cursor-pointer"
                  >
                    Clear Bag
                  </button>
                </div>

                <ul className="divide-y divide-[#E5E1DA] dark:divide-[#342D28] bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-xl px-4">
                  {items.map((item) => (
                    <li key={item.cartKey} className="py-3.5 flex gap-3.5 items-start">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F3F1ED] dark:bg-[#26211D] shrink-0">
                        <ResilientImage
                          src={item.image}
                          alt={item.name}
                          fallbackTitle={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC] leading-snug">
                              {item.name}
                            </p>
                            <p className="text-xs text-[#5C554E] dark:text-[#B5ACA3] mt-0.5">
                              {item.variantLabel} · Rs. {item.unitPricePkr.toLocaleString()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartKey)}
                            className="p-1.5 text-[#5C554E] dark:text-[#B5ACA3] hover:text-red-700 dark:hover:text-red-400 transition-colors cursor-pointer"
                            aria-label={`Remove ${item.name} from bag`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>

                        {item.note && (
                          <p className="text-xs text-[#1B4332] dark:text-[#74C69D] mt-1">
                            Note: {item.note}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2.5">
                          <div className="inline-flex items-center border border-[#E5E1DA] dark:border-[#342D28] rounded-md bg-[#FAF9F7] dark:bg-[#26211D]">
                            <button
                              type="button"
                              onClick={() => onUpdateCartKeyQuantity(item.cartKey, -1)}
                              className="p-1.5 text-[#1C1815] dark:text-[#F5F2EC] hover:bg-[#F3F1ED] dark:hover:bg-[#342D28] cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                              aria-label={`Decrease ${item.name} quantity`}
                            >
                              <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold text-[#1C1815] dark:text-[#F5F2EC] tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateCartKeyQuantity(item.cartKey, 1)}
                              className="p-1.5 text-[#1C1815] dark:text-[#F5F2EC] hover:bg-[#F3F1ED] dark:hover:bg-[#342D28] cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                              aria-label={`Increase ${item.name} quantity`}
                            >
                              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>

                          <span className="text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC] tabular-nums">
                            Rs. {(item.unitPricePkr * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <span className="block text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC]">
                  Fulfillment Method
                </span>
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#EFECE6] dark:bg-[#2A2420] rounded-lg">
                  <button
                    type="button"
                    onClick={() => onChangeOrderType('delivery')}
                    className={`py-2 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      orderType === 'delivery'
                        ? 'bg-white dark:bg-[#1D1916] text-[#1C1815] dark:text-[#F5F2EC] shadow-xs'
                        : 'text-[#5C554E] dark:text-[#B5ACA3] hover:text-[#1C1815] dark:hover:text-[#F5F2EC]'
                    }`}
                  >
                    Sialkot Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeOrderType('takeout')}
                    className={`py-2 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      orderType === 'takeout'
                        ? 'bg-white dark:bg-[#1D1916] text-[#1C1815] dark:text-[#F5F2EC] shadow-xs'
                        : 'text-[#5C554E] dark:text-[#B5ACA3] hover:text-[#1C1815] dark:hover:text-[#F5F2EC]'
                    }`}
                  >
                    Store Takeout
                  </button>
                </div>
                {orderType === 'delivery' && (
                  <p className="text-xs text-[#5C554E] dark:text-[#B5ACA3]">
                    Free Sialkot delivery on orders Rs. {BAKERY_INFO.freeDeliveryThresholdPkr.toLocaleString()} or above (Rs. {BAKERY_INFO.deliveryFeePkr} standard). Cash on Delivery.
                  </p>
                )}
                {orderType === 'takeout' && (
                  <p className="text-xs text-[#5C554E] dark:text-[#B5ACA3]">
                    Pickup from {BAKERY_INFO.address} · Open till 1:30 AM.
                  </p>
                )}

                <div
                  className={`rounded-xl border px-4 py-3.5 space-y-1.5 ${
                    deliveryEstimate.isOpen
                      ? 'bg-white dark:bg-[#1D1916] border-[#E5E1DA] dark:border-[#342D28]'
                      : 'bg-[#F3F1ED] dark:bg-[#26211D] border-[#DCD6CC] dark:border-[#4A3B28]'
                  }`}
                  aria-live="polite"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 font-semibold ${
                        deliveryEstimate.isOpen
                          ? 'text-[#1B4332] dark:text-[#74C69D]'
                          : 'text-[#8A4B08] dark:text-[#F3C669]'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{deliveryEstimate.statusLabel}</span>
                    </span>
                    <span className="text-[#5C554E] dark:text-[#B5ACA3] tabular-nums whitespace-nowrap">
                      {deliveryEstimate.currentTimeFormatted}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC] tabular-nums">
                    {deliveryEstimate.headline}
                  </p>
                  <p className="text-xs text-[#5C554E] dark:text-[#B5ACA3] leading-relaxed">
                    {deliveryEstimate.reasonNote}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#1C1815] dark:text-[#F5F2EC]">Customer Details</h3>
                <div className="space-y-2.5">
                  <div>
                    <label htmlFor="cust-name" className="block text-xs font-medium text-[#5C554E] dark:text-[#B5ACA3] mb-1">
                      Full Name *
                    </label>
                    <input
                      id="cust-name"
                      type="text"
                      value={customer.name}
                      onChange={(e) => {
                        setCustomer((c) => ({ ...c, name: e.target.value }));
                        setFormError('');
                      }}
                      placeholder="e.g. Bilal Ahmed"
                      className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-lg text-[#1C1815] dark:text-[#F5F2EC] placeholder:text-[#8C847B] dark:placeholder:text-[#8E857D] focus:outline-none focus:border-[#1B4332] dark:focus:border-[#52B788]"
                    />
                  </div>

                  <div>
                    <label htmlFor="cust-phone" className="block text-xs font-medium text-[#5C554E] dark:text-[#B5ACA3] mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      id="cust-phone"
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => {
                        setCustomer((c) => ({ ...c, phone: e.target.value }));
                        setFormError('');
                      }}
                      placeholder="e.g. 0300 1234567"
                      className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-lg text-[#1C1815] dark:text-[#F5F2EC] placeholder:text-[#8C847B] dark:placeholder:text-[#8E857D] focus:outline-none focus:border-[#1B4332] dark:focus:border-[#52B788]"
                    />
                  </div>

                  {orderType === 'delivery' && (
                    <div>
                      <label htmlFor="cust-address" className="block text-xs font-medium text-[#5C554E] dark:text-[#B5ACA3] mb-1">
                        Sialkot Delivery Address *
                      </label>
                      <input
                        id="cust-address"
                        type="text"
                        value={customer.address}
                        onChange={(e) => {
                          setCustomer((c) => ({ ...c, address: e.target.value }));
                          setFormError('');
                        }}
                        placeholder="House #, Street, Kotli Behram / Kashmir Road, Sialkot"
                        className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-lg text-[#1C1815] dark:text-[#F5F2EC] placeholder:text-[#8C847B] dark:placeholder:text-[#8E857D] focus:outline-none focus:border-[#1B4332] dark:focus:border-[#52B788]"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="cust-notes" className="block text-xs font-medium text-[#5C554E] dark:text-[#B5ACA3] mb-1">
                      Order Note (Optional)
                    </label>
                    <input
                      id="cust-notes"
                      type="text"
                      value={customer.instructions}
                      onChange={(e) =>
                        setCustomer((c) => ({ ...c, instructions: e.target.value }))
                      }
                      placeholder="Preferred pickup time, cake candles, or landmark"
                      className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-[#1D1916] border border-[#E5E1DA] dark:border-[#342D28] rounded-lg text-[#1C1815] dark:text-[#F5F2EC] placeholder:text-[#8C847B] dark:placeholder:text-[#8E857D] focus:outline-none focus:border-[#1B4332] dark:focus:border-[#52B788]"
                    />
                  </div>
                </div>
              </div>

              {formError && (
                <p role="alert" className="text-xs font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-lg px-3.5 py-2.5">
                  {formError}
                </p>
              )}

              {orderPrepared && (
                <div className="bg-[#1B4332]/8 dark:bg-[#1B4332]/25 border border-[#1B4332]/25 dark:border-[#52B788]/40 rounded-lg p-3.5 text-xs text-[#1C1815] dark:text-[#F5F2EC] space-y-1">
                  <p className="font-semibold text-[#1B4332] dark:text-[#74C69D]">
                    WhatsApp Order Ready — {BAKERY_INFO.phoneDisplay}
                  </p>
                  <p className="text-[#5C554E] dark:text-[#B5ACA3]">
                    Your itemized order opened in WhatsApp. Confirm directly with our Kashmir Road counter team.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-[#1D1916] border-t border-[#E5E1DA] dark:border-[#342D28] space-y-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-[#5C554E] dark:text-[#B5ACA3]">
                <span>Subtotal</span>
                <span className="tabular-nums">Rs. {subtotalPkr.toLocaleString()}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between text-[#5C554E] dark:text-[#B5ACA3]">
                  <span>Delivery (Sialkot)</span>
                  <span className="tabular-nums">
                    {deliveryFeePkr === 0 ? 'Free' : `Rs. ${deliveryFeePkr}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-[#1C1815] dark:text-[#F5F2EC] pt-1.5 border-t border-[#F0EDE7] dark:border-[#2E2823]">
                <span>Total (Cash on {orderType === 'delivery' ? 'Delivery' : 'Pickup'})</span>
                <span className="tabular-nums">Rs. {grandTotalPkr.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-[#1B4332] dark:text-[#74C69D] pt-0.5">
                <span>Loyalty Rewards earned</span>
                <span className="font-semibold tabular-nums">
                  +{calculateOrderPoints(grandTotalPkr)} pts
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#143325] text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Send Order on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FAF9F7] dark:bg-[#26211D] hover:bg-[#F3F1ED] dark:hover:bg-[#342D28] text-[#1C1815] dark:text-[#F5F2EC] border border-[#E5E1DA] dark:border-[#342D28] text-xs font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1B4332] dark:text-[#74C69D]" aria-hidden="true" />
                    <span>Order Summary Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy Formatted Order Text</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
