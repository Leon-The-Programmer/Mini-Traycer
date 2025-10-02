import { AnalysisResult } from "../types/analysis";

export function formatResult(result: AnalysisResult): string {
    if (result.issues.length === 0) {
        return `${result.filePath} has no issues.`;
    }

    return `${result.filePath} issue:\n - ${result.issues.join("\n - ")}`;
    
}