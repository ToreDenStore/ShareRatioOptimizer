import { PerformancePoint } from './performance-point';

export class PortfolioCalculation {
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
