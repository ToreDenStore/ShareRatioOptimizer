import { PerformancePoint } from './performance-point';
import { VisualizableInGraph } from './visualizable-in-graph';

export class PortfolioCalculation implements VisualizableInGraph {
    name: string;
    stDev: number;
    performance: number;
    riskFree: number;
    sharpeRatio: number;
    performanceSeries: PerformancePoint[];
    holdingsData: PortfolioHolding[];
}

export class PortfolioHolding {
    weight: number;
    ticker: string;
    // dateFrom: Date; Use these later for more advanced calculations
    // dateTo: Date;
    performanceSeries: PerformancePoint[];
}
