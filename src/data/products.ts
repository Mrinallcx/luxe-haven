import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

export interface Product {
  id: number;
  name: string;
  price: number;
  pricePerUnit: string;
  image: string;
  category: string;
}

const images = [product1, product2, product3, product4];

// Generate 30 products per category
const generateProducts = (): Product[] => {
  const categories = [
    {
      name: "Diamonds",
      products: [
        { name: "Round Brilliant Diamond", price: 12500, pricePerUnit: "per carat" },
        { name: "Princess Cut Diamond", price: 9800, pricePerUnit: "per carat" },
        { name: "Emerald Cut Diamond", price: 15200, pricePerUnit: "per carat" },
        { name: "Oval Diamond", price: 8900, pricePerUnit: "per carat" },
        { name: "Cushion Cut Diamond", price: 11200, pricePerUnit: "per carat" },
        { name: "Marquise Diamond", price: 7500, pricePerUnit: "per carat" },
        { name: "Pear Shape Diamond", price: 10500, pricePerUnit: "per carat" },
        { name: "Radiant Cut Diamond", price: 9200, pricePerUnit: "per carat" },
        { name: "Asscher Cut Diamond", price: 13800, pricePerUnit: "per carat" },
        { name: "Heart Shape Diamond", price: 11800, pricePerUnit: "per carat" },
        { name: "Trillion Diamond", price: 8200, pricePerUnit: "per carat" },
        { name: "Baguette Diamond", price: 6500, pricePerUnit: "per carat" },
        { name: "Rose Cut Diamond", price: 14500, pricePerUnit: "per carat" },
        { name: "Old Mine Cut Diamond", price: 16200, pricePerUnit: "per carat" },
        { name: "European Cut Diamond", price: 15800, pricePerUnit: "per carat" },
        { name: "Flawless Diamond", price: 25000, pricePerUnit: "per carat" },
        { name: "Blue Diamond", price: 45000, pricePerUnit: "per carat" },
        { name: "Pink Diamond", price: 38000, pricePerUnit: "per carat" },
        { name: "Yellow Diamond", price: 18500, pricePerUnit: "per carat" },
        { name: "Black Diamond", price: 5200, pricePerUnit: "per carat" },
        { name: "Champagne Diamond", price: 7800, pricePerUnit: "per carat" },
        { name: "Cognac Diamond", price: 8500, pricePerUnit: "per carat" },
        { name: "Salt & Pepper Diamond", price: 4200, pricePerUnit: "per carat" },
        { name: "Step Cut Diamond", price: 9800, pricePerUnit: "per carat" },
        { name: "Briolette Diamond", price: 12200, pricePerUnit: "per carat" },
        { name: "Shield Cut Diamond", price: 8900, pricePerUnit: "per carat" },
        { name: "Kite Diamond", price: 7200, pricePerUnit: "per carat" },
        { name: "Hexagon Diamond", price: 9500, pricePerUnit: "per carat" },
        { name: "Lozenge Diamond", price: 10800, pricePerUnit: "per carat" },
        { name: "Antique Diamond", price: 19500, pricePerUnit: "per carat" },
      ],
    },
    {
      name: "Gold",
      products: [
        { name: "24K Gold Bar 100g", price: 5890, pricePerUnit: "per 100g" },
        { name: "22K Gold Coin", price: 2450, pricePerUnit: "per 50g" },
        { name: "18K Gold Ingot", price: 3200, pricePerUnit: "per 100g" },
        { name: "24K Gold Biscuit", price: 11780, pricePerUnit: "per 200g" },
        { name: "Gold Krugerrand", price: 1950, pricePerUnit: "per oz" },
        { name: "Swiss Gold Bar", price: 29450, pricePerUnit: "per 500g" },
        { name: "American Gold Eagle", price: 2100, pricePerUnit: "per oz" },
        { name: "Canadian Gold Maple", price: 1980, pricePerUnit: "per oz" },
        { name: "Austrian Philharmonic", price: 1920, pricePerUnit: "per oz" },
        { name: "Chinese Gold Panda", price: 2050, pricePerUnit: "per oz" },
        { name: "British Sovereign", price: 450, pricePerUnit: "per coin" },
        { name: "South African Gold", price: 1890, pricePerUnit: "per oz" },
        { name: "Australian Kangaroo", price: 1960, pricePerUnit: "per oz" },
        { name: "Mexican Gold Peso", price: 1750, pricePerUnit: "per oz" },
        { name: "24K Gold Chain", price: 4500, pricePerUnit: "per 50g" },
        { name: "Gold Nugget", price: 3200, pricePerUnit: "per 50g" },
        { name: "PAMP Suisse Bar", price: 6100, pricePerUnit: "per 100g" },
        { name: "Credit Suisse Bar", price: 5950, pricePerUnit: "per 100g" },
        { name: "Perth Mint Gold", price: 5850, pricePerUnit: "per 100g" },
        { name: "Valcambi Gold Bar", price: 5900, pricePerUnit: "per 100g" },
        { name: "Heraeus Gold Bar", price: 5920, pricePerUnit: "per 100g" },
        { name: "Argor-Heraeus Bar", price: 5880, pricePerUnit: "per 100g" },
        { name: "Metalor Gold Bar", price: 5870, pricePerUnit: "per 100g" },
        { name: "Johnson Matthey Bar", price: 5950, pricePerUnit: "per 100g" },
        { name: "Royal Canadian Gold", price: 5980, pricePerUnit: "per 100g" },
        { name: "24K Gold Wafer", price: 590, pricePerUnit: "per 10g" },
        { name: "Gold Tola Bar", price: 700, pricePerUnit: "per tola" },
        { name: "Kilo Gold Bar", price: 58900, pricePerUnit: "per kg" },
        { name: "10oz Gold Bar", price: 18500, pricePerUnit: "per 10oz" },
        { name: "5oz Gold Bar", price: 9400, pricePerUnit: "per 5oz" },
      ],
    },
    {
      name: "Silver",
      products: [
        { name: "999 Silver Bar 1kg", price: 890, pricePerUnit: "per 1kg" },
        { name: "Sterling Silver Coin", price: 45, pricePerUnit: "per oz" },
        { name: "Silver Bullion 5kg", price: 2650, pricePerUnit: "per 5kg" },
        { name: "American Silver Eagle", price: 32, pricePerUnit: "per oz" },
        { name: "Silver Maple Leaf", price: 30, pricePerUnit: "per oz" },
        { name: "Silver Ingot 500g", price: 445, pricePerUnit: "per 500g" },
        { name: "Austrian Philharmonic", price: 31, pricePerUnit: "per oz" },
        { name: "Britannia Silver", price: 33, pricePerUnit: "per oz" },
        { name: "Australian Kookaburra", price: 35, pricePerUnit: "per oz" },
        { name: "Chinese Silver Panda", price: 38, pricePerUnit: "per oz" },
        { name: "Mexican Libertad", price: 36, pricePerUnit: "per oz" },
        { name: "South African Krugerrand", price: 34, pricePerUnit: "per oz" },
        { name: "Canadian Wildlife", price: 32, pricePerUnit: "per oz" },
        { name: "PAMP Suisse Silver", price: 48, pricePerUnit: "per oz" },
        { name: "Valcambi Silver Bar", price: 890, pricePerUnit: "per kg" },
        { name: "Credit Suisse Silver", price: 910, pricePerUnit: "per kg" },
        { name: "Perth Mint Silver", price: 880, pricePerUnit: "per kg" },
        { name: "Heraeus Silver Bar", price: 895, pricePerUnit: "per kg" },
        { name: "Johnson Matthey Silver", price: 905, pricePerUnit: "per kg" },
        { name: "Engelhard Silver Bar", price: 920, pricePerUnit: "per kg" },
        { name: "Sunshine Mint Silver", price: 875, pricePerUnit: "per kg" },
        { name: "Silvertowne Bar", price: 865, pricePerUnit: "per kg" },
        { name: "OPM Silver Bar", price: 860, pricePerUnit: "per kg" },
        { name: "Elemetal Silver", price: 870, pricePerUnit: "per kg" },
        { name: "Asahi Silver Bar", price: 885, pricePerUnit: "per kg" },
        { name: "100oz Silver Bar", price: 2800, pricePerUnit: "per 100oz" },
        { name: "10oz Silver Bar", price: 290, pricePerUnit: "per 10oz" },
        { name: "5oz Silver Bar", price: 148, pricePerUnit: "per 5oz" },
        { name: "Silver Round", price: 29, pricePerUnit: "per oz" },
        { name: "Junk Silver Coins", price: 25, pricePerUnit: "per oz" },
      ],
    },
    {
      name: "Platinum",
      products: [
        { name: "Platinum Bar 100g", price: 4200, pricePerUnit: "per 100g" },
        { name: "Platinum Coin 1oz", price: 1050, pricePerUnit: "per oz" },
        { name: "Platinum Ingot 200g", price: 8400, pricePerUnit: "per 200g" },
        { name: "Platinum Bullion 500g", price: 21000, pricePerUnit: "per 500g" },
        { name: "American Platinum Eagle", price: 1080, pricePerUnit: "per oz" },
        { name: "Canadian Platinum Maple", price: 1060, pricePerUnit: "per oz" },
        { name: "Australian Platypus", price: 1070, pricePerUnit: "per oz" },
        { name: "Isle of Man Noble", price: 1100, pricePerUnit: "per oz" },
        { name: "PAMP Suisse Platinum", price: 4350, pricePerUnit: "per 100g" },
        { name: "Credit Suisse Platinum", price: 4280, pricePerUnit: "per 100g" },
        { name: "Valcambi Platinum", price: 4250, pricePerUnit: "per 100g" },
        { name: "Heraeus Platinum", price: 4300, pricePerUnit: "per 100g" },
        { name: "Johnson Matthey Platinum", price: 4320, pricePerUnit: "per 100g" },
        { name: "Engelhard Platinum", price: 4400, pricePerUnit: "per 100g" },
        { name: "Argor-Heraeus Platinum", price: 4280, pricePerUnit: "per 100g" },
        { name: "Perth Mint Platinum", price: 4220, pricePerUnit: "per 100g" },
        { name: "Royal Canadian Platinum", price: 4260, pricePerUnit: "per 100g" },
        { name: "Metalor Platinum", price: 4240, pricePerUnit: "per 100g" },
        { name: "Kilo Platinum Bar", price: 42000, pricePerUnit: "per kg" },
        { name: "10oz Platinum Bar", price: 10500, pricePerUnit: "per 10oz" },
        { name: "5oz Platinum Bar", price: 5300, pricePerUnit: "per 5oz" },
        { name: "Platinum Wafer 10g", price: 420, pricePerUnit: "per 10g" },
        { name: "Platinum Round", price: 1040, pricePerUnit: "per oz" },
        { name: "Russian Platinum", price: 4180, pricePerUnit: "per 100g" },
        { name: "Japanese Platinum", price: 4200, pricePerUnit: "per 100g" },
        { name: "Swiss Platinum Bar", price: 4350, pricePerUnit: "per 100g" },
        { name: "German Platinum", price: 4280, pricePerUnit: "per 100g" },
        { name: "UK Platinum Britannia", price: 1090, pricePerUnit: "per oz" },
        { name: "Austrian Platinum", price: 1055, pricePerUnit: "per oz" },
        { name: "Chinese Platinum Panda", price: 1120, pricePerUnit: "per oz" },
      ],
    },
    {
      name: "Sapphire",
      products: [
        { name: "Blue Sapphire", price: 8500, pricePerUnit: "per carat" },
        { name: "Ceylon Sapphire", price: 12000, pricePerUnit: "per carat" },
        { name: "Pink Sapphire", price: 6800, pricePerUnit: "per carat" },
        { name: "Yellow Sapphire", price: 4500, pricePerUnit: "per carat" },
        { name: "Star Sapphire", price: 15000, pricePerUnit: "per carat" },
        { name: "Padparadscha Sapphire", price: 25000, pricePerUnit: "per carat" },
        { name: "Kashmir Sapphire", price: 45000, pricePerUnit: "per carat" },
        { name: "Burmese Sapphire", price: 18000, pricePerUnit: "per carat" },
        { name: "Montana Sapphire", price: 3500, pricePerUnit: "per carat" },
        { name: "Australian Sapphire", price: 2800, pricePerUnit: "per carat" },
        { name: "Thai Sapphire", price: 4200, pricePerUnit: "per carat" },
        { name: "Madagascar Sapphire", price: 5500, pricePerUnit: "per carat" },
        { name: "Nigerian Sapphire", price: 3200, pricePerUnit: "per carat" },
        { name: "Tanzanian Sapphire", price: 6200, pricePerUnit: "per carat" },
        { name: "Vietnamese Sapphire", price: 4800, pricePerUnit: "per carat" },
        { name: "Green Sapphire", price: 3800, pricePerUnit: "per carat" },
        { name: "Orange Sapphire", price: 5200, pricePerUnit: "per carat" },
        { name: "Purple Sapphire", price: 4600, pricePerUnit: "per carat" },
        { name: "White Sapphire", price: 1200, pricePerUnit: "per carat" },
        { name: "Color Change Sapphire", price: 8800, pricePerUnit: "per carat" },
        { name: "Bi-Color Sapphire", price: 7200, pricePerUnit: "per carat" },
        { name: "Teal Sapphire", price: 5800, pricePerUnit: "per carat" },
        { name: "Lavender Sapphire", price: 4200, pricePerUnit: "per carat" },
        { name: "Peacock Sapphire", price: 9500, pricePerUnit: "per carat" },
        { name: "Royal Blue Sapphire", price: 22000, pricePerUnit: "per carat" },
        { name: "Cornflower Sapphire", price: 28000, pricePerUnit: "per carat" },
        { name: "Velvet Sapphire", price: 16500, pricePerUnit: "per carat" },
        { name: "Cabochon Sapphire", price: 3500, pricePerUnit: "per carat" },
        { name: "Heated Sapphire", price: 2200, pricePerUnit: "per carat" },
        { name: "Unheated Sapphire", price: 35000, pricePerUnit: "per carat" },
      ],
    },
  ];

  let id = 1;
  const allProducts: Product[] = [];

  categories.forEach((category) => {
    category.products.forEach((product, index) => {
      allProducts.push({
        id: id++,
        name: product.name,
        price: product.price,
        pricePerUnit: product.pricePerUnit,
        image: images[index % 4],
        category: category.name,
      });
    });
  });

  return allProducts;
};

export const allProducts = generateProducts();
export const categories = ["All", "Diamonds", "Gold", "Silver", "Platinum", "Sapphire"];
