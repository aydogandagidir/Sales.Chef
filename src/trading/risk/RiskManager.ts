import { ExecutionReport, PortfolioSnapshot, SymbolTicker, TradeSignal } from '../types';

interface RiskConfig {
  maxGrossExposurePct?: number;
  maxSinglePositionPct?: number;
  maxConcurrentPositions?: number;
}

export class RiskManager {
  private readonly config: Required<RiskConfig> = {
    maxGrossExposurePct: 1.5,
    maxSinglePositionPct: 0.25,
    maxConcurrentPositions: 10,
  };

  constructor(config?: RiskConfig) {
    this.config = { ...this.config, ...config };
  }

  approveSignal(signal: TradeSignal, snapshot: PortfolioSnapshot): boolean {
    if (signal.intent === 'hold') return false;

    const activePositions = Object.values(snapshot.positions).filter((pos) => pos.size !== 0);
    if (activePositions.length >= this.config.maxConcurrentPositions) return false;

    const requestedExposure = snapshot.equity * signal.sizePct * (signal.confidence || 0.1);
    const singleLimit = snapshot.equity * this.config.maxSinglePositionPct;
    if (requestedExposure > singleLimit) return false;

    const grossExposure = activePositions.reduce(
      (sum, pos) => sum + Math.abs(pos.avgEntry * pos.size),
      0,
    );
    if (grossExposure / snapshot.equity > this.config.maxGrossExposurePct) return false;

    return true;
  }

  applyExecution(report: ExecutionReport, snapshot: PortfolioSnapshot): PortfolioSnapshot {
    const positions: PortfolioSnapshot['positions'] = { ...snapshot.positions };
    const existing = positions[report.request.symbol];
    if (existing) {
      existing.unrealizedPnl = 0;
    }
    return { ...snapshot, positions };
  }

  stopLossLevels(symbol: SymbolTicker, snapshot: PortfolioSnapshot): number | undefined {
    const pos = snapshot.positions[symbol];
    if (!pos || pos.size === 0) return undefined;
    const threshold = pos.size > 0 ? pos.avgEntry * 0.95 : pos.avgEntry * 1.05;
    return threshold;
  }
}
