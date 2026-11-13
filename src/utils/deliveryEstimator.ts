import { CartItem, OrderType } from '../types/bakery';

export interface DeliveryEstimate {
  isOpen: boolean;
  isClosingSoon: boolean;
  statusLabel: string;
  headline: string;
  windowRange: string;
  durationText: string;
  reasonNote: string;
  currentTimeFormatted: string;
}

const OPEN_MINUTES = 7 * 60; // 7:00 AM
const CLOSE_MINUTES_AFTER_MIDNIGHT = 1 * 60 + 30; // 1:30 AM

function formatTime12h(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function isBakeryOpenAt(date: Date): boolean {
  const mins = date.getHours() * 60 + date.getMinutes();
  return mins >= OPEN_MINUTES || mins < CLOSE_MINUTES_AFTER_MIDNIGHT;
}

export function calculateDeliveryEstimate(
  now: Date,
  orderType: OrderType,
  items: CartItem[]
): DeliveryEstimate {
  const mins = now.getHours() * 60 + now.getMinutes();
  const isOpen = isBakeryOpenAt(now);
  const isClosingSoon = isOpen && mins >= 55 && mins < CLOSE_MINUTES_AFTER_MIDNIGHT;

  const hasOvenPizza = items.some((i) => i.category === 'Chicken Pizza');
  const hasLargeCelebration = items.some(
    (i) => i.variantId === '3lb' || i.variantId === 'two-kg'
  );
  const hasHalwaPuri = items.some((i) => i.itemId.includes('halwa-puri'));

  let prepExtra = 0;
  if (hasOvenPizza) prepExtra += 10;
  if (hasLargeCelebration) prepExtra += 5;

  const isEveningRush = mins >= 20 * 60 && mins < 23 * 60 + 30;
  const isMorningBreakfast = mins >= 7 * 60 && mins < 11 * 60;
  const rushExtra = isEveningRush ? 10 : isMorningBreakfast && hasHalwaPuri ? 5 : 0;

  let minLead =
    orderType === 'delivery'
      ? 30 + prepExtra + (isOpen ? rushExtra : 0)
      : 15 + Math.ceil(prepExtra / 2) + (isOpen ? Math.ceil(rushExtra / 2) : 0);

  if (orderType === 'delivery' && minLead > 60) {
    minLead = 60;
  }
  const maxLead = minLead + (orderType === 'delivery' ? 15 : 10);

  const notes: string[] = [];
  if (hasOvenPizza) {
    notes.push('fresh oven bake');
  } else if (hasLargeCelebration) {
    notes.push('custom cake packing');
  }
  if (isOpen && isEveningRush) {
    notes.push('Kashmir Rd evening rush');
  } else if (isOpen && isMorningBreakfast && hasHalwaPuri) {
    notes.push('morning puri fry');
  }

  const currentTimeFormatted = formatTime12h(now);

  if (isOpen) {
    const start = new Date(now.getTime() + minLead * 60_000);
    const end = new Date(now.getTime() + maxLead * 60_000);
    const windowRange = `${formatTime12h(start)} – ${formatTime12h(end)}`;
    const durationText = `${minLead}–${maxLead} mins`;

    const statusLabel = isClosingSoon
      ? 'Closing Soon · Open till 1:30 AM'
      : 'Open Now · Active till 1:30 AM';

    const headline =
      orderType === 'delivery'
        ? `Est. Arrival: ${windowRange}`
        : `Ready for Pickup: ${windowRange}`;

    const reasonNote =
      notes.length > 0
        ? `Includes ${notes.join(' & ')} (${durationText}).`
        : orderType === 'delivery'
        ? `Standard Kotli Behram & Sialkot dispatch (${durationText}).`
        : `Prepared fresh at Kashmir Road counter (${durationText}).`;

    return {
      isOpen: true,
      isClosingSoon,
      statusLabel,
      headline,
      windowRange,
      durationText,
      reasonNote,
      currentTimeFormatted,
    };
  }

  // Closed overnight (1:30 AM – 6:59 AM): next opening is 7:00 AM same calendar morning
  const nextOpen = new Date(now);
  nextOpen.setHours(7, 0, 0, 0);

  const start = new Date(nextOpen.getTime() + minLead * 60_000);
  const end = new Date(nextOpen.getTime() + maxLead * 60_000);
  const windowRange = `${formatTime12h(start)} – ${formatTime12h(end)}`;

  return {
    isOpen: false,
    isClosingSoon: false,
    statusLabel: 'Closed Overnight · Opens 7:00 AM',
    headline:
      orderType === 'delivery'
        ? `Next Delivery: ${windowRange}`
        : `Next Pickup: ${windowRange}`,
    windowRange,
    durationText: 'Opens 7:00 AM',
    reasonNote:
      'Active hours are 7:00 AM – 1:30 AM daily. Send via WhatsApp now to schedule for morning opening.',
    currentTimeFormatted,
  };
}
