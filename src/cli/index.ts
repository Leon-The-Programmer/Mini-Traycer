#!/usr/bin/env node
import { readFileSync } from "fs";
import { parseFile, Analyzer, formatResult } from "../core";

function main() {
    const filePath = process.argv[2];
    if (!filePath) {
        console.error("Usage: npm run start:cli <file>");
        process.exit(1);
    }

    const content = readFileSync(filePath, "utf-8");
    const parsed = parseFile(content);

    const analyzer = new Analyzer();
    const result = analyzer.run(parsed, filePath);

    console.log(formatResult(result));
}

main();

//console.log("Hello World! Mini Traycer is running.");