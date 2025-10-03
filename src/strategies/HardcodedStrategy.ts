import { Task, TaskBreakdown, Step, TaskType, AnalyzerStrategy } from "../types/analysis";

/**
 * A Rule-Based strategy that maps task types to predefined step templates.
 * Picks the template based on the task type and fills in scope details.
 * Falls back to generic (OTHER) steps if scope is missing.
*/

export class HardcodedStrategy implements AnalyzerStrategy {
    analyze(task: Task): TaskBreakdown | Promise<TaskBreakdown> {
        const type = task.type || TaskType.OTHER;
        let steps: Step[] = [];

        switch (type) {
            case TaskType.CRUD:
                steps = this.generateCRUDSteps(task);
                break;
            case TaskType.AUTHENTICATION:
                steps = this.generateAuthSteps(task);
                break;
            case TaskType.REFACTOR:
                steps = this.generateRefactorSteps(task);
                break;
            case TaskType.FEATURE:
                steps = this.generateFeatureSteps(task);
                break;
            case TaskType.BUGFIX:
                steps = this.generateBugfixSteps(task);
                break;
            case TaskType.OTHER:
            default:
                steps = this.generateOtherSteps(task);
                break;
        }

        return {
            taskDescription: task.description,
            steps,
        };
    }

    private generateCRUDSteps(task: Task): Step[] {
        const raw = task.scope || "item";
        const scope = this.sanitizeScope(raw);
        const modelFile = `src/models/${scope}.ts`;
        const controllerFile = `src/controllers/${scope}Controller.ts`;
        const routesFile = `src/routes/${scope}Routes.ts`;
        const validatorFile = `src/validators/${scope}Validator.ts`;
        const testFile = `tests/${scope}.test.ts`;
        const docsFile = `docs/api/${scope}.md`;

        const steps: Step[] = [
            {
                id: 1,
                title: `Create ${raw} data model`,
                description: `Define the ${raw} data model/entity with required fields and types based on the task scope. Include timestamps, relations, and validation decorators if applicable.`,
                files: [modelFile],
            },
            {
                id: 2,
                title: `Create ${raw} controller with CRUD operations`,
                description: `Implement controller logic for Create, Read, Update and Delete operations for ${raw}. Ensure proper layering (service/controller) if your architecture expects it.`,
                files: [controllerFile],
            },
            {
                id: 3,
                title: `Define API routes for ${raw}`,
                description: `Add RESTful routes for creating, listing, retrieving, updating, and deleting ${raw} resources. Connect routes to the controller handlers and include route-level validation where needed.`,
                files: [routesFile],
            },
            {
                id: 4,
                title: `Add input validation and error handling`,
                description: `Implement input validators and error handling for all CRUD endpoints to prevent malformed data and return consistent HTTP error responses.`,
                files: [validatorFile],
            },
            {
                id: 5,
                title: `Write unit tests for CRUD operations`,
                description: `Create unit tests that cover happy-path and failure scenarios for the CRUD endpoints and controller logic to ensure correctness and prevent regressions.`,
                files: [testFile],
            },
            {
                id: 6,
                title: `Update API documentation`,
                description: `Document the new ${raw} endpoints, request/response shapes, and example usages in the API documentation so other developers and clients know how to use them.`,
                files: [docsFile],
            },
        ];

        return steps;
    }

