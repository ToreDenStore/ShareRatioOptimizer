import { PerformancePoint } from './performance-series';

export class PortfolioCalculation {
    sharpe: number;
    performance: number;
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
