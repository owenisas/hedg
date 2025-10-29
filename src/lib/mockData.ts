import { 
  HedgePosition, 
  ExecutionCandidate, 
  ExecutionSheet, 
  Market, 
  Candidate, 
  Basket, 
  Order, 
  ExposureSpec 
} from './types';

// Mock ExposureSpec
export const mockExposureSpec: ExposureSpec = {
  id: 'exp-1',
  statement: 'We have significant exposure to EUR/USD fluctuations due to our European operations and USD-denominated debt.',
  horizon: '6 months',
  budget: 500000,
  venuesAllowed: ['Polymarket', 'Kalshi'],
  jurisdiction: 'US',
  createdAt: '2025-10-28T10:00:00Z',
  updatedAt: '2025-10-28T10:00:00Z'
};

// Mock Markets
export const mockMarkets: Market[] = [
  {
    id: 'mkt-1',
    venue: 'Polymarket',
    title: 'Will the Fed cut rates by 50bps in 2025?',
    ruleText: 'This market resolves to "Yes" if the Federal Reserve cuts interest rates by 50 basis points or more in 2025.',
    window: {
      start: '2025-01-01T00:00:00Z',
      end: '2025-12-31T23:59:59Z',
    },
    tickSize: 0.01,
    fee: 0.02,
    tags: ['economy', 'fed', 'interest-rates'],
    currentPrice: 0.65,
    liquidity: 1000000,
    volume: 5000000,
  },
  {
    id: 'mkt-2',
    venue: 'Polymarket',
    title: 'Will oil prices exceed $100/barrel in 2025?',
    ruleText: 'This market resolves to "Yes" if the price of West Texas Intermediate crude oil exceeds $100 per barrel at any point in 2025.',
    window: {
      start: '2025-01-01T00:00:00Z',
      end: '2025-12-31T23:59:59Z',
    },
    tickSize: 0.01,
    fee: 0.02,
    tags: ['commodities', 'oil', 'energy'],
    currentPrice: 0.42,
    liquidity: 750000,
    volume: 3200000,
  },
  {
    id: 'mkt-3',
    venue: 'Polymarket',
    title: 'Will the Nikkei 225 close above 40,000 in 2025?',
    ruleText: 'This market resolves to "Yes" if the Nikkei 225 index closes above 40,000 at any point in 2025.',
    window: {
      start: '2025-01-01T00:00:00Z',
      end: '2025-12-31T23:59:59Z',
    },
    tickSize: 0.01,
    fee: 0.02,
    tags: ['stocks', 'japan', 'indices'],
    currentPrice: 0.28,
    liquidity: 500000,
    volume: 1800000,
  },
  {
    id: 'mkt-4',
    venue: 'Polymarket',
    title: 'Will Elon Musk remain CEO of Tesla at end of 2025?',
    ruleText: 'This market resolves to "Yes" if Elon Musk is still the CEO of Tesla Inc. on December 31, 2025.',
    window: {
      start: '2025-01-01T00:00:00Z',
      end: '2025-12-31T23:59:59Z',
    },
    tickSize: 0.01,
    fee: 0.02,
    tags: ['tech', 'tesla', 'executives'],
    currentPrice: 0.75,
    liquidity: 1200000,
    volume: 4500000,
  }
];

// Mock Candidates
export const mockCandidates: ExecutionCandidate[] = mockMarkets.map((market, index) => ({
  exposureId: 'exp-1',
  marketId: market.id,
  fit: 0.85 - index * 0.1,
  depthEst: market.liquidity,
  costEst: 50000 + index * 25000,
  weight: 0.4 - index * 0.1,
  coverage: 0.75 - index * 0.1,
  slippage: 0.02 + index * 0.01,
  market: market
}));

// Mock Basket
export const mockBasket: Basket = {
  exposureId: 'exp-1',
  items: mockMarkets.map((market, index) => ({
    marketId: market.id,
    side: 'buy',
    weight: 0.4 - index * 0.1,
    orderType: 'market',
    limits: {
      maxSpend: 100000 + index * 50000,
      slippageGuard: 0.05
    }
  })),
  totalCost: 350000,
  expectedCoverage: 0.85,
  createdAt: '2025-10-28T14:30:00Z'
};

// Mock Orders
export const mockOrders: Order[] = mockMarkets.map((market, index) => ({
  id: `ord-${index+1}`,
  basketId: 'basket-1',
  marketId: market.id,
  side: 'buy',
  quantity: 100 + index * 50,
  price: market.currentPrice,
  orderType: 'market',
  status: 'placed',
  createdAt: '2025-10-28T15:00:00Z',
  updatedAt: '2025-10-28T15:00:00Z'
}));

// Mock Execution Sheet
export const mockExecutionSheet: ExecutionSheet = {
  id: 'exec-1',
  exposureId: 'exp-1',
  basket: mockBasket,
  orders: mockOrders,
  estimatedCost: 350000,
  estimatedPnL: 25000,
  confidence: 0.85,
  slippage: 0.03,
  fees: 7000,
  receiptPreview: 'Receipt preview hash',
  createdAt: '2025-10-28T10:00:00Z',
  updatedAt: '2025-10-28T14:30:00Z'
};

// Mock Positions
export const mockPositions: HedgePosition[] = mockMarkets.map((market, index) => ({
  id: `pos-${index+1}`,
  marketId: market.id,
  venue: market.venue,
  title: market.title,
  side: 'buy',
  quantity: 100 + index * 50,
  avgPrice: market.currentPrice,
  mark: market.currentPrice + (index * 0.05),
  pnl: 1000 + index * 500,
  pnlPercentage: 2.5 + index * 1.5,
  resolveDate: market.window.end,
  status: 'open',
  coverage: 0.8 - index * 0.1,
  residualRisk: 0.2 + index * 0.05
}));