import { PerformancePoint } from '../models/performance-series';
import { PortfolioCalculation, PortfolioHolding } from '../models/portfolio-calculation';
import { PerformanceUtils } from './performanceUtils';

export class CalculatorUtils {

    public static runPortfolioCalculation(holdings: PortfolioHolding[], riskFree: PerformancePoint[]): PortfolioCalculation {
        const days = holdings[0].performanceSeries.length;
        const performances: number[] = [];
        const performancePoints: PerformancePoint[] = [];

        this.normalizeStarterWeights(holdings);

        let holdingWeights: number[] = [];
        holdings.forEach(holding => {
            holdingWeights.push(holding.weight);
        });

        for (let index = 0; index < days; index++) {
            let portfolioPerformance = 0;
            for (let hIndex = 0; hIndex < holdings.length; hIndex++) {
                const holding = holdings[hIndex];
                portfolioPerformance += holding.performanceSeries[index].performance * holdingWeights[hIndex];
                // Recalculate holding weight
                holdingWeights[hIndex] = holdingWeights[hIndex] * (1 + holding.performanceSeries[index].performance);
            }
            holdingWeights = this.normalizeWeights(holdingWeights);

            // Remove risk-free interest rate
            portfolioPerformance -= riskFree[index].performance;

            performances.push(portfolioPerformance);

            const point: PerformancePoint = {
                date: holdings[0].performanceSeries[index].date,
                performance: portfolioPerformance
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

    public static normalizeWeights(holdingWeights: number[]): number[] {
        let totalWeight = 0;
        holdingWeights.forEach(weight => {
            totalWeight += weight;
        });
        for (let index = 0; index < holdingWeights.length; index++) {
            holdingWeights[index] *= (1 / totalWeight);
        }
        return holdingWeights;
    }

    public static normalizeStarterWeights(holdings: PortfolioHolding[]): void {
        let totalWeight = 0;
        holdings.forEach(holding => {
            totalWeight += holding.weight;
        });
        holdings.forEach(holding => {
            holding.weight *= (1 / totalWeight);
        });
    }
}
