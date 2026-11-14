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
  badge?: 'Top Seller' | 'Customer Favorite';
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

export interface RecentOrder {
  id: string;
  createdAtIso: string;
  orderType: OrderType;
  items: CartItem[];
  totalPkr: number;
  customerName: string;
}

export type OrderStatusStage = 'received' | 'preparing' | 'ready';

export interface TrackedOrder {
  id: string;
  orderNumber: string;
  createdAtMs: number;
  orderType: OrderType;
  itemCount: number;
  totalPkr: number;
  customerName: string;
  stage: OrderStatusStage;
}
