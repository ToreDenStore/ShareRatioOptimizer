export class PerformanceSeries {
    ticker: string;
    stDev: number;
    return: number;
    sharpeRatio: number;
    dateFrom: Date;
    dateTo: Date;
    performanceSeries: PerformancePoint[];
}

export class PerformancePoint {
    date: Date;
    performance: number;
}
