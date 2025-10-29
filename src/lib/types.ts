// Data models based on iflow.md requirements

export interface ExposureSpec {
  id: string;
  statement: string;
  horizon: string;
  budget: number;
  venuesAllowed: string[];
  jurisdiction: string;
  createdAt: string;
  updatedAt: string;
}

export interface Market {
  id: string;
  venue: string;
  title: string;
  ruleText: string;
  window: {
    start: string;
    end: string;
  };
  tickSize: number;
  fee: number;
  tags: string[];
  currentPrice: number;
  liquidity: number;
  volume: number;
}

export interface Candidate {
  exposureId: string;
  marketId: string;
  fit: number;
  depthEst: number;
  costEst: number;
  weight: number;
  coverage: number;
  slippage: number;
}

export interface BasketItem {
  marketId: string;
  side: 'buy' | 'sell';
  weight: number;
  orderType: string;
  limits: {
    maxSpend?: number;
    slippageGuard?: number;
  };
}

export interface Basket {
  exposureId: string;
  items: BasketItem[];
  totalCost: number;
  expectedCoverage: number;
  createdAt: string;
}

export interface Order {
  id: string;
  basketId: string;
  marketId: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  orderType: string;
  status: 'pending' | 'placed' | 'filled' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Fill {
  id: string;
  orderId: string;
  quantity: number;
  price: number;
  timestamp: string;
}

export interface Receipt {
  id: string;
  exposureId: string;
  basketId: string;
  orders: Order[];
  fills: Fill[];
  hashes: {
    spec: string;
    decisions: string;
    orders: string;
    fills: string;
  };
  timestamps: {
    spec: string;
    decisions: string;
    orders: string;
    fills: string;
  };
  signer: string;
}

// Existing types (updated to align with new data model)
export interface HedgePosition {
  id: string;
  marketId: string;
  venue: string;
  title: string;
  side: 'buy' | 'sell';
  quantity: number;
  avgPrice: number;
  mark: number;
  pnl: number;
  pnlPercentage: number;
  resolveDate: string;
  status: 'open' | 'closed' | 'resolved';
  coverage: number;
  residualRisk: number;
}

export interface ExecutionCandidate extends Candidate {
  market: Market;
}

export interface ExecutionSheet {
  id: string;
  exposureId: string;
  basket: Basket;
  orders: Order[];
  estimatedCost: number;
  estimatedPnL: number;
  confidence: number;
  slippage: number;
  fees: number;
  receiptPreview: string;
  createdAt: string;
  updatedAt: string;
}