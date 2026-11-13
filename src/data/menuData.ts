import chocolateCakeImg from '../assets/images/product_chocolate_cake_1794557544027.jpg';
import pineappleCakeImg from '../assets/images/product_pineapple_cake_1794567026810.jpg';
import creamPastriesImg from '../assets/images/product_cream_pastries_1794557544972.jpg';
import chocolatePastryImg from '../assets/images/product_chocolate_pastry_1794567027876.jpg';
import cakeRuskImg from '../assets/images/product_cake_rusk_1794557545116.jpg';
import almondRuskImg from '../assets/images/product_almond_rusk_1794567027590.jpg';
import halwaPuriImg from '../assets/images/product_halwa_puri_1794557545558.jpg';
import chickenSamosaImg from '../assets/images/product_chicken_samosa_1794557545994.jpg';
import chickenPizzaImg from '../assets/images/product_chicken_pizza_1794557546101.jpg';
import fajitaPizzaImg from '../assets/images/product_fajita_pizza_1794567027328.jpg';
import traditionalSweetsImg from '../assets/images/product_traditional_sweets_1794557547576.jpg';
import barfiJamunImg from '../assets/images/product_barfi_jamun_1794567029380.jpg';
import heroBakerySpreadImg from '../assets/images/hero_bakery_counter_men_1794576396280.jpg';

import { MenuCategory, MenuItem } from '../types/bakery';

