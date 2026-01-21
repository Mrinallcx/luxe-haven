# Toto Finance Marketplace

A modern marketplace platform for tokenized commodities including diamonds, gold, silver, platinum, and sapphires.

## Getting Started

### Prerequisites

- Node.js (v18 or higher) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm, pnpm, or bun package manager

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd luxe-haven

# Step 3: Install dependencies
npm install
# or
pnpm install
# or
bun install

# Step 4: Start the development server
npm run dev
# or
pnpm dev
# or
bun dev
```

The application will be available at `http://localhost:8080`

## Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Wagmi** - Ethereum React hooks
- **Supabase** - Backend services

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
luxe-haven/
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── contexts/    # React contexts
│   ├── data/        # Static data
│   ├── hooks/       # Custom hooks
│   ├── lib/         # Utilities and API clients
│   ├── pages/       # Page components
│   └── utils/       # Helper functions
└── package.json
```

## Deployment

Build the project for production:

```sh
npm run build
```

The `dist` folder will contain the production-ready files that can be deployed to any static hosting service.

## License

Private project - All rights reserved
