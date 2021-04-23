export class PerformanceSeriesDb {
    ticker: string;
    dateFrom: number;
    dateTo: number;
    performanceSeries: {date: number, performance: number}[];
}
