import { PerformanceSeries } from '../models/performance-series';

export class Simulation {

    // private simulationNumber: number;
    private loopStopper = 0;
    // private loopMax = 10000;

    private weights: number[];
    private listOfSeries: PerformanceSeries[];

    data: number[];
    result: number[][];

    public constructor(weights: number[], listOfSeries: PerformanceSeries[]) {
        console.log('Constructing simulation object');
        this.weights = weights;
        this.listOfSeries = listOfSeries;
    }

    public startSimulation(): number[][] {
        console.log('Starting simulation with input: ' + JSON.stringify(this.weights));
        this.data = [this.listOfSeries.length];
        this.result = [];
        // this.simulationNumber = 0;

        const t0 = performance.now();

        this.recursiveRun(0);

        const t1 = performance.now();
        console.log('recursiveRun took ' + (t1 - t0) + ' milliseconds.');

        return this.result;
    }

    private recursiveRun(depth: number): number[] {
        this.loopStopper ++;

        const maxLoopNumber = Math.pow(this.weights.length, this.listOfSeries.length + 1);
        if (this.loopStopper > maxLoopNumber) {
            console.log('Loop has been stopped, too many loops! Max is ' + maxLoopNumber);
            return null;
        }

        for (let weight = 0; weight < this.weights.length; weight++) {
            this.data[depth] = this.weights[weight];
            // console.log('Depth: ' + depth);
            // console.log('Weight: ' + weight);
            if (depth === this.listOfSeries.length - 1) {
                this.result.push(this.data);
                // this.simulationNumber++;
                // console.log('Simulation number: ' + this.simulationNumber);
                // console.log('Result: ' + JSON.stringify(this.result));
                this.data = [...this.data];
            } else {
                this.recursiveRun(depth + 1); // go deeper
            }
        }

        // console.log('Winding up');
    }

}
