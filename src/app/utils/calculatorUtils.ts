import { max, sum } from 'mathjs';
import { PerformancePoint, PerformanceSeries } from '../models/performance-series';
import { PortfolioCalculation, PortfolioHolding } from '../models/portfolio-calculation';
import { PerformanceUtils } from './performanceUtils';

export class CalculatorUtils {

    // private static loopStopper = 0;
    // private static loopStop = 25000;

    // public static optimizeSharpe(listOfSeries: PerformanceSeries[]): PortfolioCalculation {
    //     const weights: number[] = [0.001, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 100, 1000];
    //     const calculations: PortfolioCalculation[] = [];
    //     let calculation: PortfolioCalculation;
    //     let maxSharpe = -99;

    //     const numberOfWeights = weights.length;
    //     const numberOfSeries = listOfSeries.length;
    //     const numberOfSimulations = Math.pow(numberOfWeights, numberOfSeries);
    //     console.log('Number of simulations: ' + numberOfSimulations);

    //     if (listOfSeries.length === 3) {
    //         console.log('Optimizing...');

    //         for (let i = 0; i < weights.length; i++) {
    //             for (let j = 0; j < weights.length; j++) {
    //                 const sumWeights = weights[i] + weights[j] + 1;

    //                 const weight1 = weights[i] / sumWeights;
    //                 const weight2 = weights[j] / sumWeights;
    //                 const weight3 = 1 / sumWeights;

    //                 const holdings: PortfolioHolding[] = [];
    //                 for (let index = 0; index < listOfSeries.length; index++) {
    //                     const performanceSerie = listOfSeries[index];
    //                     const holding = new PortfolioHolding();
    //                     holding.performanceSeries = performanceSerie.performanceSeries;
    //                     holding.ticker = performanceSerie.ticker;
    //                     if (index === 0) {
    //                         holding.weight = weight1;
    //                     } else if (index === 1) {
    //                         holding.weight = weight2;
    //                     } else {
    //                         holding.weight = weight3;
    //                     }
    //                     holdings.push(holding);
    //                 }

    //                 const calculation = CalculatorUtils.runPortfolioCalculation(holdings);
    //                 console.log('Sharpe ratio for this calc: ' + calculation.sharpeRatio);

    //                 calculations.push(calculation);
    //                 if (calculation.sharpeRatio > maxSharpe) {
    //                     maxSharpe = calculation.sharpeRatio;
    //                 }
    //             }
    //         }

    //         calculation = calculations.find(x => {
    //             return x.sharpeRatio === maxSharpe;
    //         });
    //     } else {
    //         const run = new RecursiveRun();
    //         // run.calculations = calculations;
    //         run.listOfSeries = listOfSeries;
    //         run.weights = weights;
    //         run.indexToIncrement = 0;
    //         run.holdingWeights = [];
    //         listOfSeries.forEach(_ => {
    //             run.holdingWeights.push(0);
    //         });

    //         const result: RecursiveRun = this.doRecursiveRun(run);
    //         // console.log('Recursive run finished! Result has number of calculations: ' + result.calculations.length);
    //         // calculations = result.calculations;

    //         // calculations.forEach(calc => {
    //         //     if (calc.sharpeRatio > maxSharpe) {
    //         //         maxSharpe = calc.sharpeRatio;
    //         //     }
    //         // });

    //         maxSharpe = result.maxSharpe;

    //         console.log('Min stdev: ' + result.minStdev);

    //         calculation = result.calculationMaxSharpe;
    //     }

    //     console.log('Best sharpe: ' + maxSharpe);

    //     // console.log('Best calc: ' + JSON.stringify(bestCalc));

    //     return calculation;
    // }

    // TODO: Need to create an array of holding arrays by not hitting the recursive depth limit.
    // Go back up the call stack instead of setting index to 0 and continuing
    // private static doRecursiveRun(recursiveRun: RecursiveRun): RecursiveRun
    // {
    //     CalculatorUtils.loopStopper += 1;

