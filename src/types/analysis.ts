// This is the shared type contract that every other module relies on.

export enum TaskType {
    CRUD = "CRUD",
    AUTHENTICATION = "AUTHENTICATION",
    REFACTOR = "REFACTOR",
    FEATURE = "FEATURE",
    BUGFIX = "BUGFIX",
    OTHER = "OTHER",
}

export interface Task {
    // The raw user input describing what they want to accomplish.
    description: string;

    // The categorized type of task.
    type: TaskType;

    // The extracted scope/area of the codebase affected.
    scope: string;
}

export interface Step {
    // Sequential step identifier (Step 1, 2, 3, and so on).
    id: number;

    // Title for each step.
    title: string;

    // Detailed explanation of what needs to be done.
    description: string;

    // Array of file paths that will be created or modified in this step.
    files: string[];
}

// The original task description from the user.
// Array of Step objects representing the breakdown.
export interface TaskBreakdown {
    taskDescription: string;
    steps: Step[];
}

/**
 * AnalyzerStrategy interface for pluggable task analysis strategies.
 *
 * The analyze method may be synchronous (returns TaskBreakdown) or asynchronous (returns Promise<TaskBreakdown>).
 * This allows both template-based and LLM-based strategies to conform to the same interface.
 */
export interface AnalyzerStrategy {
    /**
     * Analyze a Task and produce a TaskBreakdown describing actionable steps.
     * May return TaskBreakdown (sync) or Promise<TaskBreakdown> (async).
     */
    analyze(task: Task): TaskBreakdown | Promise<TaskBreakdown>;
}