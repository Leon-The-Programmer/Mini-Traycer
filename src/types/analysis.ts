export interface AnalysisResult {
    filePath: string;
    issues: string[];
}

export interface AnalyzerStrategy {
    analyze(content: string, filePath: string) : AnalysisResult;
}