    //     // console.log('Holdings weight array: ' + JSON.stringify(recursiveRun.holdingWeights));

    //     if (CalculatorUtils.loopStopper % 100 === 0) {
    //         console.log('Loop nr ' + CalculatorUtils.loopStopper);
    //     }

    //     if (CalculatorUtils.loopStopper > CalculatorUtils.loopStop) {
    //         console.log('Loop has been stopped, too many loops! Max is ' + CalculatorUtils.loopStop);
    //         return null;
    //     }

    //     // Increment holding weight array
    //     if (recursiveRun.holdingWeights[recursiveRun.indexToIncrement] === recursiveRun.weights.length) {
    //         // Increase higher index by 1
    //         recursiveRun.indexToIncrement += 1;
    //         recursiveRun.holdingWeights[recursiveRun.indexToIncrement] += 1;
    //         // Reset all lower indices
    //         for (let index = 0; index < recursiveRun.indexToIncrement; index++) {
    //             recursiveRun.holdingWeights[index] = 0;
    //         }
    //         this.doRecursiveRun(recursiveRun);
    //     }

    //     if (recursiveRun.indexToIncrement >= recursiveRun.listOfSeries.length) {
    //         // End loop
    //         console.log('Unwind!');
    //         return recursiveRun;
    //     }

    //     recursiveRun.indexToIncrement = 0;

    //     const holdings: PortfolioHolding[] = [];
    //     for (let index = 0; index < recursiveRun.listOfSeries.length; index++) {
    //         const performanceSerie = recursiveRun.listOfSeries[index];
    //         const holding = new PortfolioHolding();
    //         holding.performanceSeries = performanceSerie.performanceSeries;
    //         holding.ticker = performanceSerie.ticker;
    //         const weightArrayIndex = recursiveRun.holdingWeights[index];
    //         holding.weight = recursiveRun.weights[weightArrayIndex];
    //         holdings.push(holding);
    //     }

    //     const calculation = CalculatorUtils.runPortfolioCalculation(holdings);
    //     // console.log('Sharpe ratio for this calc: ' + calculation.sharpeRatio);

    //     // recursiveRun.calculations.push(calculation);

    //     // console.log('Run had ' + recursiveRun.calculations.length + ' number of calculations');

    //     if (calculation.sharpeRatio > recursiveRun.maxSharpe) {
    //         recursiveRun.maxSharpe = calculation.sharpeRatio;
    //         recursiveRun.calculationMaxSharpe = calculation;
    //         console.log('New max sharpe: ' + recursiveRun.maxSharpe);
    //     }

    //     if (calculation.stDev < recursiveRun.minStdev) {
    //         recursiveRun.minStdev = calculation.stDev;
    //         recursiveRun.calculationMinStdev = calculation;
    //         console.log('New min stdev: ' + recursiveRun.minStdev);
    //     }

    //     recursiveRun.holdingWeights[recursiveRun.indexToIncrement] += 1;

    //     return CalculatorUtils.doRecursiveRun(recursiveRun);
    // }

    public static runPortfolioCalculation(holdings: PortfolioHolding[]): PortfolioCalculation {
        const days = holdings[0].performanceSeries.length;
        const performances: number[] = [];
        const performancePoints: PerformancePoint[] = [];

        // Normalize weights
        let totalWeight = 0;
        holdings.forEach(holding => {
            totalWeight += holding.weight;
        });
        holdings.forEach(holding => {
            holding.weight *= (1 / totalWeight);
        });

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

// export class RecursiveRun {
//     calculationMaxSharpe: PortfolioCalculation;
//     calculationMinStdev: PortfolioCalculation;
//     maxSharpe = -99;
//     minStdev = 99;
//     weights: number[];
//     listOfSeries: PerformanceSeries[];
//     holdingWeights: number[];
//     indexToIncrement: number;
// }
