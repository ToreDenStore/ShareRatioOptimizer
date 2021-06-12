import { PerformanceSeries } from '../models/performance-series';
import { PortfolioCalculation, PortfolioHolding } from '../models/portfolio-calculation';
import { CalculatorUtils } from './calculatorUtils';

export class Simulation {

    // Recursive variables
    private simulationNumber: number;
    private loopStopper = 0;
    private data: number[];

    // Static
    public weights = [0.001, 1, 2, 3, 4, 5, 6, 7, 9, 10, 15, 20, 50]; // 5 is middle

    // Inputs
    private listOfSeries: PerformanceSeries[];
    private riskFree: number;

    // Outputs
    maxSharpeCalculation: PortfolioCalculation;
    minStdevCalculation: PortfolioCalculation;
    plotData: number[][];

    public constructor(listOfSeries: PerformanceSeries[], riskFree: number) {
        this.listOfSeries = listOfSeries;
        this.riskFree = riskFree;
    }

    public startSimulation(): void {
        console.log('Starting simulation with input: ' + JSON.stringify(this.weights));

        this.data = [this.listOfSeries.length];

        // Initialize array of plotData
        if (this.listOfSeries.length === 3) {
            this.plotData = new Array(this.weights.length);
            for (let index = 0; index < this.weights.length; index++) {
                this.plotData[index] = new Array(this.weights.length);
            }
        } else {
            this.plotData = [];
        }

        this.simulationNumber = 0;
        const t0 = performance.now();
        this.recursiveRun(0);
        const t1 = performance.now();
        console.log('recursiveRun took ' + (t1 - t0) + ' milliseconds.');
        console.log('Number of simulations completed: ' + this.simulationNumber);
        console.log('Average simulation time: ' + (t1 - t0) / this.simulationNumber + ' milliseconds.');
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

        const calculation = CalculatorUtils.runPortfolioCalculation(holdings, this.riskFree);

        if (this.maxSharpeCalculation === undefined || calculation.sharpeRatio > this.maxSharpeCalculation.sharpeRatio) {
            this.maxSharpeCalculation = {...calculation}; // Shallow copy
        }
        if (this.minStdevCalculation === undefined || calculation.stDev < this.minStdevCalculation.stDev) {
            this.minStdevCalculation = {...calculation}; // Shallow copy
        }

        // Create line plot
        if (this.listOfSeries.length === 2) {
            const weightRatio = holdingWeights[0] / (holdingWeights[0] + holdingWeights[1]);
            this.plotData.push([
                weightRatio, calculation.sharpeRatio
            ]);
        }

        // Create surface plot
        if (this.listOfSeries.length === 3) {
            const xIndex = this.weights.indexOf(holdingWeights[0]);
            const yIndex = this.weights.indexOf(holdingWeights[1]);
            if (holdingWeights[2] === 5) {
                this.plotData[xIndex][yIndex] = calculation.sharpeRatio;
            }
        }
    }


}