    private generateAuthSteps(task: Task): Step[] {
        const steps: Step[] = [
            {
                id: 1,
                title: "Create User model with password field",
                description: "Create a User model that includes fields for email/username and a hashed password, plus any profile metadata required by the application.",
                files: ["src/models/User.ts"],
            },
            {
                id: 2,
                title: "Implement password hashing utility",
                description: "Add a secure password hashing utility (e.g., bcrypt wrapper) responsible for hashing and verifying passwords before storage or authentication attempts.",
                files: ["src/utils/hash.ts"],
            },
            {
                id: 3,
                title: "Create JWT token generation and verification utilities",
                description: "Implement JWT creation and verification utilities to sign authentication tokens, include expiration handling, and provide a secure secret or key management approach.",
                files: ["src/utils/jwt.ts"],
            },
            {
                id: 4,
                title: "Implement authentication middleware",
                description: "Add middleware to verify tokens on protected routes, attach authenticated user context to requests, and handle authentication errors consistently.",
                files: ["src/middleware/auth.ts"],
            },
            {
                id: 5,
                title: "Create login and signup endpoints",
                description: "Implement endpoints for user registration and login that use the hashing and JWT utilities. Ensure proper validation, duplicate checks, and secure responses.",
                files: ["src/routes/auth.ts"],
            },
            {
                id: 6,
                title: "Add session management or token refresh logic",
                description: "Implement session handling or token refresh mechanisms (refresh tokens or rotating tokens) to maintain user sessions securely and allow token renewal.",
                files: ["src/controllers/authController.ts"],
            },
            {
                id: 7,
                title: "Write authentication tests",
                description: "Add unit and integration tests that cover registration, login, protected routes, token expiration, and refresh flows to prevent authentication regressions.",
                files: ["tests/auth.test.ts"],
            },
        ];

        return steps;
    }

    private generateRefactorSteps(task: Task): Step[] {
        const raw = task.scope || "code";
        const scope = this.sanitizeScope(raw);
        const utilsFile = `src/utils/${scope}Utils.ts`;
        const testFile = `tests/${scope}.test.ts`;
        const primaryFile = `src/${scope}.ts`;

        const steps: Step[] = [
            {
                id: 1,
                title: `Identify code smells in ${raw}`,
                description: `Run static analysis and manually inspect the ${raw} area to identify duplicated code, large functions, tight coupling, and other code smells that should be addressed.`,
                files: [primaryFile],
            },
            {
                id: 2,
                title: `Extract reusable functions and utilities`,
                description: `Refactor duplicated or tightly-coupled logic into reusable helper functions or modules to improve modularity and testability.`,
                files: [utilsFile],
            },
            {
                id: 3,
                title: `Simplify complex logic and improve readability`,
                description: `Break down large functions, simplify conditional logic, and rename variables/functions for clarity within the affected files.`,
                files: [primaryFile],
            },
            {
                id: 4,
                title: `Update or add missing unit tests`,
                description: `Ensure existing functionality is covered by tests and add tests for refactored pieces to guard against regressions.`,
                files: [testFile],
            },
            {
                id: 5,
                title: `Document refactored code and update comments`,
                description: `Update inline comments, README sections, or design notes to reflect the refactored structure and any public interfaces that changed.`,
                files: [primaryFile],
            },
        ];

        return steps;
    }

    private generateFeatureSteps(task: Task): Step[] {
        const raw = task.scope || "feature";
        const scope = this.sanitizeScope(raw);
        const featureFile = `src/features/${scope}.ts`;
        const routesFile = `src/routes/${scope}Routes.ts`;
        const uiComponent = `src/components/${scope}.tsx`;
        const configFile = `src/config/${scope}.config.ts`;
        const testFile = `tests/${scope}.integration.test.ts`;
        const docsFile = `docs/${scope}.md`;

        const steps: Step[] = [
            {
                id: 1,
                title: `Design feature architecture for ${raw}`,
                description: `Outline the architecture for the ${raw} feature: services, data models, APIs, and UI components that will be required and how they interact.`,
                files: [],
            },
            {
                id: 2,
                title: `Implement core feature logic`,
                description: `Develop the main business logic for the ${raw} feature, ensuring separation of concerns and adherence to existing patterns in the codebase.`,
                files: [featureFile],
            },
            {
                id: 3,
                title: `Create API endpoints or UI components`,
                description: `Expose the feature via API routes or UI components as appropriate. If backend-focused, add REST endpoints; if frontend, create component(s) for user interaction.`,
                files: [routesFile, uiComponent],
            },
            {
                id: 4,
                title: `Add configuration and environment variables`,
                description: `Add any required configuration entries or environment variables, and document expected values and defaults.`,
                files: [configFile],
            },
            {
                id: 5,
                title: `Write integration tests for the feature`,
                description: `Create integration tests that validate the feature end-to-end, including interactions between components and any external dependencies.`,
                files: [testFile],
            },
            {
                id: 6,
                title: `Update documentation with feature usage`,
                description: `Document the feature's behavior, API surface, configuration, and example usage to help other developers and consumers.`,
                files: [docsFile],
            },
        ];

        return steps;
    }

