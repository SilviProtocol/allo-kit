# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the Next.js application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run generate` - Generate Wagmi TypeScript bindings from contracts

## Architecture Overview

This is a Next.js 15 application for managing grant pools using the Allo protocol. It uses the App Router and combines DeFi protocols with a traditional web interface.

### Key Technologies

- **Allo Kit SDK** (`@allo-kit/sdk`) for protocol interactions
- **Ponder** for indexing Allo contracts
- **Hardhat** for smart contracts deployment
- **OpenZeppelin** for building smart contracts
- **ShadcnUI** for tailwind components
- **Next.js 15** with App Router and TypeScript
- **Wagmi v2** for Ethereum interactions
- **RainbowKit** for wallet connections
- **TanStack ReactQuery** for state management and caching
- **shadcn/ui** components with Radix UI and Tailwind CSS
- **Zod** for schema validation
- **GraphQL** with URQL for data fetching

### Project Structure

```
packages/allo-docs/             # Documentation for smart contracts, sdk and indexer
packages/allo-app/
├── app/                          # Next.js App Router
│   ├── api/ipfs/                # IPFS upload API route
│   ├── app/                     # Public application pages
│   │   ├── pools/              # Pool exploration and application
│   │   │   ├── [poolAddress]/  # Individual pool pages
│   │   │   │   ├── apply/      # Pool application form
│   │   │   │   ├── checkout/   # Donation checkout
│   │   │   │   └── registrations/ # View registrations
│   │   │   └── page.tsx        # Pool listing page
│   │   └── profile/            # User profile management
│   ├── dashboard/              # Pool owner management interface
│   │   ├── [poolAddress]/      # Pool-specific dashboard
│   │   │   ├── applications/   # Review applications
│   │   │   ├── distribution/   # Manage fund distribution
│   │   │   ├── funds/         # Pool funding management
│   │   │   ├── settings/      # Pool configuration
│   │   │   ├── team/          # Team management
│   │   │   └── voters/        # Voter management
│   │   └── create-pool/       # Pool creation wizard
│   ├── providers.tsx          # Wagmi/RainbowKit/Query providers
│   └── providers-sdk.tsx      # Allo Kit SDK provider
├── components/                 # Reusable React components
│   ├── allocation/            # Fund allocation components
│   ├── cart/                  # Shopping cart for donations
│   ├── distribution/          # Distribution strategy components
│   ├── pool/                  # Pool-related components
│   │   ├── pool-card.tsx      # Pool display card
│   │   ├── pool-form.tsx      # Pool creation form
│   │   ├── queries.ts         # GraphQL queries
│   │   ├── schemas.ts         # Zod validation schemas
│   │   └── use-pool.ts        # Pool management hooks
│   ├── registration/          # Application/registration components
│   ├── strategy/              # Strategy-specific components
│   ├── token/                 # Token/balance components
│   └── ui/                    # shadcn/ui components
├── hooks/                     # Custom React hooks
│   ├── use-global-state.ts    # Global state management
│   ├── use-indexer.ts         # GraphQL data fetching
│   ├── use-contracts.ts       # Contract interactions
│   └── use-quadratic-matching.ts # Quadratic funding logic
├── lib/                       # Utility functions
│   ├── utils.ts              # General utilities (cn, etc.)
│   ├── format.ts             # Data formatting helpers
│   ├── graphql.ts            # GraphQL client setup
│   └── quadratic.ts          # Quadratic funding calculations
├── schemas/                   # Zod validation schemas
│   ├── address.ts            # Ethereum address validation
│   ├── metadata.ts           # Metadata schemas
│   └── project.ts            # Project/application schemas
├── contracts/                 # Smart contract definitions
│   └── deployedContracts.ts  # Contract addresses and ABIs
├── queries/                   # GraphQL query definitions
└── config.ts                 # Chain and environment configuration
```

The app uses Next.js App Router with the following main sections:

- `/app` - Public pool exploration and application
- `/dashboard` - Pool management interface for owners
- `/profile` - User profile management

### Core Concepts

**Pools**: Smart contract-based grant pools with configurable allocation strategies
**Registrations**: Applications to join grant pools
**Allocations**: Fund distributions from pools to registered projects
**Strategies**: Smart contracts that define allocation logic (e.g., quadratic funding)

### Key Configuration

- **Chain Configuration**: `config.ts` - Supports hardhat (dev), Base Sepolia (prod), mainnet
- **Default Chain**: Hardhat for development, Base Sepolia for production
- **Contract Deployment**: Uses `deployedContracts.ts` for contract addresses
- **Wagmi Config**: Generates TypeScript bindings for Pool and PoolFactory contracts

### Provider Architecture

```
Providers (app/providers.tsx)
├── WagmiProvider - Ethereum wallet integration
├── QueryClientProvider - TanStack Query for caching
├── RainbowKitProvider - Wallet UI components
└── AlloKitSDKProvider - Allo protocol SDK
```

### Data Flow

1. **Indexer Queries**: GraphQL queries to fetch pool/allocation data via `useIndexer` hook
2. **SDK Operations**: Pool creation, configuration, and allocation via Allo Kit SDK
3. **State Management**: Custom global state using `createGlobalState` utility
4. **Form Handling**: React Hook Form with Zod validation

### Key Hooks and Utilities

- `useAlloKitSDK()` - Access to Allo protocol SDK instance
- `useIndexer()` - GraphQL data fetching with caching
- `usePools()`, `usePoolById()` - Pool data management
- `useCreatePool()`, `useConfigurePool()` - Pool mutations
- `createGlobalState()` - Custom global state management

### Component Patterns

- Form components use React Hook Form + Zod validation
- UI components built with shadcn/ui conventions
- Mutation operations use TanStack Query with toast notifications
- Error handling via `extractErrorReason()` utility

### Development Notes

- TypeScript build errors are ignored in `next.config.ts`
- Uses Turbopack for faster development builds
- Wallet connections support MetaMask, Rainbow, Coinbase, Safe, and development burner wallet
- IPFS integration for metadata storage via `/api/ipfs` route
