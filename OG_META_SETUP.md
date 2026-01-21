# Open Graph Meta Tags Setup for Product Pages

## Current Implementation

The application now includes dynamic Open Graph (OG) meta tags for product pages. The SEO component (`src/components/shared/SEO.tsx`) dynamically updates meta tags when a product page loads.

## The Challenge

Social media crawlers (Facebook, Twitter, LinkedIn, etc.) **do not execute JavaScript**. They only read the initial HTML from the server. Since this is a client-side rendered React app (SPA), the meta tags are added by JavaScript after the page loads, which means crawlers won't see them.

## Solutions

### Option 1: Use a Prerendering Service (Recommended)

Use a service that renders your pages server-side for crawlers:

1. **Prerender.io** (https://prerender.io)
   - Add middleware to your server
   - Automatically prerenders pages for crawlers
   - Free tier available

2. **Rendertron** (https://github.com/GoogleChrome/rendertron)
   - Self-hosted solution
   - Open source

### Option 2: Server-Side Rendering (SSR)

Implement proper SSR using:
- Next.js (migrate from Vite)
- Vite SSR with a Node.js server
- Remix or other SSR frameworks

### Option 3: Static HTML Generation

Generate static HTML files for each product page during build time.

## Testing Your Meta Tags

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
   - Enter your product URL
   - Click "Scrape Again" to see what Facebook sees
   - Clear cache if needed

2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
   - Enter your product URL
   - See preview of how it will appear

3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
   - Enter your product URL
   - See preview

## Current Client-Side Implementation

The current implementation works perfectly for:
- ✅ Users browsing the site (JavaScript enabled)
- ✅ Search engines that execute JavaScript (Google, Bing)
- ❌ Social media crawlers (need server-side solution)

## Quick Fix for Testing

To test if your meta tags are working correctly:

1. Open browser DevTools
2. Navigate to a product page
3. Check the `<head>` section - you should see:
   - `<meta property="og:title" content="...">`
   - `<meta property="og:description" content="...">`
   - `<meta property="og:image" content="...">`
   - `<meta property="og:url" content="...">`

If these tags are present, the client-side implementation is working. For social media to see them, you need one of the solutions above.

## Next Steps

1. Choose a prerendering service or SSR solution
2. Set it up for your production environment
3. Test with Facebook Debugger and Twitter Card Validator
4. Clear social media caches after deployment
