import { AgentContext, MarketBar, TradeSignal } from '../types';
import { BaseAgent } from './BaseAgent';

interface MomentumState {
  highs: number[];
  lows: number[];
  lookback: number;
}

export class MomentumAgent extends BaseAgent {
  private readonly state: MomentumState;

  constructor(config: { lookback?: number } & ConstructorParameters<typeof BaseAgent>[0]) {
    super(config);
    this.state = {
      highs: [],
      lows: [],
      lookback: config.lookback ?? 30,
    };
  }

  onBar(bar: MarketBar, context: AgentContext): TradeSignal | undefined {
    if (!this.symbolUniverse.includes(bar.symbol)) return undefined;

    this.state.highs.push(bar.high);
    this.state.lows.push(bar.low);

    if (this.state.highs.length > this.state.lookback) this.state.highs.shift();
    if (this.state.lows.length > this.state.lookback) this.state.lows.shift();

    if (this.state.highs.length < this.state.lookback) return undefined;

    const breakoutHigh = Math.max(...this.state.highs);
    const breakdownLow = Math.min(...this.state.lows);

    const lastPosition = context.portfolio.positions[bar.symbol];
    const isLong = lastPosition?.size && lastPosition.size > 0;
    const isShort = lastPosition?.size && lastPosition.size < 0;

    let intent: TradeSignal['intent'] = 'hold';
    let note = 'Waiting';

    if (bar.close >= breakoutHigh && !isLong) {
      intent = 'buy';
      note = 'Breakout momentum';
    } else if (bar.close <= breakdownLow && !isShort) {
      intent = 'sell';
      note = 'Breakdown momentum';
    }

    if (intent === 'hold') return undefined;

    const confidence = 0.7;
    const sizePct = this.clampSizePct(0.1);

    this.lastSignal = {
      agentId: this.id,
      symbol: bar.symbol,
      confidence,
      intent,
      sizePct,
      note,
      issuedAt: bar.timestamp,
    };

    return this.lastSignal;
  }
}
