import { PerformancePoint } from './performance-point';

export class PerformanceSeries {
    ticker: string;
    stDev: number;
    return: number;
    riskFree: number;
    sharpeRatio: number;
    dateFrom: Date;
    dateTo: Date;
    performanceSeries: PerformancePoint[];
}
