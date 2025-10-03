import { AnalyzerStrategy, Task, TaskBreakdown } from "../types/analysis";
import { HardcodedStrategy } from "../strategies/HardcodedStrategy";

export class Analyzer {
    private strategy: AnalyzerStrategy;

    constructor(strategy?: AnalyzerStrategy) {
        this.strategy = strategy || new HardcodedStrategy();
    }

    run(task: Task): TaskBreakdown {
        return this.strategy.analyze(task);
    }
}

