import chocolateCakeImg from '../assets/images/product_chocolate_cake_1794557544027.jpg';
import creamPastriesImg from '../assets/images/product_cream_pastries_1794557544972.jpg';
import cakeRuskImg from '../assets/images/product_cake_rusk_1794557545116.jpg';
import halwaPuriImg from '../assets/images/product_halwa_puri_1794557545558.jpg';
import chickenSamosaImg from '../assets/images/product_chicken_samosa_1794557545994.jpg';
import chickenPizzaImg from '../assets/images/product_chicken_pizza_1794557546101.jpg';
import traditionalSweetsImg from '../assets/images/product_traditional_sweets_1794557547576.jpg';

import { CustomerReview, MenuCategory, MenuItem } from '../types/bakery';

export const BAKERY_INFO = {
  name: 'Hot Cake Bakers',
  urduName: 'ہاٹ کیک بیکرز، لاڑی اڈا',
  address: 'Kashmir Road, Kotli Behram, Sialkot, 51310',
  phoneDisplay: '+92 341 9347002',
  whatsappDigits: '923419347002',
  hoursDisplay: '7:00 AM – 1:30 AM Daily',
  shortHours: 'Open till 1:30 AM',
  services: 'Takeout & Delivery',
  deliveryFeePkr: 150,
  freeDeliveryThresholdPkr: 2000,
  heroImage: chocolateCakeImg,
  secondaryShowcaseImage: halwaPuriImg,
} as const;

export interface HeroSlide {
  id: string;
  title: string;
  urduTitle: string;
  kicker: string;
  category: MenuCategory;
  image: string;
  alt: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-cakes',
    title: 'Belgian Chocolate Fudge Cake',
    urduTitle: 'چاکلیٹ فج کیک',
    kicker: 'Cakes · Custom & Ready Daily',
    category: 'Cakes',
    image: chocolateCakeImg,
    alt: 'Belgian Chocolate Fudge Cake with dark ganache and toasted almonds',
  },
  {
    id: 'slide-pastries',
    title: 'Fresh Cream & Truffle Pastries',
    urduTitle: 'فریش پیسٹریز',
    kicker: 'Pastries · Sliced Fresh Till 1:30 AM',
    category: 'Pastries',
    image: creamPastriesImg,
    alt: 'Assorted pineapple fresh cream and chocolate truffle pastries',
  },
  {
    id: 'slide-cake-rusk',
    title: 'Special Golden Cake Rusk',
    urduTitle: 'اسپیشل کیک رسک',
    kicker: 'Cake Rusk · Tea-Time Favorite',
    category: 'Cake Rusk',
    image: cakeRuskImg,
    alt: 'Crisp golden baked butter cake rusk served with hot chai',
  },
  {
    id: 'slide-halwa-puri',
    title: 'Sialkoti Halwa Puri Platter',
    urduTitle: 'حلوہ پوری ناشتہ',
    kicker: 'Breakfast · Served Hot Every Morning',
    category: 'Breakfast & Savories',
    image: halwaPuriImg,
    alt: 'Traditional Sialkoti Halwa Puri breakfast platter with saffron halwa and chana',
  },
  {
    id: 'slide-chicken-samosa',
    title: 'Crispy Chicken Samosa & Patties',
    urduTitle: 'چکن سموسہ اور پیٹیز',
    kicker: 'Savories · Hot Counter with Mint Raita',
    category: 'Breakfast & Savories',
    image: chickenSamosaImg,
    alt: 'Golden crispy chicken samosas and puff patties with fresh mint raita',
  },
  {
    id: 'slide-chicken-pizza',
    title: 'Chicken Tikka Bakery Pizza',
    urduTitle: 'چکن تکہ پیزا',
    kicker: 'Chicken Pizza · Baked Fresh Till 1:30 AM',
    category: 'Chicken Pizza',
    image: chickenPizzaImg,
    alt: 'Freshly baked chicken tikka pizza with mozzarella and crisp vegetables',
  },
  {
    id: 'slide-traditional-sweets',
    title: 'Pure Khoya & Pistachio Mithai',
    urduTitle: 'تازہ مٹھائی',
    kicker: 'Traditional Sweets · Barfi, Gulab Jamun & Laddu',
    category: 'Traditional Sweets',
    image: traditionalSweetsImg,
    alt: 'Assorted pistachio barfi, saffron gulab jamun, and cardamom laddu',
  },
];

