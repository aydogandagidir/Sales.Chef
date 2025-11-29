import { BaseAgent } from './agents/BaseAgent';
import { RiskManager } from './risk/RiskManager';
import { PaperExchange } from './exchange/PaperExchange';
import { AgentContext, ExecutionReport, MarketBar, OrderRequest, PortfolioSnapshot, TradeSignal } from './types';

export interface OrchestratorConfig {
  agents: BaseAgent[];
  exchange: PaperExchange;
  riskManager?: RiskManager;
  defaultOrderSize?: number;
}

export class Orchestrator {
  private readonly agents: BaseAgent[];
  private readonly exchange: PaperExchange;
  private readonly riskManager: RiskManager;
  private readonly defaultOrderSize: number;
  private readonly executions: ExecutionReport[] = [];

  constructor(config: OrchestratorConfig) {
    this.agents = config.agents;
    this.exchange = config.exchange;
    this.riskManager = config.riskManager ?? new RiskManager();
    this.defaultOrderSize = config.defaultOrderSize ?? 0.01;
  }

  get portfolio(): PortfolioSnapshot {
    return this.exchange.snapshot;
  }

  get executionLog(): ExecutionReport[] {
    return this.executions;
  }

  handleBar(bar: MarketBar): void {
    const snapshot = this.exchange.snapshot;
    this.exchange.markToMarket(bar.symbol, bar.close);

    this.agents.forEach((agent) => {
      const context: AgentContext = { portfolio: snapshot, lastBar: bar };
      const signal = agent.onBar(bar, context);
      if (!signal) return;

      if (!this.riskManager.approveSignal(signal, snapshot)) return;

      const order = this.signalToOrder(signal, bar.close);
      const execution = this.exchange.processOrder(order, bar.close);
      this.riskManager.applyExecution(execution, snapshot);
      this.executions.push(execution);
    });
  }

  private signalToOrder(signal: TradeSignal, markPrice: number): OrderRequest {
    const side = signal.intent === 'buy' ? 'buy' : 'sell';
    const notional = signal.sizePct * this.portfolio.equity;
    const size = Math.max(notional / markPrice, this.defaultOrderSize);

    return {
      symbol: signal.symbol,
      side,
      size,
      type: 'market',
      agentId: signal.agentId,
    };
  }
}
