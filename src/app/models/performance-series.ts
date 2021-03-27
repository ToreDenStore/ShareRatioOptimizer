export class PerformanceSeries {
    ticker: string;
    dateFrom: Date;
    dateTo: Date;
    performanceSeries: Performance[];
}

export class Performance {
    date: Date;
    performance: number;
}
