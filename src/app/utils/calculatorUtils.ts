import { PerformancePoint, PerformanceSeries } from '../models/performance-series';
import { PortfolioCalculation, PortfolioHolding } from '../models/portfolio-calculation';
import { PerformanceUtils } from './performanceUtils';

export class CalculatorUtils {

    public static optimizeSharpe(listOfSeries: PerformanceSeries[]): PortfolioCalculation {
        const weights: number[] = [0.01, 0.1, 0.2, 0.5, 1, 2, 5, 10, 100];
        const calculations: PortfolioCalculation[] = [];
        let maxSharpe = -99;

        if (listOfSeries.length === 3) {
            console.log('Optimizing...');

            for (let i = 0; i < weights.length; i++) {
                for (let j = 0; j < weights.length; j++) {
                    const sumWeights = weights[i] + weights[j] + 1;

                    const weight1 = weights[i] / sumWeights;
                    const weight2 = weights[j] / sumWeights;
                    const weight3 = 1 / sumWeights;

                    const holdings: PortfolioHolding[] = [];
                    for (let index = 0; index < listOfSeries.length; index++) {
                        const performanceSerie = listOfSeries[index];
                        const holding = new PortfolioHolding();
                        holding.performanceSeries = performanceSerie.performanceSeries;
                        holding.ticker = performanceSerie.ticker;
                        if (index === 0) {
                            holding.weight = weight1;
                        } else if (index === 1) {
                            holding.weight = weight2;
                        } else {
                            holding.weight = weight3;
                        }
                        holdings.push(holding);
                    }

                    const calculation = CalculatorUtils.runPortfolioCalculation(holdings);
                    console.log('Sharpe ratio for this calc: ' + calculation.sharpeRatio);

                    calculations.push(calculation);
                    if (calculation.sharpeRatio > maxSharpe) {
                        maxSharpe = calculation.sharpeRatio;
                    }
                }
            }
        }

        console.log('Best sharpe: ' + maxSharpe);

        const bestCalc = calculations.find(x => {
            return x.sharpeRatio === maxSharpe;
        });

        // console.log('Best calc: ' + JSON.stringify(bestCalc));

        return bestCalc;
    }

    public static runPortfolioCalculation(holdings: PortfolioHolding[]): PortfolioCalculation {
        const days = holdings[0].performanceSeries.length;
        const performances: number[] = [];
        const performancePoints: PerformancePoint[] = [];

        for (let index = 0; index < days; index++) {
            let performance = 0;
            holdings.forEach(holding => {
                performance += holding.performanceSeries[index].performance * holding.weight;
            });
            performances.push(performance);

            const point: PerformancePoint = {
                date: holdings[0].performanceSeries[index].date,
                performance
            };
            performancePoints.push(point);
        }

        const calculation = new PortfolioCalculation();
        calculation.holdingsData = holdings;
        calculation.performanceSeries = performancePoints;
        calculation.performance = PerformanceUtils.getTotalPerformance(performances);
        calculation.stDev = PerformanceUtils.getStandardDeviationAnnualized(performances);
        calculation.sharpeRatio = calculation.performance / calculation.stDev;

        return calculation;
    }
}
