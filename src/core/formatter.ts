import { TaskBreakdown, Step } from "../types/analysis";

export function formatTaskBreakdown(breakdown: TaskBreakdown): string {
    const headerSep = "===========================================";
    const stepSep = "-------------------------------------------";

    const lines: string[] = [];

    lines.push(headerSep);
    lines.push("TASK BREAKDOWN");
    lines.push(headerSep);
    lines.push("");
    lines.push("");
    lines.push(`Task: ${breakdown.taskDescription}`);
    lines.push("");
    lines.push("");

    for (const step of breakdown.steps) {
        lines.push(stepSep);
        lines.push(`Step ${step.id}: ${step.title}`);
        lines.push(stepSep);
        lines.push(`Description: ${step.description}`);

        if (step.files && step.files.length > 0) {
            lines.push("Files:");
            for (const file of step.files) {
                lines.push(`  - ${file}`);
            }
        } else {
            lines.push("Files: None specified");
        }

        lines.push("");
        lines.push("");
    }

    lines.push(headerSep);

    return lines.join("\n");
}