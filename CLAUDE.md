# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Primary Development Workflow:**
```bash
yarn chain          # Start local Hardhat node (required first)
yarn deploy         # Deploy contracts to local chain
yarn allo:indexer   # Start Ponder indexer (monitors contract events)
yarn allo:dev       # Start main Next.js app with Turbopack
```

**Common Commands:**
```bash
# Testing & Quality
yarn test                    # Run Hardhat contract tests
yarn lint                    # Run ESLint across all packages
yarn format                  # Format code across all packages
yarn hardhat:check-types     # TypeScript check for contracts

# Contract Development
yarn hardhat:compile        # Compile Solidity contracts
yarn hardhat:generate       # Generate TypeScript contract types
yarn generate               # Generate Wagmi hooks (alias)

# Additional Tools
yarn app                     # Start Scaffold-ETH debugger (localhost:3001)
yarn account:generate        # Generate development account
```

**Package-Specific Commands:**
```bash
# SDK Testing (packages/sdk)
cd packages/sdk && yarn test        # Run Vitest tests with coverage

# Indexer Schema Generation (packages/allo-indexer)  
cd packages/allo-indexer && npm run codegen    # Regenerate GraphQL schema
```

## Architecture Overview

AlloKit Simple Grants is a **Yarn monorepo** with 5 packages that work together to provide a decentralized grants platform built on the Allo protocol.

### Package Structure

1. **`packages/allo-app`** - Main Next.js 15 application
   - Tech: Next.js 15, React 19, TypeScript, TailwindCSS 4, Radix UI
   - Web3: Wagmi 2.15, RainbowKit, Viem, TanStack Query
   - Routes: `/app` (public pools), `/dashboard` (pool management), `/profile`

2. **`packages/allo-indexer`** - Ponder-based blockchain indexer
   - Indexes Pool and PoolFactory contract events
   - Provides GraphQL API for real-time blockchain data
   - Required for app functionality

3. **`packages/hardhat`** - Smart contracts and deployment
   - Solidity contracts using OpenZeppelin patterns
   - Factory pattern for gas-efficient pool deployment
   - Extensions: Gates (EASGate, TokenGate), MerkleClaim distribution

4. **`packages/sdk`** - TypeScript SDK for contract interactions
   - Published as `@allo-kit/sdk`
   - Tested with Vitest
   - Used by main app for pool operations

5. **`packages/nextjs`** - Scaffold-ETH debugger interface
   - Contract debugging and block explorer
   - Runs on port 3001

### Core Smart Contract Architecture

**Key Contracts:**
- **Pool.sol**: Base pool with registration, allocation, distribution
- **PoolFactory.sol**: Creates pool clones using OpenZeppelin Clones
- **QuadraticFunding.sol**: Main strategy extending Pool with quadratic funding logic

**Modular Extensions:**
- **Gates**: Access control (EAS attestations, token requirements)
- **MerkleClaim**: Merkle tree-based fund distribution
- **Registry**: Project registration system

### Development Flow

1. **Local Setup**: Start Hardhat chain → Deploy contracts → Start indexer → Start app
2. **Contract Changes**: Modify contracts → `yarn deploy` → Restart indexer
3. **Frontend Changes**: Hot reload via Turbopack in main app
4. **Type Safety**: Contract changes auto-generate TypeScript types

### Key Configuration Files

- **`config.ts`**: Chain configuration (Hardhat local, Base Sepolia prod)
- **`deployedContracts.ts`**: Contract addresses and ABIs
- **`ponder.config.ts`**: Indexer configuration for event monitoring
- **`wagmi.config.ts`**: Wagmi CLI configuration for type generation

### Data Flow

1. **Contracts** emit events → **Indexer** processes events → **GraphQL API**
2. **Main App** queries indexer via GraphQL and interacts with contracts via SDK
3. **TanStack Query** provides caching and state management
4. **Zod schemas** validate all forms and API data

### Environment Setup

**Required Environment Variables:**
- `PINATA_JWT`, `PINATA_GATEWAY_KEY`, `PINATA_GATEWAY_URL` - IPFS metadata storage  
- `ALCHEMY_API_KEY` - Token price fetching
- Copy `.env.sample` to `.env.local` in `packages/allo-app` and `packages/allo-indexer`

### Testing Strategy

- **Smart Contracts**: Hardhat + Mocha/Chai in `packages/hardhat/test/`
- **SDK**: Vitest with coverage in `packages/sdk/`
- **Frontend**: No test framework currently configured

### Common Development Patterns

- **Component Structure**: Shadcn/ui components with Zod validation
- **Form Handling**: React Hook Form + Zod schemas
- **Error Handling**: `extractErrorReason()` utility for user-friendly messages
- **State Management**: Custom `createGlobalState()` utility
- **Web3 Patterns**: Wagmi hooks with TanStack Query for caching