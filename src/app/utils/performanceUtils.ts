import { std } from 'mathjs';

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

}
