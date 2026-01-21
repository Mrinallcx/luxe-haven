import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/v1';

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Function to inject meta tags into HTML
function injectMetaTags(html, { title, description, image, url }) {
  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  
  // Ensure image URL is absolute
  let absoluteImageUrl = image;
  if (image && !image.startsWith('http://') && !image.startsWith('https://') && !image.startsWith('data:')) {
    absoluteImageUrl = image.startsWith('/') 
      ? `${baseUrl}${image}` 
      : `${baseUrl}/${image}`;
  } else if (!image) {
    absoluteImageUrl = `${baseUrl}/android-chrome-512x512.png`;
  }

  // Escape HTML in meta content
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImageUrl = escapeHtml(absoluteImageUrl);
  const safeUrl = escapeHtml(url);

  // Remove existing OG and Twitter meta tags
  html = html.replace(/<meta\s+property="og:[^"]*"\s+content="[^"]*"[^>]*>/gi, '');
  html = html.replace(/<meta\s+name="twitter:[^"]*"\s+content="[^"]*"[^>]*>/gi, '');
  
  // Update title
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${safeTitle}</title>`);
  html = html.replace(/<meta\s+name="title"\s+content="[^"]*"[^>]*>/i, `<meta name="title" content="${safeTitle}" />`);
  
  // Update description
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"[^>]*>/i, `<meta name="description" content="${safeDescription}" />`);
  
  // Inject OG tags before closing head tag
  const ogTags = `
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:type" content="product" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:image" content="${safeImageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Toto Finance" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImageUrl}" />
  `;
  
  html = html.replace('</head>', `${ogTags}</head>`);
  return html;
}

// Helper function to fetch product from API
async function fetchProduct(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/tiamond/market-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tokenId: String(productId) }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.result) {
      const product = data.result;
      
      // Normalize product data (similar to normalizeMarketDetails)
      const categoryMap = {
        'Genesis': 'Diamonds',
        'Argyle': 'Diamonds',
        'Gold': 'Gold',
        'Silver': 'Silver',
        'Platinum': 'Platinum',
        'Sapphire': 'Sapphire',
      };
      
      const category = categoryMap[product.edition] || 'Diamonds';
      const categoryLabel = category;
      
      return {
        name: product.name || 'Product',
        price: product.listingPrice || product.price || product.usdPrice || 0,
        category: categoryLabel,
        image: product.image || product.assetUrl || '',
        purity: product.clarity || '',
        weight: product.carat ? `${product.carat} ct` : '',
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Handle product pages - inject meta tags for crawlers
app.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const htmlPath = join(__dirname, 'dist', 'index.html');
    let html = readFileSync(htmlPath, 'utf-8');
    
    // Try to fetch product data
    const product = await fetchProduct(productId);
    
    if (product) {
      const title = `${product.name} | Toto Finance`;
      const description = `${product.name} - Premium ${product.category} available at Toto Finance. ${product.purity ? product.purity + ' purity, ' : ''}${product.weight ? product.weight + ' weight. ' : ''}Price: $${product.price.toLocaleString()}. Certified quality with authenticity guarantee.`;
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      
      html = injectMetaTags(html, {
        title,
        description,
        image: product.image,
        url
      });
    }
    
    res.send(html);
  } catch (error) {
    console.error('Error serving product page:', error);
    // Fall back to default HTML
    const htmlPath = join(__dirname, 'dist', 'index.html');
    res.sendFile(htmlPath);
  }
});

// Serve static files from dist directory (after route handlers)
app.use(express.static(join(__dirname, 'dist')));

// Handle all other routes - serve index.html
app.get('*', (req, res) => {
  const htmlPath = join(__dirname, 'dist', 'index.html');
  res.sendFile(htmlPath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base URL: ${API_BASE_URL}`);
});
