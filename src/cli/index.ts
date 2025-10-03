#!/usr/bin/env node
import { parseTask, Analyzer, formatTaskBreakdown } from "../core";

function main() {
    const taskDescription = process.argv.slice(2).join(" ");
    if (!taskDescription || taskDescription.trim() === "") {
        console.error("Usage: npm run start:cli <task description>");
        console.error("Example: npm run start:cli \"Add authentication to the app\"");
        process.exit(1);
    }

    try {
        const task = parseTask(taskDescription);
        const analyzer = new Analyzer();
        const breakdown = analyzer.run(task);
        console.log(formatTaskBreakdown(breakdown));
    } catch (error: any) {
        console.error("Error:", error.message || error);
        process.exit(1);
    }
}

main();
//console.log("Hello World! Mini Traycer is running.");