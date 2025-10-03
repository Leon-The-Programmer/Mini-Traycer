import { AnalyzerStrategy, Task, TaskBreakdown } from "../types/analysis";
import { HardcodedStrategy } from "../strategies/HardcodedStrategy";

export class Analyzer {
    private strategy: AnalyzerStrategy;

    constructor(strategy?: AnalyzerStrategy) {
        this.strategy = strategy || new HardcodedStrategy();
    }

    /**
     * Run the analyzer on a task.
     * Returns either a TaskBreakdown (sync) or Promise<TaskBreakdown> (async) depending on the strategy.
     * 
     * For HardcodedStrategy: returns TaskBreakdown immediately (synchronous)
     * For LLMStrategy: returns Promise<TaskBreakdown> (asynchronous)
     * 
     * Usage:
     *   // Synchronous (HardcodedStrategy)
     *   const breakdown = analyzer.run(task);
     *   
     *   // Asynchronous (LLMStrategy)
     *   const breakdown = await analyzer.run(task);
     * 
     * @param task - The task to analyze
     * @returns TaskBreakdown or Promise<TaskBreakdown>
     */
    run(task: Task): TaskBreakdown | Promise<TaskBreakdown> {
        // Delegate to the strategy's analyze method
        // The return type is automatically handled by TypeScript's union type
        return this.strategy.analyze(task);
    }

    /**
     * Run the analyzer asynchronously (always returns a Promise).
     * This method wraps the result in a Promise for consistent async handling.
     * Useful when you want to always use async/await syntax regardless of strategy.
     * 
     * Usage:
     *   const breakdown = await analyzer.runAsync(task);
     * 
     * @param task - The task to analyze
     * @returns Promise<TaskBreakdown>
     */
    async runAsync(task: Task): Promise<TaskBreakdown> {
        // Promise.resolve() wraps both sync and async results in a Promise..
        return Promise.resolve(this.strategy.analyze(task));
    }
}

