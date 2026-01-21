# Server-Side Meta Tags Setup

This project includes a server-side solution to inject Open Graph meta tags for product pages, ensuring social media crawlers can see the correct preview images and descriptions.

## How It Works

The `server.mjs` file is an Express server that:
1. Serves your built React app from the `dist` folder
2. Intercepts requests to `/product/:productId` routes
3. Fetches product data from your API
4. Injects product-specific meta tags into the HTML before serving it
5. This ensures social media crawlers see the correct meta tags in the initial HTML

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Build Your App

```bash
npm run build
```

### 3. Start the Server

```bash
npm start
```

Or build and serve in one command:
```bash
npm run serve
```

The server will run on port 3000 by default (or the PORT environment variable).

## Environment Variables

You can configure the server using environment variables:

- `PORT` - Server port (default: 3000)
- `VITE_API_BASE_URL` - Your API base URL (default: http://127.0.0.1:3000/v1)
- `BASE_URL` - Your site's base URL for absolute image URLs (default: http://localhost:PORT)

Example:
```bash
PORT=8080 VITE_API_BASE_URL=https://api.example.com/v1 BASE_URL=https://example.com npm start
```

## Production Deployment

### Option 1: Use the Express Server

1. Build your app: `npm run build`
2. Start the server: `npm start`
3. Configure your hosting to run `npm start` (or use PM2, systemd, etc.)

### Option 2: Use with Existing Server

If you already have a server (like Nginx, Apache, or another Node.js server), you can:
1. Use this server as a middleware
2. Or configure your existing server to proxy product routes to this server
3. Or use a service like Prerender.io

## Testing

After starting the server:

1. **Test in Browser**: Visit `http://localhost:3000/product/123` and view page source - you should see the OG meta tags in the HTML

2. **Test with Facebook Debugger**: 
   - Go to https://developers.facebook.com/tools/debug/
   - Enter your product URL (e.g., `https://yourdomain.com/product/123`)
   - Click "Scrape Again" to see the preview

3. **Test with Twitter Card Validator**:
   - Go to https://cards-dev.twitter.com/validator
   - Enter your product URL
   - See the preview

## How It Differs from Client-Side

- **Client-side (React)**: Meta tags are added after JavaScript executes (crawlers don't see them)
- **Server-side (this solution)**: Meta tags are in the initial HTML (crawlers can see them)

Both work together:
- Server-side: For social media crawlers
- Client-side: For users browsing the site (updates meta tags as they navigate)

## Troubleshooting

### Images not showing in preview
- Ensure image URLs are absolute (starting with http:// or https://)
- Check that images are publicly accessible
- Verify the `BASE_URL` environment variable is set correctly

### Product data not loading
- Check that `VITE_API_BASE_URL` is correct
- Verify the API endpoint `/tiamond/market-details` is accessible
- Check server logs for API errors

### Meta tags not updating
- Clear social media cache (Facebook Debugger has a "Scrape Again" button)
- Verify the server is running and serving the modified HTML
- Check browser DevTools to see if meta tags are in the HTML source
