import { Task, TaskType } from "../types/analysis";

/**
 * Classifies a task description and extracts scope/requirements.
 * @param description The user-provided task description
 * @returns Task object
 */
export function parseTask(description: string): Task {
    const lower = description.toLowerCase();
    let type: TaskType = TaskType.OTHER;
    // Classify type
    if (/\b(create|read|update|delete|crud)\b/.test(lower)) {
        type = TaskType.CRUD;
    } else if (/auth(entication)?|login|logout|register|signup|signin/.test(lower)) {
        type = TaskType.AUTHENTICATION;
    } else if (/refactor|restructure|clean up|improve code/.test(lower)) {
        type = TaskType.REFACTOR;
    } else if (/feature|add|implement|support|enhance/.test(lower)) {
        type = TaskType.FEATURE;
    } else if (/bug|fix|error|issue|defect|patch/.test(lower)) {
        type = TaskType.BUGFIX;
    }

    // Extract scope: look for words after 'in', 'for', 'to', or code entities
    let scope = "";
    const scopeMatch = description.match(/(?:in|for|to) ([\w\s./-]+)/i);
    if (scopeMatch) {
        scope = scopeMatch[1].trim();
    } else {
        // Fallback: try to extract code entity (e.g., function, file, class)
        const entityMatch = description.match(/(function|file|class|module|component) ([\w./-]+)/i);
        if (entityMatch) {
            scope = `${entityMatch[1]} ${entityMatch[2]}`;
        }
    }

    return {
        description,
        type,
        scope,
    };
}