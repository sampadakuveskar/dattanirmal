import hero from "@/assets/hero-mangoes.jpg";
import farm from "@/assets/farm-harvest.jpg";
import kokani from "@/assets/kokani-products.jpg";

export type Product = {
  slug: string;
  name: string;
  category: string;
  type: "mango" | "kokani";
  shortDescription: string;
  description: string;
  weight: string;
  variants: { label: string; price: number }[];
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  seasonal?: boolean;
};

export const images = { hero, farm, kokani };

export const categories = [
  { slug: "devgad-mangoes", name: "Devgad Mangoes", blurb: "Naturally ripened Alphonso, boxed to order." },
  { slug: "kokum", name: "Kokum Products", blurb: "Syrup, agal and sol kadhi essentials." },
  { slug: "pickles", name: "Pickles", blurb: "Slow-made mango and mixed pickles." },
  { slug: "masalas", name: "Masalas", blurb: "Kokani spice blends from family recipes." },
  { slug: "dry-fruits", name: "Dry Fruits", blurb: "Konkan cashews, whole and roasted." },
  { slug: "snacks", name: "Snacks", blurb: "Jackfruit chips, aam papad and more." },
  { slug: "coconut", name: "Coconut Products", blurb: "Cold-pressed oil and coconut staples." },
  { slug: "traditional", name: "Traditional Foods", blurb: "Pantry classics from Konkan kitchens." },
];

const p = (x: Product) => x;

export const products: Product[] = [
  p({
    slug: "devgad-alphonso-mango-dozen",
    name: "Devgad Alphonso Mango",
    category: "devgad-mangoes",
    type: "mango",
    shortDescription: "Hand-picked, naturally ripened Alphonso from Devgad orchards.",
    description:
      "Our signature Devgad Alphonso is harvested at the right maturity, ripened naturally in grass beds and packed the same week. Expect a deep saffron pulp, a fine aroma and a clean, honeyed sweetness.",
    weight: "1 dozen (approx. 2.4-2.7 kg)",
    variants: [
      { label: "6 pcs", price: 1150 },
      { label: "12 pcs", price: 2150 },
      { label: "24 pcs", price: 4100 },
    ],
    price: 2150,
    mrp: 2600,
    rating: 4.9,
    reviews: 212,
    stock: 24,
    image: hero,
    seasonal: true,
  }),
  p({
    slug: "premium-devgad-hapus",
    name: "Premium Devgad Hapus",
    category: "devgad-mangoes",
    type: "mango",
    shortDescription: "Larger grade fruit, selected for gifting and special occasions.",
    description:
      "A larger, uniformly graded selection of Devgad Hapus. Each fruit is checked by hand for blemishes before packing in a cushioned carton.",
    weight: "1 dozen (approx. 3 kg)",
    variants: [
      { label: "6 pcs", price: 1450 },
      { label: "12 pcs", price: 2750 },
    ],
    price: 2750,
    mrp: 3200,
    rating: 4.8,
    reviews: 148,
    stock: 12,
    image: hero,
    seasonal: true,
  }),
  p({
    slug: "alphonso-family-box",
    name: "Alphonso Mango Family Box",
    category: "devgad-mangoes",
    type: "mango",
    shortDescription: "A generous box sized for a household through the season.",
    description:
      "Two dozen mangoes of mixed sizes, ideal for families who finish a box quickly. Packed with ripening guidance inside.",
    weight: "2 dozen (approx. 5 kg)",
    variants: [{ label: "24 pcs", price: 3950 }],
    price: 3950,
    mrp: 4600,
    rating: 4.7,
    reviews: 96,
    stock: 8,
    image: hero,
    seasonal: true,
  }),
  p({
    slug: "alphonso-gift-box",
    name: "Alphonso Mango Gift Box",
    category: "devgad-mangoes",
    type: "mango",
    shortDescription: "Presentation box with a handwritten note option.",
    description:
      "A gifting box with a rigid outer carton, mango leaf motif sleeve and space for a personal note. Delivered directly to your recipient.",
    weight: "6 pcs (approx. 1.4 kg)",
    variants: [{ label: "6 pcs", price: 1650 }],
    price: 1650,
    mrp: 1950,
    rating: 4.9,
    reviews: 74,
    stock: 3,
    image: hero,
    seasonal: true,
  }),
  p({
    slug: "kokum-syrup",
    name: "Kokum Syrup",
    category: "kokum",
    type: "kokani",
    shortDescription: "Tangy summer cooler concentrate, made in small batches.",
    description: "Made from sun-dried kokum rinds and sugar, with no added colour. Dilute with chilled water and a pinch of salt.",
    weight: "750 ml",
    variants: [
      { label: "375 ml", price: 220 },
      { label: "750 ml", price: 390 },
    ],
    price: 390,
    mrp: 450,
    rating: 4.6,
    reviews: 58,
    stock: 40,
    image: kokani,
  }),
  p({
    slug: "kokum-agal",
    name: "Kokum Agal",
    category: "kokum",
    type: "kokani",
    shortDescription: "Traditional kokum extract used across Konkan kitchens.",
    description: "Unsweetened kokum extract used in curries, sol kadhi and everyday cooking. Keep refrigerated after opening.",
    weight: "500 ml",
    variants: [{ label: "500 ml", price: 260 }],
    price: 260,
    mrp: 300,
    rating: 4.5,
    reviews: 41,
    stock: 33,
    image: kokani,
  }),
  p({
    slug: "sol-kadhi-mix",
    name: "Sol Kadhi Mix",
    category: "kokum",
    type: "kokani",
    shortDescription: "Instant mix for the classic pink kokum-coconut drink.",
    description: "Blend of kokum, coconut and gentle spice. Just add water or coconut milk for a quick sol kadhi.",
    weight: "200 g",
    variants: [{ label: "200 g", price: 180 }],
    price: 180,
    mrp: 220,
    rating: 4.4,
    reviews: 37,
    stock: 5,
    image: kokani,
  }),
  p({
    slug: "devgad-cashews",
    name: "Devgad Cashews (W240)",
    category: "dry-fruits",
    type: "kokani",
    shortDescription: "Whole white cashews from Konkan coastal plantations.",
    description: "Hand-sorted W240 grade cashews, vacuum packed for freshness. Naturally creamy with a firm bite.",
    weight: "500 g",
    variants: [
      { label: "250 g", price: 480 },
      { label: "500 g", price: 890 },
      { label: "1 kg", price: 1720 },
    ],
    price: 890,
    mrp: 1050,
    rating: 4.8,
    reviews: 121,
    stock: 60,
    image: kokani,
  }),
  p({
    slug: "authentic-mango-pickle",
    name: "Authentic Mango Pickle",
    category: "pickles",
    type: "kokani",
    shortDescription: "Raw mango pickled the Kokani way, in groundnut oil.",
    description: "Raw mango pieces, hand-pounded spices and groundnut oil, matured before bottling. No preservatives added.",
    weight: "400 g",
    variants: [{ label: "400 g", price: 320 }],
    price: 320,
    mrp: 380,
    rating: 4.7,
    reviews: 88,
    stock: 27,
    image: kokani,
  }),
  p({
    slug: "kokani-masala",
    name: "Kokani Masala",
    category: "masalas",
    type: "kokani",
    shortDescription: "Family-recipe blend for coastal curries and fish.",
    description: "Roasted and stone-ground spice blend used across Kokani households for curries, usal and coastal seafood.",
    weight: "250 g",
    variants: [{ label: "250 g", price: 290 }],
    price: 290,
    mrp: 340,
    rating: 4.6,
    reviews: 52,
    stock: 0,
    image: kokani,
  }),
  p({
    slug: "aam-papad",
    name: "Alphonso Aam Papad",
    category: "snacks",
    type: "kokani",
    shortDescription: "Sun-dried Alphonso pulp sheets, no added colour.",
    description: "Layers of Alphonso pulp dried in the sun, sliced and packed. A seasonal favourite for children and travel.",
    weight: "300 g",
    variants: [{ label: "300 g", price: 250 }],
    price: 250,
    mrp: 300,
    rating: 4.5,
    reviews: 64,
    stock: 18,
    image: kokani,
  }),
  p({
    slug: "jackfruit-chips",
    name: "Jackfruit Chips",
    category: "snacks",
    type: "kokani",
    shortDescription: "Crisp raw jackfruit chips fried in coconut oil.",
    description: "Thin slices of raw jackfruit fried in coconut oil and lightly salted. Packed in nitrogen-flushed pouches.",
    weight: "200 g",
    variants: [{ label: "200 g", price: 190 }],
    price: 190,
    mrp: 230,
    rating: 4.4,
    reviews: 45,
    stock: 22,
    image: kokani,
  }),
  p({
    slug: "cold-pressed-coconut-oil",
    name: "Cold Pressed Coconut Oil",
    category: "coconut",
    type: "kokani",
    shortDescription: "Wood-pressed coconut oil for cooking and hair care.",
    description: "Cold-pressed from sun-dried Konkan copra. Unrefined, with a natural coconut aroma.",
    weight: "1 litre",
    variants: [
      { label: "500 ml", price: 340 },
      { label: "1 litre", price: 620 },
    ],
    price: 620,
    mrp: 720,
    rating: 4.7,
    reviews: 73,
    stock: 31,
    image: kokani,
  }),
];

