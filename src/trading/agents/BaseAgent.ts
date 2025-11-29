import { AgentConfig, AgentContext, MarketBar, TradeSignal } from '../types';

export abstract class BaseAgent {
  protected readonly config: AgentConfig;
  protected lastSignal?: TradeSignal;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  get id(): string {
    return this.config.id;
  }

  get symbolUniverse(): string[] {
    return this.config.symbolUniverse;
  }

  abstract onBar(bar: MarketBar, context: AgentContext): TradeSignal | undefined;

  protected clampSizePct(sizePct: number): number {
    const maxPct = this.config.maxPositionPct ?? 0.2;
    return Math.min(Math.max(sizePct, 0), maxPct);
  }
}
