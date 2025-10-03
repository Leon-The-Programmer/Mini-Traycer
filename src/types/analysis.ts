export enum TaskType {
    CRUD = "CRUD",
    AUTHENTICATION = "AUTHENTICATION",
    REFACTOR = "REFACTOR",
    FEATURE = "FEATURE",
    BUGFIX = "BUGFIX",
    OTHER = "OTHER",
}

export interface Task {
    /**
     * The raw user input describing what they want to accomplish
     */
    description: string;

    /**
     * The categorized type of task
     */
    type: TaskType;

    /**
     * The extracted scope/area of the codebase affected
     */
    scope: string;
}

export interface Step {
    /**
     * Sequential step identifier (1, 2, 3, etc.)
     */
    id: number;

    /**
     * Short, actionable title for the step
     */
    title: string;

    /**
     * Detailed explanation of what needs to be done
     */
    description: string;

    /**
     * Array of file paths that will be created or modified in this step
     */
    files: string[];
}

export interface TaskBreakdown {
    /**
     * The original task description from the user
     */
    taskDescription: string;

    /**
     * Array of Step objects representing the breakdown
     */
    steps: Step[];
}

export interface AnalyzerStrategy {
    /**
     * Analyze a Task and produce a TaskBreakdown describing actionable steps.
     */
    analyze(task: Task): TaskBreakdown;
}