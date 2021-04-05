export class PerformanceSeries {
    ticker: string;
    stDev: number;
    dateFrom: Date;
    dateTo: Date;
    performanceSeries: PerformancePoint[];
}

export class PerformancePoint {
    date: Date;
    performance: number;
}