export const BAKERY_INFO = {
  name: 'Hot Cake Bakers',
  urduName: 'ہاٹ کیک بیکرز، لاڑی اڈا',
  address: 'Lari Ada, Kashmir Road, Kotli Behram, Sialkot, 51310',
  phoneDisplay: '+92 341 9347002',
  whatsappDigits: '923419347002',
  secondaryPhoneDisplay: '+92 320 0172727',
  secondaryPhoneDigits: '923200172727',
  hoursDisplay: '7:00 AM – 1:30 AM Daily',
  shortHours: 'Open till 1:30 AM',
  services: 'Takeout & Delivery',
  deliveryFeePkr: 150,
  freeDeliveryThresholdPkr: 2000,
  heroImage: heroBakerySpreadImg,
  secondaryShowcaseImage: heroBakerySpreadImg,
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Hot+Cake+Bakers+Lari+Ada+Kashmir+Road+Kotli+Behram+Sialkot+51310',
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
    id: 'slide-counter',
    title: 'Fresh Bakery Counter & Daily Batches',
    urduTitle: 'تازہ کیک، پیٹیز اور مٹھائی',
    kicker: 'Kashmir Road · Takeout & Sialkot Delivery',
    category: 'All',
    image: heroBakerySpreadImg,
    alt: 'Hot Cake Bakers display counter stocked with fresh celebration cakes, puff patties, and mithai trays',
  },
  {
    id: 'slide-cakes',
    title: 'Pineapple & Chocolate Celebration Cakes',
    urduTitle: 'فریش کریم اور چاکلیٹ کیک',
    kicker: 'Cakes · Ready & Custom Orders',
    category: 'Cakes',
    image: pineappleCakeImg,
    alt: 'Freshly frosted pineapple cream cake topped with pineapple rings, cherries, and toasted almonds',
  },
  {
    id: 'slide-cake-rusk',
    title: 'Almond & Cardamom Tea Rusk',
    urduTitle: 'بادام الائچی کیک رسک',
    kicker: 'Cake Rusk · Tea-Time Favorite',
    category: 'Cake Rusk',
    image: almondRuskImg,
    alt: 'Crisp baked almond and green cardamom cake rusk slices arranged on a ceramic tray',
  },
  {
    id: 'slide-halwa-puri',
    title: 'Sialkoti Halwa Puri Breakfast',
    urduTitle: 'حلوہ پوری ناشتہ',
    kicker: 'Breakfast · Served Hot Every Morning',
    category: 'Breakfast & Savories',
    image: halwaPuriImg,
    alt: 'Traditional Sialkoti Halwa Puri breakfast platter with saffron halwa and chana',
  },
  {
    id: 'slide-chicken-pizza',
    title: 'Oven-Baked Chicken Fajita Pizza',
    urduTitle: 'چکن فجیتا اور تکہ پیزا',
    kicker: 'Chicken Pizza · Baked Fresh to Order',
    category: 'Chicken Pizza',
    image: fajitaPizzaImg,
    alt: 'Freshly baked chicken fajita pizza with melted mozzarella and bell peppers',
  },
  {
    id: 'slide-traditional-sweets',
    title: 'Pure Khoya Barfi & Gulab Jamun',
    urduTitle: 'پستہ برفی اور گلاب جامن',
    kicker: 'Traditional Sweets · Fresh Daily Tray',
    category: 'Traditional Sweets',
    image: barfiJamunImg,
    alt: 'Warm syrup-soaked gulab jamun and pistachio khoya barfi on a serving platter',
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
    image: pineappleCakeImg,
    imageAlt: 'Whole round pineapple fresh cream cake topped with cherries and toasted almond flakes',
    supportsCakeNote: true,
    variants: [
      { id: '1lb', label: '1 lb', pricePkr: 1350 },
      { id: '2lb', label: '2 lbs', pricePkr: 2600 },
      { id: '3lb', label: '3 lbs', pricePkr: 3800 },
    ],
  },
  {
    id: 'assorted-bakery-pastries',
    name: 'Pineapple & Cream Pastries',
    urduName: 'فریش پیسٹریز',
    category: 'Pastries',
    availabilityNote: 'Freshly Sliced Daily',
    description:
      'Bakery-counter favorites pairing classic chilled pineapple cream slices with whipped dairy frosting.',
    image: creamPastriesImg,
    imageAlt: 'Assorted pineapple fresh cream and truffle pastry slices on a stone plate',
    variants: [
      { id: '2pcs', label: '2 Pcs', pricePkr: 420 },
      { id: '6pcs', label: 'Box of 6', pricePkr: 1200 },
    ],
  },
  {
    id: 'double-chocolate-fudge-pastry-box',
    name: 'Dark Chocolate Pastry Box',
    urduName: 'چاکلیٹ پیسٹری باکس',
    category: 'Pastries',
    availabilityNote: 'Rich Ganache · Chilled',
    description:
      'Individual cocoa sponge slices layered with silky chocolate fudge and topped with dark chocolate curls.',
    image: chocolatePastryImg,
    imageAlt: 'Four rectangular dark chocolate fudge pastry slices topped with chocolate curls in a box',
    variants: [
      { id: '2pcs', label: '2 Pcs', pricePkr: 460 },
      { id: '6pcs', label: 'Box of 6', pricePkr: 1320 },
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
      { id: 'one-kg', label: '1 Kg Pack', pricePkr: 1320 },
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
    image: almondRuskImg,
    imageAlt: 'Crisp almond and green cardamom cake rusk slices arranged on a ceramic tray',
    variants: [
      { id: 'half-kg', label: '500g Box', pricePkr: 740 },
      { id: 'one-kg', label: '1 Kg Pack', pricePkr: 1450 },
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
      { id: 'single', label: 'Single (3)', pricePkr: 450 },
      { id: 'family', label: 'Family (8)', pricePkr: 1150 },
    ],
  },
  {
    id: 'crispy-chicken-samosa-patties',
    name: 'Crispy Chicken Samosa & Patties',
    urduName: 'چکن سموسہ اور پیٹیز',
    category: 'Breakfast & Savories',
    availabilityNote: 'Hot Counter · Mint Raita',
    description:
      'Spiced shredded chicken folded inside blistered golden samosa pastry and flaky puff patties with fresh mint raita.',
    image: chickenSamosaImg,
    imageAlt: 'Crispy golden chicken samosas and flaky puff patties with green mint raita',
    variants: [
      { id: '4pcs', label: '4 Pcs', pricePkr: 440 },
      { id: '8pcs', label: '8 Pcs', pricePkr: 840 },
      { id: '12pcs', label: '12 Pcs Box', pricePkr: 1220 },
    ],
  },
  {
    id: 'chicken-tikka-bakery-pizza',
    name: 'Chicken Tikka Bakery Pizza',
    urduName: 'چکن تکہ پیزا',
    category: 'Chicken Pizza',
    availabilityNote: 'Baked to Order · Oven Hot',
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
    name: 'Chicken Fajita Cheese Pizza',
    urduName: 'چکن فجیتا پیزا',
    category: 'Chicken Pizza',
    availabilityNote: 'Baked to Order · Extra Cheese',
    description:
      'Herb-marinated fajita chicken over seasoned tomato sauce, double mozzarella, sweet corn, olives, and bell peppers.',
    image: fajitaPizzaImg,
    imageAlt: 'Freshly baked chicken fajita pan pizza sliced inside a kraft box',
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
    availabilityNote: 'Pure Khoya · Pistachio & Varq',
    description:
      'Curated selection of pistachio barfi, warm saffron gulab jamun, and cardamom besan laddu crafted for gatherings.',
    image: traditionalSweetsImg,
    imageAlt: 'Assorted traditional Pakistani mithai including pistachio barfi, gulab jamun, and laddu',
    variants: [
      { id: 'half-kg', label: '500g Box', pricePkr: 950 },
      { id: 'one-kg', label: '1 Kg Box', pricePkr: 1850 },
      { id: 'two-kg', label: '2 Kg Box', pricePkr: 3600 },
    ],
  },
  {
    id: 'warm-gulab-jamun-pistachio-barfi',
    name: 'Pistachio Barfi & Gulab Jamun',
    urduName: 'پستہ برفی اور گلاب جامن',
    category: 'Traditional Sweets',
    availabilityNote: 'Daily Fresh Batch',
    description:
      'Rich milk-solid barfi studded with roasted green pistachios alongside warm syrup-soaked gulab jamun.',
    image: barfiJamunImg,
    imageAlt: 'Glossy brown gulab jamun and green pistachio khoya barfi on a serving platter',
    variants: [
      { id: 'half-kg', label: '500g Box', pricePkr: 920 },
      { id: 'one-kg', label: '1 Kg Box', pricePkr: 1800 },
    ],
  },
];
