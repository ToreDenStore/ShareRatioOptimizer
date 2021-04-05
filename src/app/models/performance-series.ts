export class PerformanceSeries {
    ticker: string;
    dateFrom: Date;
    dateTo: Date;
    performanceSeries: PerformancePoint[];
}

export class PerformancePoint {
    date: Date;
    performance: number;
}
