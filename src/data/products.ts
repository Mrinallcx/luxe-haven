import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import diamondProduct from "@/assets/diamond-product.webp";
import goldProduct from "@/assets/gold-product.webp";
import silverProduct from "@/assets/silver-product.webp";

export interface Product {
  id: number;
  name: string;
  price: number;
  pricePerUnit: string;
  image: string;
  category: string;
  purity: string;
  weight: string;
  status?: "auction" | "sale";
}

const images = [product1, product2, product3, product4];

// Generate 30 products per category
const generateProducts = (): Product[] => {
  const products: Product[] = [];
  let id = 1;

  // Diamonds - 30 products
  const diamondNames = [
    "Round Brilliant Diamond", "Princess Cut Diamond", "Emerald Cut Diamond", "Oval Diamond",
    "Cushion Cut Diamond", "Marquise Diamond", "Pear Shape Diamond", "Radiant Cut Diamond",
    "Asscher Cut Diamond", "Heart Shape Diamond", "Trillion Diamond", "Baguette Diamond",
    "Rose Cut Diamond", "Old European Diamond", "Old Mine Diamond", "French Cut Diamond",
    "Kite Diamond", "Shield Diamond", "Half Moon Diamond", "Trapezoid Diamond",
    "Briolette Diamond", "Hexagon Diamond", "Octagon Diamond", "Bullet Diamond",
    "Cadillac Diamond", "Calf Diamond", "Epaulette Diamond", "Flame Diamond",
    "Flanders Diamond", "Lozenge Diamond"
  ];
  const statuses: (undefined | "auction" | "sale")[] = [undefined, "auction", "sale"];
  diamondNames.forEach((name, i) => {
    products.push({
      id: id++,
      name,
      price: 5000 + Math.floor(Math.random() * 20000),
      pricePerUnit: "per carat",
      image: diamondProduct,
      category: "diamonds",
      purity: ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1"][i % 6],
      weight: `${(0.5 + Math.random() * 3).toFixed(1)} ct`,
      status: statuses[i % 3]
    });
  });

  // Gold - 30 products
  const goldNames = [
    "24K Gold Bar 100g", "24K Gold Bar 250g", "24K Gold Bar 500g", "24K Gold Bar 1kg",
    "22K Gold Coin 50g", "22K Gold Coin 100g", "24K Gold Biscuit", "Swiss Gold Bar",
    "Gold Krugerrand 1oz", "Gold Eagle 1oz", "Gold Maple Leaf", "Gold Britannia",
    "Gold Philharmonic", "Gold Buffalo", "Gold Panda", "Gold Kangaroo",
    "Perth Mint Gold Bar", "PAMP Suisse Gold", "Credit Suisse Gold", "Valcambi Gold",
    "Heraeus Gold Bar", "Argor-Heraeus Gold", "Royal Canadian Mint Gold", "Austrian Mint Gold",
    "Johnson Matthey Gold", "Engelhard Gold Bar", "Metalor Gold Bar", "Umicore Gold",
    "Tanaka Gold Bar", "Rand Refinery Gold"
  ];
  goldNames.forEach((name, i) => {
    products.push({
      id: id++,
      name,
      price: 1500 + Math.floor(Math.random() * 30000),
      pricePerUnit: i < 4 ? "per bar" : "per unit",
      image: goldProduct,
      category: "gold",
      purity: ["999.9", "916", "750"][i % 3],
      weight: ["50g", "100g", "250g", "500g", "1kg", "1 oz"][i % 6],
      status: statuses[(i + 1) % 3]
    });
  });

  // Silver - 30 products
  const silverNames = [
    "999 Silver Bar 1kg", "999 Silver Bar 5kg", "Sterling Silver Coin", "Silver Bullion 100oz",
    "American Silver Eagle", "Silver Maple Leaf", "Silver Britannia", "Silver Philharmonic",
    "Silver Krugerrand", "Silver Kangaroo", "Silver Panda", "Silver Libertad",
    "Silver Kookaburra", "Silver Koala", "PAMP Suisse Silver", "Credit Suisse Silver",
    "Valcambi Silver Bar", "Heraeus Silver Bar", "Perth Mint Silver", "Royal Canadian Silver",
    "Austrian Mint Silver", "Johnson Matthey Silver", "Engelhard Silver", "Sunshine Silver",
    "Asahi Silver Bar", "OPM Silver Bar", "Scottsdale Silver", "Silvertowne Bar",
    "Republic Metals Silver", "Golden State Silver"
  ];
  silverNames.forEach((name, i) => {
    products.push({
      id: id++,
      name,
      price: 30 + Math.floor(Math.random() * 3000),
      pricePerUnit: i < 4 ? "per bar" : "per unit",
      image: silverProduct,
      category: "silver",
      purity: ["999", "9999", "925"][i % 3],
      weight: ["1 oz", "100g", "500g", "1kg", "5kg"][i % 5],
      status: statuses[(i + 2) % 3]
    });
  });

  // Platinum - 30 products
  const platinumNames = [
    "Platinum Bar 100g", "Platinum Bar 250g", "Platinum Bar 500g", "Platinum Bar 1kg",
    "Platinum Eagle 1oz", "Platinum Maple Leaf", "Platinum Britannia", "Platinum Philharmonic",
    "Platinum Kangaroo", "PAMP Platinum Bar", "Credit Suisse Platinum", "Valcambi Platinum",
    "Heraeus Platinum", "Perth Mint Platinum", "Johnson Matthey Platinum", "Engelhard Platinum",
    "Argor-Heraeus Platinum", "Metalor Platinum", "Tanaka Platinum", "Swiss Platinum Ingot",
    "Noble Platinum Coin", "Isle of Man Platinum", "Platinum Koala", "American Platinum Eagle",
    "Russian Platinum", "South African Platinum", "Zimbabwe Platinum", "Colombian Platinum",
    "Canadian Platinum Ingot", "Austrian Platinum Bar"
  ];
  platinumNames.forEach((name, i) => {
    products.push({
      id: id++,
      name,
      price: 1000 + Math.floor(Math.random() * 45000),
      pricePerUnit: i < 4 ? "per bar" : "per unit",
      image: images[i % 4],
      category: "platinum",
      purity: "999.5",
      weight: ["1 oz", "100g", "250g", "500g", "1kg"][i % 5],
      status: statuses[i % 3]
    });
  });

  // Sapphire - 30 products
  const sapphireNames = [
    "Blue Sapphire Ceylon", "Kashmir Blue Sapphire", "Burmese Sapphire", "Thai Blue Sapphire",
    "Ceylon Pink Sapphire", "Padparadscha Sapphire", "Yellow Sapphire", "Orange Sapphire",
    "Green Sapphire", "Purple Sapphire", "White Sapphire", "Star Sapphire Blue",
    "Star Sapphire Pink", "Cabochon Sapphire", "Oval Blue Sapphire", "Cushion Sapphire",
    "Emerald Cut Sapphire", "Round Sapphire", "Pear Sapphire", "Marquise Sapphire",
    "Heart Sapphire", "Princess Sapphire", "Trillion Sapphire", "Baguette Sapphire",
    "Rose Cut Sapphire", "Briolette Sapphire", "Montana Sapphire", "Australian Sapphire",
    "Nigerian Sapphire", "Madagascar Sapphire"
  ];
  sapphireNames.forEach((name, i) => {
    products.push({
      id: id++,
      name,
      price: 3000 + Math.floor(Math.random() * 25000),
      pricePerUnit: "per carat",
      image: images[i % 4],
      category: "sapphire",
      purity: ["AAA", "AAA+", "AA", "Exceptional"][i % 4],
      weight: `${(1 + Math.random() * 5).toFixed(1)} ct`,
      status: statuses[(i + 1) % 3]
    });
  });

  return products;
};

export const allProducts = generateProducts();

export const categoryDescriptions: Record<string, string> = {
  diamonds: "Discover our collection of certified, ethically sourced diamonds with exceptional clarity and brilliance.",
  gold: "Invest in pure gold bars, coins, and bullion. All products are certified and hallmarked.",
  silver: "Premium silver investments including bars, coins, and bullion at competitive prices.",
  platinum: "Rare platinum products for discerning investors seeking portfolio diversification.",
  sapphire: "Exquisite natural sapphires sourced from the finest mines worldwide.",
};
