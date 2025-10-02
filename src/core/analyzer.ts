import { AnalyzerStrategy, AnalysisResult } from "../types/analysis";
import { HardcodedStrategy } from "../strategies/HardcodedStrategy";

export class Analyzer {
    private strategy: AnalyzerStrategy;

    constructor(strategy?: AnalyzerStrategy) {
        this.strategy = strategy || new HardcodedStrategy();
    }

    run(content: string, filePath: string): AnalysisResult {
        return this.strategy.analyze(content, filePath);
    }
}

