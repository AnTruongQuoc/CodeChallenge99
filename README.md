# Code Challenge

A Next.js application showcasing three coding challenges: algorithmic problem solving, Solana token swapping, and React code review analysis.

## 🚀 Tech Stack

### Core Framework

- **Next.js 15.5.6** - React framework with App Router
- **React 19.1.0** - UI library with latest features
- **TypeScript 5** - Type-safe JavaScript

### Blockchain & Web3

- **Solana Web3.js** - Solana blockchain interaction
- **Jupiter API** - Token swap aggregation
- **Helius RPC** - Helius RPC Provider
- **Privy** - Web3 authentication and wallet management
- **@solana/kit** - Solana development utilities

### State Management & Data Fetching

- **TanStack Query** - Server state management and caching
- **React Query** - Data synchronization and background updates

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitizen** - Conventional commits
- **Turbopack** - Fast bundling

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (home)/                   # Problem 1 Page
│   │   ├── components/           # Home-specific components
│   │   │   └── ThreeWaysToSumDemo.tsx
│   │   ├── error.tsx            # Error boundary
│   │   └── page.tsx             # Home page
│   ├── swap/                    # Problem 2 Page
│   │   ├── components/          # Swap-specific components
│   │   │   ├── Ping/            # Ping functionality
│   │   │   └── User/            # User-related components
│   │   ├── layout.tsx           # Swap layout
│   │   └── page.tsx             # Swap page
│   ├── messy-review/            # Problem 3 Page
│   │   ├── components/          # Components
│   │   │   └── CodeReviewDemo/  # Code review demo components
│   │   └── page.tsx             # Code Review page
│   ├── layout.tsx               # Root layout
│   └── favicon.ico
├── shared/                       # Shared application code
│   ├── api/                      # API layer
│   │   └── jupiter/             # Jupiter API integration
│   │       ├── handlers.ts      # API request handlers
│   │       ├── hooks/           # React Query hooks
│   │       │   └── useJupiter.ts
│   │       └── types.ts         # TypeScript types
│   ├── components/              # Reusable components
│   │   ├── ErrorBoundary/       # Error handling
│   │   ├── Header/              # App header
│   │   ├── Layouts/             # Layout components
│   │   ├── Logos/               # Logo components
│   │   ├── Swap/                # Swap-related components
│   │   └── ui/                  # Base UI components
│   ├── constants/               # Application constants
│   ├── libs/                    # Utility libraries
│   ├── providers/               # React context providers
│   └── utils/                   # Utility functions
└── styles/                      # Global styles
    └── globals.css
```

## 🏗️ Architecture & Design Patterns

### 1. **Layered Architecture**

- **Presentation Layer**: React components in `app/` and `shared/components/`
- **Business Logic Layer**: Custom hooks and utilities in `shared/`
- **Data Layer**: API handlers and React Query integration
- **Infrastructure Layer**: Environment configuration and external services

### 2. **Component Composition Pattern**

- **Atomic Design**: Base UI components in `shared/components/ui/`
- **Feature Components**: Domain-specific components in feature folders
- **Layout Components**: Reusable layout patterns

### 3. **Custom Hooks Pattern**

- **Data Fetching**: `useJupiter` hooks for API integration
- **State Management**: Encapsulated logic in custom hooks
- **Reusability**: Shared business logic across components

### 4. **Provider Pattern**

- **QueryProvider**: TanStack Query configuration
- **PrivyProvider**: Web3 authentication setup

### 5. **API Integration Pattern**

- **Handler Functions**: Pure API request functions in `handlers.ts`
- **React Query Hooks**: Caching and state management in `hooks/`
- **Type Safety**: TypeScript interfaces for API responses

### 6. **Error Handling Pattern**

- **Error Boundaries**: React error boundaries for component isolation
- **Toast Notifications**: User-friendly error messaging
- **Graceful Degradation**: Fallback UI for failed states

## 🛠️ Setup Instructions

### Prerequisites

- Node.js >= 22.12.0
- pnpm >= 10.9.0

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/AnTruongQuoc/CodeChallenge99.git
   cd code-challenge
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**

   ```bash
   cp env.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```env
   NEXT_PUBLIC_JUPITER_URL=https://lite-api.jup.ag
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
pnpm dev                 # Start development server with Turbopack
pnpm build              # Build for production
pnpm build-stats        # Build and analyze bundle
pnpm start              # Start production server

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:check         # Check linting with zero warnings
pnpm prettier:check     # Check code formatting
pnpm prettier:format    # Format code with Prettier
pnpm ts:check           # TypeScript type checking

# Utilities
pnpm clean              # Clean build artifacts
pnpm commit             # Interactive commit with Commitizen
```

## 🎯 Challenge Tasks

This repository contains three distinct coding challenges:

### 1. **Task 1: Three Ways to Sum N**

**Route:** `/` (Home page)

**Challenge:** Implement three different algorithms to calculate the sum of all integers from 1 to n.

- **Iterative Approach**: O(n) time, O(1) space - Simple for loop
- **Mathematical Formula**: O(1) time, O(1) space - Gauss's formula: n × (n + 1) ÷ 2
- **Recursive Approach**: O(n) time, O(n) space - Recursive function calls

**Features:**

- Interactive demo with real-time calculation
- Performance comparison and execution time analysis
- Code examples for each implementation
- Input validation and error handling

### 2. **Task 2: Solana Token Swap**

**Route:** `/swap`

**Challenge:** Build a functional token swap interface using Jupiter API.

**Features:**

- Jupiter API integration for real-time quotes
- Wallet connection with Privy authentication
- Token search and selection
- Slippage protection and transaction execution
- Responsive UI with loading states

### 3. **Task 3: Messy React Code Review**

**Route:** `/messy-review`

**Challenge:** Analyze and refactor problematic React code.

**Features:**

- Interactive code review with issue identification
- Severity-based categorization (High/Medium/Low)
- Detailed explanations and fixes for each issue
- Before/after code comparison
- Categories: Performance, Type Safety, Logic Errors, Best Practices, Maintainability

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_JUPITER_URL`: Jupiter API endpoint
- `NEXT_PUBLIC_SOLANA_RPC_URL`: Solana RPC endpoint
- `NEXT_PUBLIC_PRIVY_APP_ID`: Privy authentication app ID

### Code Quality Tools

- **ESLint**: Configured with Next.js and React rules
- **Prettier**: Code formatting with import sorting
- **Husky**: Pre-commit hooks for linting and formatting
- **Commitizen**: Conventional commit messages

## 🚀 Deployment

- [CodeChallenge](https://code-challenge99.vercel.app/)

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Jupiter API](https://docs.jup.ag/)
- [Privy Documentation](https://docs.privy.io/)
