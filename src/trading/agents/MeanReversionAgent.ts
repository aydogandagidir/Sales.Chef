import { AgentContext, MarketBar, TradeSignal } from '../types';
import { BaseAgent } from './BaseAgent';

interface MeanReversionState {
  window: number[];
  windowSize: number;
}

export class MeanReversionAgent extends BaseAgent {
  private readonly state: MeanReversionState;

  constructor(config: { windowSize?: number } & ConstructorParameters<typeof BaseAgent>[0]) {
    super(config);
    this.state = {
      window: [],
      windowSize: config.windowSize ?? 20,
    };
  }

  onBar(bar: MarketBar, context: AgentContext): TradeSignal | undefined {
    if (!this.symbolUniverse.includes(bar.symbol)) return undefined;

    this.state.window.push(bar.close);
    if (this.state.window.length > this.state.windowSize) {
      this.state.window.shift();
    }

    if (this.state.window.length < this.state.windowSize) return undefined;

    const avg = this.state.window.reduce((sum, price) => sum + price, 0) / this.state.window.length;
    const deviation = (bar.close - avg) / avg;

    if (Math.abs(deviation) < 0.002) return undefined;

    const intent: TradeSignal['intent'] = deviation < 0 ? 'buy' : 'sell';
    const confidence = Math.min(Math.abs(deviation) * 50, 1); // scaled
    const sizePct = this.clampSizePct(confidence * 0.1);

    this.lastSignal = {
      agentId: this.id,
      symbol: bar.symbol,
      confidence,
      intent,
      sizePct,
      note: `Mean reversion deviation ${deviation.toFixed(4)}`,
      issuedAt: bar.timestamp,
    };

    return this.lastSignal;
  }
}
