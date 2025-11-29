import { EventEmitter } from 'events';
import { MarketBar, SymbolTicker } from '../types';

export class BarIngestor extends EventEmitter {
  private readonly universe: SymbolTicker[];
  private timer?: NodeJS.Timeout;

  constructor(universe: SymbolTicker[]) {
    super();
    this.universe = universe;
  }

  start(mockIntervalMs = 2_000): void {
    this.stop();
    this.timer = setInterval(() => this.emitMockBar(), mockIntervalMs);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private emitMockBar(): void {
    const now = Date.now();
    this.universe.forEach((symbol) => {
      const base = 100 + Math.random() * 10;
      const high = base + Math.random();
      const low = base - Math.random();
      const close = low + Math.random() * (high - low);
      const bar: MarketBar = {
        symbol,
        timestamp: now,
        open: base,
        high,
        low,
        close,
        volume: Math.random() * 1000,
      };
      this.emit('bar', bar);
    });
  }
}
