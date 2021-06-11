import { PortfolioCalculation } from './../models/portfolio-calculation';
import { std } from 'mathjs';
import { PerformanceSeries } from '../models/performance-series';

export class PerformanceUtils {

    public static getTotalPerformance(performanceSeries: number[]): number {
        let totalPerformance = 1;
        performanceSeries.forEach(perf => {
            totalPerformance *= (perf + 1);
        });
        return totalPerformance - 1;
    }

    public static getStandardDeviationAnnualized(performanceSeries: number[]): number {
        return std(performanceSeries) * Math.sqrt(performanceSeries.length);
    }

    public static getSharpeRatioForPerformanceSeries(performanceSeries: PerformanceSeries): number {
        return (performanceSeries.return - performanceSeries.riskFree) / performanceSeries.stDev;
    }

    public static getSharpeRatioForCalc(calc: PortfolioCalculation): number {
        return (calc.performance - calc.riskFree) / calc.stDev;
    }

    // Need to be reversed
    public static getAccumulatedPerformance(performanceSeries: number[]): number[] {
        const accumulatedPerformance = [];
        accumulatedPerformance.push(0); // Initial
        for (let index = 0; index < performanceSeries.length; index++) {
            const dailyPerf = performanceSeries[index];
            const previousDayAccPerf = accumulatedPerformance[index];
            accumulatedPerformance.push(
                (previousDayAccPerf + 1) * (dailyPerf + 1) - 1
            );
        }
        return accumulatedPerformance;
    }

}
