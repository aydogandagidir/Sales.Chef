export type SymbolTicker = `${string}/${string}`;

export interface MarketBar {
  symbol: SymbolTicker;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradeSignal {
  agentId: string;
  symbol: SymbolTicker;
  confidence: number; // 0-1
  intent: 'buy' | 'sell' | 'hold';
  sizePct: number; // percentage of portfolio equity
  note?: string;
  issuedAt: number;
}

export interface OrderRequest {
  symbol: SymbolTicker;
  side: 'buy' | 'sell';
  size: number; // base asset quantity
  type: 'market' | 'limit';
  limitPrice?: number;
  agentId: string;
}

export interface ExecutionReport {
  request: OrderRequest;
  executedPrice: number;
  fee: number;
  timestamp: number;
}

export interface Position {
  symbol: SymbolTicker;
  size: number;
  avgEntry: number;
  unrealizedPnl: number;
}

export interface PortfolioSnapshot {
  equity: number;
  cash: number;
  positions: Record<SymbolTicker, Position>;
  timestamp: number;
}

export interface AgentContext {
  portfolio: PortfolioSnapshot;
  lastBar?: MarketBar;
}

export interface AgentConfig {
  id: string;
  symbolUniverse: SymbolTicker[];
  maxPositionPct?: number;
}
