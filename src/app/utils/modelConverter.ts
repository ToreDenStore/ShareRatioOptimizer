import { RiskFreeNumbers } from './riskFreeNumbers';
import { PerformanceUtils } from './performanceUtils';
import { PerformanceSeriesDb } from '../models/performance-series-db';
import { PerformanceSeries } from '../models/performance-series';
import { ApiResponseHistoricalPrice } from '../models/api-response-historical-price';
import { Price } from '../models/price';
import { PerformancePoint } from '../models/performance-point';

export class ModelConverter {

    public static convertToDbModel(guiModel: PerformanceSeries): PerformanceSeriesDb {
        const dbModel = new PerformanceSeriesDb();
        dbModel.ticker = guiModel.ticker.toUpperCase();
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
        guiModel.ticker = dbModel.ticker.toUpperCase();
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
        guiModel.riskFree = RiskFreeNumbers.TBILL1MONTH2020;
        guiModel.sharpeRatio = PerformanceUtils.getSharpeRatioForPerformanceSeries(guiModel);
        return guiModel;
    }

    public static apiPriceToPrice(input: ApiResponseHistoricalPrice): Price[] {
        const prices: Price[] = [];
        const filteredList = input.prices.filter(x => {
            return x.type == null;
        });
        filteredList.forEach(apiPrice => {
            const price: Price = {
                date: new Date(apiPrice.date / 1000),
                open: apiPrice.open,
                close: apiPrice.close,
                low: apiPrice.low,
                high: apiPrice.high
            };
            prices.push(price);
        });
        return prices;
    }

    public static historicPricesToPerformance(
        ticker: string,
        dateFrom: Date,
        dateTo: Date,
        prices: Price[]
    ): PerformanceSeries {
        const performances: PerformancePoint[] = [];
        const performancesNumbers: number[] = [];

        // List is sorted by latest date first
        for (let index = 0; index < prices.length - 1; index++) {
            const price = prices[index];
            const performancePoint: PerformancePoint = new PerformancePoint();
            performancePoint.date = price.date;
            performancePoint.performance = price.close / prices[index + 1].close - 1;
            performances.push(performancePoint);
            performancesNumbers.push(performancePoint.performance);
        }

        const performanceSeries = new PerformanceSeries();
        performanceSeries.dateFrom = dateFrom;
        performanceSeries.dateTo = dateTo;
        performanceSeries.ticker = ticker;
        performanceSeries.riskFree = RiskFreeNumbers.TBILL1MONTH2020;
        performanceSeries.performanceSeries = performances;

        performanceSeries.return = PerformanceUtils.getTotalPerformance(performancesNumbers);
        performanceSeries.stDev = PerformanceUtils.getStandardDeviationAnnualized(performancesNumbers);
        performanceSeries.sharpeRatio = PerformanceUtils.getSharpeRatioForPerformanceSeries(performanceSeries);
        return performanceSeries;
    }

}