    private generateBugfixSteps(task: Task): Step[] {
        const raw = task.scope || "area";
        const scope = this.sanitizeScope(raw);
        const affectedFile = `src/${scope}.ts`;
        const testFile = `tests/${scope}.regression.test.ts`;

        const steps: Step[] = [
            {
                id: 1,
                title: `Reproduce and identify root cause in ${raw}`,
                description: `Create a minimal reproducible test or steps to reliably trigger the bug in the ${raw} area. Gather logs and trace to identify the root cause.`,
                files: [affectedFile],
            },
            {
                id: 2,
                title: `Implement fix in the affected module`,
                description: `Apply a targeted fix to the module responsible for the bug, keeping changes minimal and well-scoped. Add inline comments explaining the rationale.`,
                files: [affectedFile],
            },
            {
                id: 3,
                title: `Add regression test to prevent reoccurrence`,
                description: `Add a regression test that reproduces the bug scenario and asserts the expected behavior to prevent future regressions.`,
                files: [testFile],
            },
            {
                id: 4,
                title: `Verify fix doesn't introduce new issues`,
                description: `Run the full test suite and, if available, system/integration tests to ensure the fix did not break related functionality.`,
                files: [affectedFile],
            },
        ];

        return steps;
    }

    private generateOtherSteps(task: Task): Step[] {
        const raw = task.scope || this.summarizeScopeFromDescription(task.description);
        const scope = this.sanitizeScope(raw);
        const implFile = `src/${scope}.ts`;
        const testFile = `tests/${scope}.test.ts`;

        const steps: Step[] = [
            {
                id: 1,
                title: `Analyze requirements for: ${task.description}`,
                description: `Clarify and analyze the requirements described: "${task.description}". Identify success criteria, edge cases, and dependencies.`,
                files: [],
            },
            {
                id: 2,
                title: `Implement the required changes`,
                description: `Implement the changes or feature as planned for the scope "${raw}". Follow existing project patterns and ensure proper separation of concerns.`,
                files: [implFile],
            },
            {
                id: 3,
                title: `Test and validate the implementation`,
                description: `Write and run tests to validate the implementation meets the requirements and does not break existing behavior.`,
                files: [testFile],
            },
        ];

        return steps;
    }

    private sanitizeScope(scope: string): string {
        if (!scope) return "scope";
        // Trim and normalize.
        let s = scope.trim();
        // Replace spaces and underscores with hyphens.
        s = s.replace(/[_\s]+/g, "-");
        // Remove characters that are not alphanumeric or hyphens.
        s = s.replace(/[^a-zA-Z0-9-]/g, "");
        // Collapse multiple hyphens.
        s = s.replace(/-+/g, "-");
        // Lowercase for file names.
        s = s.toLowerCase();
        // Trim leading/trailing hyphens.
        s = s.replace(/^-+|-+$/g, "");
        if (!s) return "scope";
        return s;
    }

    private summarizeScopeFromDescription(description?: string): string {
        if (!description) return "task";
        // Try to pick a short token from the description, fallback to 'task'.
        const tokens = description
            .split(/[\s,:]+/)
            .filter(Boolean)
            .map(t => t.replace(/[^a-zA-Z0-9]/g, ""));
        if (tokens.length === 0) return "task";
        // Prefer a noun-like token: pick first meaningful token up to length 20.
        const candidate = tokens[0].slice(0, 20);
        return candidate || "task";
    }
}