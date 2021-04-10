import { PerformanceSeries } from "../models/performance-series";

export class Simulation {

    private loopStopper = 0;
    private loopMax = 100;

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
        this.recursiveRun(0);
        return this.result;
    }

    private recursiveRun(depth: number): number[] {
        console.log('Start recursive run with data ' + JSON.stringify(this.data));

        this.loopStopper ++;

        if (this.loopStopper > this.loopMax) {
            console.log('Loop has been stopped, too many loops! Max is ' + this.loopMax);
            return null;
        }

        // if (columnNumber >= holdingWeights.length) {
        //     console.log('Loop finished');
        //     return holdingWeights;
        // }

        // if (this.result[columnNumber].length === holdingWeights.length) {
        //     return holdingWeights; // Jump up one level
        // }

        // if () {

        // }

        for (let weight = 0; weight < this.weights.length; weight++) {
            // const depth = this.data.length;
            this.data[depth] = weight;
            console.log('Data: ' + JSON.stringify(this.data));
            console.log('Depth: ' + depth);
            console.log('Weight: ' + weight);
            if (depth === this.listOfSeries.length - 1) {
                this.result.push(this.data);
                console.log('Result: ' + JSON.stringify(this.result));
                this.data = [...this.data];
            } else {
                this.recursiveRun(depth + 1); // go deeper
            }

            console.log('End loop depth ' + depth);
        }

        console.log('Winding up');
    }

}
