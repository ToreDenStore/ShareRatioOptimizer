import { PerformanceSeries } from '../models/performance-series';
import { PortfolioCalculation, PortfolioHolding } from '../models/portfolio-calculation';
import { CalculatorUtils } from './calculatorUtils';

export class Simulation {

    private simulationNumber: number;
    private loopStopper = 0;
    private weights = [0.001, 1, 2, 3, 5, 10, 20, 50, 1000];

    private listOfSeries: PerformanceSeries[];

    data: number[];
    maxSharpeCalculation: PortfolioCalculation;
    minStdevCalculation: PortfolioCalculation;

    public constructor(listOfSeries: PerformanceSeries[]) {
        this.listOfSeries = listOfSeries;
    }

    public startSimulation(): PortfolioCalculation {
        console.log('Starting simulation with input: ' + JSON.stringify(this.weights));
        this.data = [this.listOfSeries.length];

        this.simulationNumber = 0;
        const t0 = performance.now();
        this.recursiveRun(0);
        const t1 = performance.now();
        console.log('recursiveRun took ' + (t1 - t0) + ' milliseconds.');
        console.log('Number of simulations completed: ' + this.simulationNumber);
        console.log('Average simulation time: ' + (t1 - t0) / this.simulationNumber + ' milliseconds.');

        return this.maxSharpeCalculation;
    }

    // Only recursion logic
    private recursiveRun(depth: number): number[] {

        this.loopStopper ++;
        const maxLoopNumber = Math.pow(this.weights.length, this.listOfSeries.length + 1);
        if (this.loopStopper > maxLoopNumber) {
            console.log('Loop has been stopped, too many loops! Max is ' + maxLoopNumber);
            return null;
        }

        this.weights.forEach(weight => {
            this.data[depth] = weight;
            if (depth === this.listOfSeries.length - 1) {
                this.runCalculation(this.data);
                this.data = [...this.data];
            } else {
                this.recursiveRun(depth + 1); // go deeper
            }
        });

        // console.log('Winding up');
    }

    private runCalculation(holdingWeights: number[]): void {
        this.simulationNumber++;
        const holdings: PortfolioHolding[] = [];

        for (let index = 0; index < this.listOfSeries.length; index++) {
            const performanceSerie = this.listOfSeries[index];
            const holding = new PortfolioHolding();
            holding.performanceSeries = performanceSerie.performanceSeries;
            holding.ticker = performanceSerie.ticker;
            holding.weight = holdingWeights[index];
            holdings.push(holding);
        }

        const calculation = CalculatorUtils.runPortfolioCalculation(holdings);

        if (this.maxSharpeCalculation === undefined || calculation.sharpeRatio > this.maxSharpeCalculation.sharpeRatio) {
            this.maxSharpeCalculation = calculation;
        }
        if (this.minStdevCalculation === undefined || calculation.stDev < this.minStdevCalculation.stDev) {
            this.minStdevCalculation = calculation;
        }
    }


}
