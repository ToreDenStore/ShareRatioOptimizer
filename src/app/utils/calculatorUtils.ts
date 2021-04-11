import { PerformancePoint } from '../models/performance-series';
import { PortfolioCalculation, PortfolioHolding } from '../models/portfolio-calculation';
import { PerformanceUtils } from './performanceUtils';

export class CalculatorUtils {

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
