# Risk Radar 2.0

A modern Next.js application for risk management and transaction monitoring.

## Features

- **Risk Dashboard**: Comprehensive dashboard with KPIs, charts, and filters for risk analysis
- **Auto Hold**: Batch transaction review system with detailed batch views
- **Settings**: Configuration modules for risk rules, MCC, MID, and merchant risk thresholds

## Tech Stack

- **Framework**: Next.js 15.5.6
- **UI Library**: Chakra UI v3
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Icons**: Lucide React, React Icons
- **Forms**: React Hook Form with Zod validation
- **Tables**: TanStack React Table

## Getting Started

### Prerequisites

- Node.js 22.12.0 or higher
- npm, yarn, or pnpm package manager

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start development server on port 3006
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:3006`

### Build

```bash
# Build for production
npm run build
# or
yarn build

# Start production server on port 3005
npm run start
# or
yarn start
```

### Linting

```bash
# Run linter
npm run lint
# or
yarn lint

# Fix linting issues
npm run lint:fix
# or
yarn lint:fix

# Type checking
npm run check-types
# or
yarn check-types
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (main)/            # Main layout pages
│   │   ├── auto-hold/     # Auto Hold module
│   │   └── settings/      # Settings modules
│   └── layout.tsx         # Root layout
├── libs/                   # Business logic
│   ├── domain/            # Domain-specific modules
│   │   ├── auto-hold/     # Auto Hold components
│   │   ├── dashboard/    # Dashboard components
│   │   └── settings/      # Settings components
│   ├── navigation/        # Route configuration
│   ├── shared/            # Shared utilities and API
│   └── utils/             # General utilities
├── ui/                     # UI components
│   └── components/        # Reusable components
└── data/                   # Data models and interfaces
```

## Key Modules

### Risk Dashboard
- KPI cards with weekly trends
- Interactive charts (trend, top rules, distribution, heatmap)
- Filter bar with persistent filters
- Critical merchants ranking

### Auto Hold
- Batch-based transaction review
- Manager queue view
- Detailed batch drawer with multiple tabs
- Transaction, contact, chargebacks, and notes management

### Settings
- Risk rules configuration
- MCC and MID code management
- Merchant risk thresholds

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Add your environment variables here
```

## License

Private - All rights reserved