export const getProduct = (slug: string) => products.find((x) => x.slug === slug);

export const stockLabel = (stock: number) =>
  stock === 0 ? "Out of Stock" : stock <= 5 ? "Low Stock" : "In Stock";

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const reviews = [
  { name: "Aarti Deshpande", city: "Pune", rating: 5, text: "The aroma filled the whole house before we even opened the box. Best Hapus we've ordered online." },
  { name: "Rohan Sawant", city: "Mumbai", rating: 5, text: "Packed beautifully, zero damaged fruit, and they ripened perfectly in three days." },
  { name: "Meera Iyer", city: "Bengaluru", rating: 4, text: "Kokum syrup and sol kadhi mix are excellent. Delivery took a day longer than expected." },
  { name: "Sameer Patil", city: "Nashik", rating: 5, text: "Ordered the gift box for my in-laws. They called to ask where we found such mangoes." },
];

export const blogPosts = [
  { slug: "identify-authentic-devgad-alphonso", title: "How to Identify Authentic Devgad Alphonso Mangoes", category: "Devgad Mangoes", excerpt: "Shape, aroma, skin tone and weight — the practical checks we use in our own sorting sheds." },
  { slug: "why-devgad-alphonso-is-special", title: "Why Devgad Alphonso Is So Special", category: "Devgad Mangoes", excerpt: "Coastal air, laterite soil and old trees: what shapes the flavour of fruit from this stretch of Konkan." },
  { slug: "storing-alphonso-mangoes", title: "How to Store Alphonso Mangoes at Home", category: "Health & Nutrition", excerpt: "Ripening in a paper bag, when to refrigerate, and how to keep the last few fruits from over-ripening." },
];
