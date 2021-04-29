import { PerformanceUtils } from './performanceUtils';
import { PerformanceSeriesDb } from './../models/performance-series-db';
import { PerformancePoint, PerformanceSeries } from '../models/performance-series';
import { ApiResponseHistoricalPrice } from '../models/api-response-historical-price';

export class ModelConverter {

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

    public static historicPricesToPerformance(
        ticker: string,
        dateFrom: Date,
        dateTo: Date,
        prices: ApiResponseHistoricalPrice
    ): PerformanceSeries {
        const filteredList = prices.prices.filter(x => {
            return x.type == null;
        });
        // console.log('Filtered list: ' + JSON.stringify(filteredList));
        const performances: PerformancePoint[] = [];
        const performancesNumbers: number[] = [];

        // List is sorted by latest date first
        for (let index = 0; index < filteredList.length - 1; index++) {
            const price = filteredList[index];
            const performancePoint: PerformancePoint = new PerformancePoint();
            performancePoint.date = new Date(price.date * 1000);
            performancePoint.performance = price.close / filteredList[index + 1].close - 1;
            performances.push(performancePoint);
            performancesNumbers.push(performancePoint.performance);
        }

        const performanceSeries = new PerformanceSeries();
        performanceSeries.dateFrom = dateFrom;
        performanceSeries.dateTo = dateTo;
        performanceSeries.ticker = ticker;
        performanceSeries.performanceSeries = performances;

        performanceSeries.return = PerformanceUtils.getTotalPerformance(performancesNumbers);
        performanceSeries.stDev = PerformanceUtils.getStandardDeviationAnnualized(performancesNumbers);
        performanceSeries.sharpeRatio = performanceSeries.return / performanceSeries.stDev;
        return performanceSeries;
    }

}
