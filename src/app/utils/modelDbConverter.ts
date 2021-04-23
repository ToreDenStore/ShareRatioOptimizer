import { PerformanceUtils } from './performanceUtils';
import { PerformanceSeriesDb } from './../models/performance-series-db';
import { PerformancePoint, PerformanceSeries } from '../models/performance-series';

export class ModelDbConverter {

    public static convertToDbModel(guiModel: PerformanceSeries): PerformanceSeriesDb {
        const dbModel = new PerformanceSeriesDb();
        dbModel.ticker = guiModel.ticker;
        dbModel.dateFrom = guiModel.dateFrom.getTime();
        dbModel.dateTo = guiModel.dateTo.getTime();
        dbModel.performanceSeries = [];
        guiModel.performanceSeries.forEach(element => {
            const entry = {
                date: element.date.getTime(),
                performance: element.performance
            };
            dbModel.performanceSeries.push(entry);
        });
        return Object.assign({}, dbModel); // Pure javascript object is needed to insert into firestore
    }

    public static convertToGUIModel(dbModel: PerformanceSeriesDb): PerformanceSeries {
        // console.log('Converting ' + JSON.stringify(dbModel));
        const guiModel = new PerformanceSeries();
        guiModel.dateFrom = new Date(dbModel.dateFrom);
        guiModel.dateTo = new Date(dbModel.dateTo);
        guiModel.ticker = dbModel.ticker;
        guiModel.performanceSeries = [];
        const performanceSeriesNumbers = [];
        dbModel.performanceSeries.forEach(dbElement => {
            const guiElement = new PerformancePoint();
            guiElement.date = new Date(dbElement.date);
            guiElement.performance = dbElement.performance;
            guiModel.performanceSeries.push(guiElement);
            performanceSeriesNumbers.push(dbElement.performance);
        });
        guiModel.return = PerformanceUtils.getTotalPerformance(performanceSeriesNumbers);
        guiModel.stDev = PerformanceUtils.getStandardDeviationAnnualized(performanceSeriesNumbers);
        guiModel.sharpeRatio = guiModel.return / guiModel.stDev;
        return guiModel;
    }

}
