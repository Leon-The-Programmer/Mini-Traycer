import { AnalyzerStrategy, AnalysisResult } from "../types/analysis";

export class HardcodedStrategy implements AnalyzerStrategy {
    analyze(content: string, filePath: string): AnalysisResult {
        const issues: string[] = [];

        const lines = content.split("\n");
        lines.forEach((line, index) => {
            if (line.includes("TODO")) {
                issues.push(`Line ${index + 1}: Found TODO comment`);
            }

            if (line.includes('function')) {
                issues.push(`Line ${index + 1}: Function definition detected`);
            }
        });

        return { filePath, issues };
    }
}