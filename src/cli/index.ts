#!/usr/bin/env node

//   CLI entry point for Mini-Traycer.
//   Supports both hardcoded templates and AI-powered planning using Groq.
  
//   CLI Commands:
//   Hardcoded: `npm run start:cli "Add authentication"`.
//   LLM: `ANALYZER_STRATEGY=LLM` then followed by `npm run start:cli "Add authentication"`.

import { parseTask, Analyzer, formatTaskBreakdown } from "../core";
import { LLMStrategy } from "../strategies/LLMStrategy";
import { HardcodedStrategy } from "../strategies/HardcodedStrategy";
import * as dotenv from "dotenv";

// Load environment variables from .env file (if it exists).
dotenv.config();

//   Main CLI function that:
//   1. Parses command-line arguments
//   2. Selects strategy based on ANALYZER_STRATEGY env var
//   3. Analyzes the task
//   4. Formats and displays the breakdown

async function main() {
    // Step 1: Extract task description from command-line arguments,
    // And Join all arguments to support multi-word descriptions.
    const taskDescription = process.argv.slice(2).join(" ");

    // Step 2: Validate that a task description was provided.
    if (!taskDescription || taskDescription.trim() === "") {
        console.error("Usage: npm run start:cli <task description>");
        console.error("Example: npm run start:cli \"Add authentication to the app\"");
        console.error("");
        console.error("To use AI-powered planning:");
        console.error("  ANALYZER_STRATEGY=LLM npm run start:cli \"your task\"");
        process.exit(1);
    }

    try {
        // Step 3: Parse the task description into structured Task object.
        const task = parseTask(taskDescription);

        // Step 4: Select strategy based on environment variable.
        // Default to "Hardcoded" if ANALYZER_STRATEGY is not set.
        const strategyType = process.env.ANALYZER_STRATEGY || "Hardcoded";
        let strategy;

        if (strategyType === "LLM") {
            console.log("Using LLM strategy (Groq API)...");
            strategy = new LLMStrategy();
        } else {
            console.log("Using Hardcoded strategy (templates)...");
            strategy = new HardcodedStrategy();
        }

        // Step 5: Create analyzer with selected strategy.
        const analyzer = new Analyzer(strategy);

        // Step 6: Run analysis (await handles both sync and async strategies).
        const breakdown = await analyzer.run(task);

        // Step 7: Format and display the breakdown
        console.log(formatTaskBreakdown(breakdown));
    } catch (error: any) {
        console.error("Error:", error.message || error);
        
        // Provide specific guidance for common LLM errors.
        if (error.message && (error.message.includes("Groq") || error.message.includes("API key"))) {
            console.error("");
            console.error("Tip: Make sure you have set GROQ_API_KEY in your .env file.");
        }

        process.exit(1);
    }
}

// Execute main function and handle any uncaught errors
main().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
});
//console.log("Hello World! Mini Traycer is running.");