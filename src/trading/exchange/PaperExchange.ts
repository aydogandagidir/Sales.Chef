import { ExecutionReport, OrderRequest, PortfolioSnapshot, Position, SymbolTicker } from '../types';

interface PaperExchangeConfig {
  startingCash: number;
  feeBps?: number;
  slippageBps?: number;
}

export class PaperExchange {
  private cash: number;
  private readonly positions: Record<SymbolTicker, Position> = {};
  private readonly feeBps: number;
  private readonly slippageBps: number;

  constructor(config: PaperExchangeConfig) {
    this.cash = config.startingCash;
    this.feeBps = config.feeBps ?? 5;
    this.slippageBps = config.slippageBps ?? 3;
  }

  get snapshot(): PortfolioSnapshot {
    const equity = Object.values(this.positions).reduce(
      (sum, pos) => sum + pos.size * pos.avgEntry + pos.unrealizedPnl,
      this.cash,
    );
    return {
      equity,
      cash: this.cash,
      positions: this.positions,
      timestamp: Date.now(),
    };
  }

  processOrder(request: OrderRequest, markPrice: number): ExecutionReport {
    const slippage = markPrice * (this.slippageBps / 10_000) * (request.side === 'buy' ? 1 : -1);
    const priceWithSlip = markPrice + slippage;
    const grossNotional = priceWithSlip * request.size;
    const fee = grossNotional * (this.feeBps / 10_000);
    const totalCost = request.side === 'buy' ? grossNotional + fee : -grossNotional + fee;

    this.cash -= totalCost;

    const existing = this.positions[request.symbol] ?? {
      symbol: request.symbol,
      size: 0,
      avgEntry: priceWithSlip,
      unrealizedPnl: 0,
    };

    const newSize = existing.size + (request.side === 'buy' ? request.size : -request.size);
    const previousNotional = existing.avgEntry * existing.size;
    const newNotional = priceWithSlip * (request.side === 'buy' ? request.size : -request.size);

    const avgEntry = newSize === 0 ? existing.avgEntry : (previousNotional + newNotional) / newSize;

    this.positions[request.symbol] = {
      ...existing,
      size: newSize,
      avgEntry,
      unrealizedPnl: 0,
    };

    return {
      request,
      executedPrice: priceWithSlip,
      fee,
      timestamp: Date.now(),
    };
  }

  markToMarket(symbol: SymbolTicker, price: number): void {
    const position = this.positions[symbol];
    if (!position) return;
    position.unrealizedPnl = (price - position.avgEntry) * position.size;
  }
}