export const MENU_CATEGORIES: MenuCategory[] = [
  'All',
  'Cakes',
  'Pastries',
  'Cake Rusk',
  'Breakfast & Savories',
  'Chicken Pizza',
  'Traditional Sweets',
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'belgian-chocolate-fudge-cake',
    name: 'Belgian Chocolate Fudge Cake',
    urduName: 'چاکلیٹ فج کیک',
    category: 'Cakes',
    availabilityNote: 'Bestseller · Ready & Custom',
    description:
      'Moist dark cocoa sponge layered with rich chocolate ganache and finished with roasted almond slivers.',
    image: chocolateCakeImg,
    imageAlt: 'Belgian Chocolate Fudge Cake topped with dark ganache and almonds',
    supportsCakeNote: true,
    variants: [
      { id: '1lb', label: '1 lb', pricePkr: 1450 },
      { id: '2lb', label: '2 lbs', pricePkr: 2800 },
      { id: '3lb', label: '3 lbs', pricePkr: 4100 },
    ],
  },
  {
    id: 'pineapple-fresh-cream-cake',
    name: 'Pineapple Fresh Cream Cake',
    urduName: 'پائن ایپل کریم کیک',
    category: 'Cakes',
    availabilityNote: 'Fresh Daily · Chilled',
    description:
      'Light vanilla sponge soaked in pineapple nectar with whipped dairy cream and diced pineapple chunks.',
    image: creamPastriesImg,
    imageAlt: 'Fresh pineapple cream sponge layers and chocolate pastry slices',
    supportsCakeNote: true,
    variants: [
      { id: '1lb', label: '1 lb', pricePkr: 1350 },
      { id: '2lb', label: '2 lbs', pricePkr: 2600 },
      { id: '3lb', label: '3 lbs', pricePkr: 3800 },
    ],
  },
  {
    id: 'assorted-bakery-pastries',
    name: 'Pineapple & Chocolate Truffle Pastries',
    urduName: 'فریش پیسٹریز',
    category: 'Pastries',
    availabilityNote: 'Freshly Sliced · Till 1:30 AM',
    description:
      'Bakery-counter favorites pairing classic chilled pineapple cream slices with rich double-chocolate truffle squares.',
    image: creamPastriesImg,
    imageAlt: 'Assorted pineapple cream and chocolate truffle pastries on a stone plate',
    variants: [
      { id: '2pcs', label: '2 Pcs', pricePkr: 420 },
      { id: '6pcs', label: 'Box of 6', pricePkr: 1200 },
    ],
  },
  {
    id: 'special-butter-cake-rusk',
    name: 'Special Golden Cake Rusk',
    urduName: 'اسپیشل کیک رسک',
    category: 'Cake Rusk',
    availabilityNote: 'Crisp Batch · Tea-Time Staple',
    description:
      'Twice-baked golden butter cake rusks with a tender crunch and subtle cardamom warmth, packed fresh daily.',
    image: cakeRuskImg,
    imageAlt: 'Golden baked Pakistani cake rusk stacked beside a warm cup of chai',
    variants: [
      { id: 'half-kg', label: '500g Box', pricePkr: 680 },
      { id: 'one-kg', label: '1 Kg Family Pack', pricePkr: 1320 },
    ],
  },
  {
    id: 'halwa-puri-breakfast-platter',
    name: 'Sialkoti Halwa Puri Platter',
    urduName: 'حلوہ پوری ناشتہ',
    category: 'Breakfast & Savories',
    availabilityNote: 'Morning Specialty · Served Hot',
    description:
      'Fluffy golden puris served with saffron suji halwa, slow-simmered Lahori chana, tangy aloo bhujia, and achaar.',
    image: halwaPuriImg,
    imageAlt: 'Traditional Pakistani Halwa Puri breakfast platter with chana and aloo curry',
    variants: [
      { id: 'single', label: 'Single (3 Puris)', pricePkr: 450 },
      { id: 'family', label: 'Family (8 Puris)', pricePkr: 1150 },
    ],
  },
  {
    id: 'crispy-chicken-samosa-patties',
    name: 'Crispy Chicken Samosa & Patties',
    urduName: 'چکن سموسہ اور پیٹیز',
    category: 'Breakfast & Savories',
    availabilityNote: 'Hot Counter · Mint Raita Included',
    description:
      'Spiced shredded chicken folded inside blistered golden samosa pastry and flaky puff patties with fresh mint raita.',
    image: chickenSamosaImg,
    imageAlt: 'Crispy golden chicken samosas and flaky puff patties with green mint raita',
    variants: [
      { id: '4pcs', label: '4 Pcs Mix', pricePkr: 440 },
      { id: '8pcs', label: '8 Pcs Box', pricePkr: 840 },
      { id: '12pcs', label: '12 Pcs Party Box', pricePkr: 1220 },
    ],
  },
  {
    id: 'chicken-tikka-bakery-pizza',
    name: 'Chicken Tikka Bakery Pizza',
    urduName: 'چکن تکہ پیزا',
    category: 'Chicken Pizza',
    availabilityNote: 'Baked to Order · Late Night',
    description:
      'Hand-stretched pan crust topped with smoky chicken tikka cubes, mozzarella blend, crisp bell peppers, and red onion.',
    image: chickenPizzaImg,
    imageAlt: 'Freshly baked chicken tikka pizza with melted mozzarella and peppers',
    variants: [
      { id: 'small', label: 'Small (8")', pricePkr: 750 },
      { id: 'medium', label: 'Medium (10")', pricePkr: 1250 },
      { id: 'large', label: 'Large (13")', pricePkr: 1750 },
    ],
  },
  {
    id: 'chicken-fajita-cheese-pizza',
    name: 'Chicken Fajita & Extra Cheese Pizza',
    urduName: 'چکن فجیتا پیزا',
    category: 'Chicken Pizza',
    availabilityNote: 'Baked to Order · Till 1:30 AM',
    description:
      'Herb-marinated fajita chicken over seasoned tomato sauce, double mozzarella, oregano, and sweet onion rings.',
    image: chickenPizzaImg,
    imageAlt: 'Hot Chicken Fajita Pizza fresh from the bakery oven',
    variants: [
      { id: 'small', label: 'Small (8")', pricePkr: 790 },
      { id: 'medium', label: 'Medium (10")', pricePkr: 1300 },
      { id: 'large', label: 'Large (13")', pricePkr: 1850 },
    ],
  },
  {
    id: 'assorted-mithai-gift-box',
    name: 'Assorted Traditional Mithai Box',
    urduName: 'مکس مٹھائی ڈبہ',
    category: 'Traditional Sweets',
    availabilityNote: 'Pure Khoya · Pistachio & Silver Varq',
    description:
      'Curated selection of pistachio barfi, warm saffron gulab jamun, and cardamom besan laddu crafted for gatherings.',
    image: traditionalSweetsImg,
    imageAlt: 'Assorted traditional Pakistani mithai including pistachio barfi, gulab jamun, and laddu',
    variants: [
      { id: 'half-kg', label: '500g Box', pricePkr: 950 },
      { id: 'one-kg', label: '1 Kg Gift Box', pricePkr: 1850 },
      { id: 'two-kg', label: '2 Kg Celebration Box', pricePkr: 3600 },
    ],
  },
  {
    id: 'warm-gulab-jamun-pistachio-barfi',
    name: 'Special Pistachio Barfi & Gulab Jamun',
    urduName: 'پستہ برفی اور گلاب جامن',
    category: 'Traditional Sweets',
    availabilityNote: 'Daily Fresh Batch',
    description:
      'Rich milk-solid barfi studded with roasted green pistachios alongside syrup-soaked gulab jamun.',
    image: traditionalSweetsImg,
    imageAlt: 'Pistachio barfi and syrup-soaked gulab jamun on ceramic tray',
    variants: [
      { id: 'half-kg', label: '500g Box', pricePkr: 920 },
      { id: 'one-kg', label: '1 Kg Box', pricePkr: 1800 },
    ],
  },
  {
    id: 'almond-cardamom-cake-rusk',
    name: 'Almond & Cardamom Tea Rusk',
    urduName: 'بادام الائچی کیک رسک',
    category: 'Cake Rusk',
    availabilityNote: 'Small-Batch Crisp',
    description:
      'Fragrant green cardamom and toasted almond slivers baked into crisp tea-time slices for morning and evening chai.',
    image: cakeRuskImg,
    imageAlt: 'Crisp almond cardamom cake rusk slices with hot chai',
    variants: [
      { id: 'half-kg', label: '500g Box', pricePkr: 740 },
      { id: 'one-kg', label: '1 Kg Box', pricePkr: 1450 },
    ],
  },
  {
    id: 'double-chocolate-fudge-pastry-box',
    name: 'Dark Chocolate Pastry Slice Box',
    urduName: 'چاکلیٹ پیسٹری باکس',
    category: 'Pastries',
    availabilityNote: 'Rich Ganache · Chilled',
    description:
      'Individual cocoa sponge slices layered with silky chocolate fudge and topped with dark chocolate curls.',
    image: chocolateCakeImg,
    imageAlt: 'Rich dark chocolate fudge cake slice with ganache',
    variants: [
      { id: '2pcs', label: '2 Pcs', pricePkr: 460 },
      { id: '6pcs', label: 'Box of 6', pricePkr: 1320 },
    ],
  },
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Usman Tariq',
    area: 'Kotli Behram, Sialkot',
    favoriteItem: 'Belgian Chocolate Fudge Cake & Cake Rusk',
    quote:
      'Our go-to bakery on Kashmir Road for family birthdays. Even at midnight, the cakes are moist and the cake rusk stays crisp all week.',
  },
  {
    id: 'rev-2',
    author: 'Sana Waqas',
    area: 'Model Town, Sialkot',
    favoriteItem: 'Halwa Puri Platter & Chicken Samosa',
    quote:
      'Sunday morning Halwa Puri from Hot Cake Bakers is unbeatable—hot puris, rich halwa, and their chicken samosas arrive fresh on WhatsApp orders.',
  },
  {
    id: 'rev-3',
    author: 'Hamza Butt',
    area: 'Kashmir Road, Sialkot',
    favoriteItem: 'Chicken Tikka Pizza & Mithai',
    quote:
      'Open till 1:30 AM makes it a lifesaver when guests drop by late. Ordered chicken pizza and pistachio barfi via WhatsApp and picked it up in 20 minutes.',
  },
];
