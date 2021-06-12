import { PerformancePoint } from './performance-point';

export interface VisualizableInGraph {
    name: string;
    stDev: number;
    performance: number;
    riskFree: number;
    sharpeRatio: number;
    performanceSeries: PerformancePoint[];
}
