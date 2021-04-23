import { PerformanceSeriesDb } from './../models/performance-series-db';
import { PerformanceSeries } from '../models/performance-series';

export class ModelDbConverter {

    public static convertToDbModel(performanceSeries: PerformanceSeries): PerformanceSeriesDb {
        const series = new PerformanceSeriesDb();
        series.ticker = performanceSeries.ticker;
        series.dateFrom = performanceSeries.dateFrom.getTime();
        series.dateTo = performanceSeries.dateTo.getTime();
        series.performanceSeries = [];
        performanceSeries.performanceSeries.forEach(element => {
            const entry = {
                date: element.date.getTime(),
                performance: element.performance
            };
            series.performanceSeries.push(entry);
        });
        return Object.assign({}, series); // Pure javascript object is needed to insert into firestore
    }

}
