export type MenuCategory =
  | 'All'
  | 'Cakes'
  | 'Pastries'
  | 'Cake Rusk'
  | 'Breakfast & Savories'
  | 'Chicken Pizza'
  | 'Traditional Sweets';

export interface MenuVariant {
  id: string;
  label: string;
  pricePkr: number;
}

export interface MenuItem {
  id: string;
  name: string;
  urduName: string;
  category: Exclude<MenuCategory, 'All'>;
  availabilityNote: string;
  description: string;
  image: string;
  imageAlt: string;
  variants: MenuVariant[];
  supportsCakeNote?: boolean;
}

export interface CartItem {
  cartKey: string;
  itemId: string;
  name: string;
  urduName: string;
  category: Exclude<MenuCategory, 'All'>;
  variantId: string;
  variantLabel: string;
  unitPricePkr: number;
  quantity: number;
  image: string;
  note?: string;
}

export type OrderType = 'delivery' | 'takeout';

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  instructions: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  area: string;
  favoriteItem: string;
  quote: string;
}

export interface RecentOrder {
  id: string;
  createdAtIso: string;
  orderType: OrderType;
  items: CartItem[];
  totalPkr: number;
  customerName: string;
}

export interface LoyaltyTransaction {
  id: string;
  dateIso: string;
  orderTotalPkr: number;
  pointsEarned: number;
  summary: string;
}

export interface LoyaltyState {
  points: number;
  lifetimeSpentPkr: number;
  ordersCount: number;
  history: LoyaltyTransaction[];
}
