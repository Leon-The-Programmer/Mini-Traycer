/**
 * LLMStrategy: AI-powered task breakdown using Groq API.
 *
 * This strategy implements the AnalyzerStrategy interface and uses Groq's OpenAI-compatible API.
 * to generate intelligent, context-aware step-by-step plans.
 *
 * Unlike HardcodedStrategy (template-based), this strategy leverages LLMs for dynamic planning.
 *
 * Configuration:
 *   - Reads GROQ_API_KEY, GROQ_MODEL, GROQ_BASE_URL from environment variables (preferred).
 *   - Falls back to src/config/analyzer.config.json if .env file not found or variables are not set.
 */

import { Task, TaskBreakdown, Step, AnalyzerStrategy } from "../types/analysis";
import axios from "axios"; // HTTP client for Groq API.
import { readFileSync } from "fs";
import { join } from "path"; // For resolving config file path.

/**
 * Configuration for Groq API client.
 * Can be loaded from environment variables or analyzer.config.json.
 */
interface GroqConfig {
	apiKey: string;       
	model: string;         // In our case, it's "openai/gpt-oss-20b".
	baseUrl: string;       
	maxRetries?: number;   // Optional retry count (default 3).
	timeout?: number;      // Optional timeout in ms (default 30000).
}

/**
 * Message format for Groq chat API (OpenAI-compatible)
 */
interface GroqMessage {
	role: string;      // "system", "user", or "assistant".
	content: string;   // Message content.
}


// Request payload for Groq chat completions endpoint. 
interface GroqChatRequest {
	model: string;                              
	messages: GroqMessage[];                    // Conversation messages.
	response_format?: { type: string };         // Optional: request JSON output.
}

// Response from Groq chat completions endpoint.
interface GroqChatResponse {
	choices: Array<{
		message: {
			content: string;
		};
	}>;
}


export class LLMStrategy implements AnalyzerStrategy {
	private config: GroqConfig;
	private client: any;   // HTTP client for API calls (axios instance).

	// Constructor: loads config and initializes HTTP client with retry logic.
	constructor() {
		// Load configuration from environment variables or config file.
		this.config = this.loadConfig();

		// Initialize axios HTTP client with Groq API settings.
		this.client = axios.create({
			baseURL: this.config.baseUrl,
			timeout: this.config.timeout || 30000,
			headers: {
				'Authorization': `Bearer ${this.config.apiKey}`,
				'Content-Type': 'application/json',
			},
		});

		// Add retry interceptor for handling transient failures.
		this.setupRetryInterceptor();
	}

	/**
	 * Load Groq configuration from environment variables (priority) or config file (fallback).
	 * Environment variables: GROQ_API_KEY, GROQ_MODEL, GROQ_BASE_URL.
	 * Config file: src/config/analyzer.config.json.
	 *
	 * @returns GroqConfig object with all required settings.
	 * @throws Error if API key is missing or config file is invalid.
	 */
	private loadConfig(): GroqConfig {
		// Step 1: Try to read from environment variables first (highest priority).
		const envApiKey = process.env.GROQ_API_KEY;
		const envModel = process.env.GROQ_MODEL;
		const envBaseUrl = process.env.GROQ_BASE_URL;

		// Step 2: Read config file as fallback.
		let fileConfig: any = {};
		try {
			// Resolve path to config file relative to this file's location.
			const configPath = join(__dirname, '../config/analyzer.config.json');
			const configContent = readFileSync(configPath, 'utf-8');
			fileConfig = JSON.parse(configContent).groq || {};
		} catch (error) {
			// Config file is optional if environment variables are set.
			console.warn('Could not read analyzer.config.json, using environment variables only');
		}

		// Step 3: Merge config with environment variables taking precedence.
		const config: GroqConfig = {
			apiKey: envApiKey || fileConfig.apiKey || '',
			model: envModel || fileConfig.model || 'mixtral-8x7b-32768',
			baseUrl: envBaseUrl || fileConfig.baseUrl || 'https://api.groq.com/openai/v1',
			maxRetries: fileConfig.maxRetries || 3,
			timeout: fileConfig.timeout || 30000,
		};

		// Step 4: Validate that API key is present.
		if (!config.apiKey) {
			throw new Error(
				'Groq API key is required. Set GROQ_API_KEY environment variable or add it to analyzer.config.json'
			);
		}

		return config;
	}

	/**
	 * Configure axios to automatically retry failed requests with exponential backoff.
	 * Retries on: 5xx errors (server errors) and network errors.
	 * Does NOT retry on: 4xx errors (client errors like invalid API key).
	 */
	private setupRetryInterceptor(): void {
			this.client.interceptors.response.use(
				// Success handler - pass through.
				(response: any) => response,

				// Error handler - implement retry logic.
				async (error: any) => {
					const config = error.config;

					// Initialize retry count if not present.
					config._retryCount = config._retryCount || 0;

					// Check if we should retry this error.
					const shouldRetry =
						// Retry on 5xx server errors.
						(error.response?.status >= 500) ||
						// Retry on network errors (no response).
						(!error.response);

					// Check if we haven't exceeded max retries.
					const canRetry = config._retryCount < (this.config.maxRetries || 3);

					if (shouldRetry && canRetry) {
						config._retryCount += 1;

						// Calculate exponential backoff delay: 1s, 2s, 4s, etc.
						const delay = Math.pow(2, config._retryCount) * 1000;

						console.log(`Retrying request (attempt ${config._retryCount}/${this.config.maxRetries}) after ${delay}ms...`);

						// Wait before retrying.
						await new Promise(resolve => setTimeout(resolve, delay));

						// Retry the request.
						return this.client(config);
					}

					// No more retries or non-retryable error - propagate the error.
					return Promise.reject(error);
				}
			);
	}

	/**
	 * Analyze a task and generate a step-by-step breakdown using Groq AI.
	 * This is the main entry point that implements the AnalyzerStrategy interface.
	 *
	 * @param task - The parsed task with description, type, and scope.
	 * @returns Promise<TaskBreakdown> - AI-generated breakdown with actionable steps.
	 * @throws Error if API call fails or response is invalid.
	 */
	async analyze(task: Task): Promise<TaskBreakdown> {
		try {
			// Step 1: Build the prompt for Groq API.
			const prompt = this.buildPrompt(task);

			// Step 2: Call Groq API to generate the breakdown.
			const responseContent = await this.callGroqAPI(prompt);

			// Step 3: Parse and validate the response.
			const breakdown = this.parseGroqResponse(responseContent, task);

			return breakdown;
		} catch (error: any) {
			// Provide helpful error messages for common issues.
			if (error.message.includes('API key')) {
				throw new Error('Groq API authentication failed. Check your GROQ_API_KEY.');
			} else if (error.message.includes('rate limit')) {
				throw new Error('Groq API rate limit exceeded. Please try again later.');
			} else {
				throw new Error(`LLM strategy failed: ${error.message}`);
			}
		}
	}

	/**
	 * Build a detailed prompt for Groq API that requests a structured task breakdown.
	 * The prompt includes:
	 * - System role definition (what the AI should act as).
	 * - Task details (description, type, scope).
	 * - Output format specification (JSON structure).
	 * - Quality guidelines (realistic file paths, actionable steps).
	 *
	 * @param task - The task to break down.
	 * @returns Formatted prompt string.
	 */
	private buildPrompt(task: Task): string {
		// Define the AI's role and capabilities.
		const systemPrompt = `You are a technical planning assistant that breaks down software development tasks into actionable steps. 
You analyze task requirements and generate detailed, step-by-step implementation plans with realistic file paths.`;

		// Build the user request with task details.
		const userPrompt = `
Please break down the following software development task into actionable steps:

Task Description: ${task.description}
Task Type: ${task.type}
Task Scope: ${task.scope}

Generate a JSON response with the following structure:
{
	"steps": [
		{
			"id": 1,
			"title": "Short, actionable step title",
			"description": "Detailed explanation of what needs to be done in this step",
			"files": ["path/to/file1.ts", "path/to/file2.ts"]
		}
	]
}

Guidelines:
- Generate 3-7 steps depending on task complexity
- Each step should be specific and actionable
- Suggest realistic file paths based on common project structures (e.g., src/models/, src/controllers/, tests/)
- Include empty array [] for files if the step is planning/analysis only
- Ensure steps are ordered logically (e.g., create models before controllers)
`;

		return systemPrompt + '\n\n' + userPrompt;
	}

	/**
	 * Make an HTTP request to Groq's chat completions endpoint.
	 * Uses OpenAI-compatible API format.
	 *
	 * @param prompt - The formatted prompt to send.
	 * @returns Promise<string> - Raw response content from Groq.
	 * @throws Error if API call fails.
	 */
	private async callGroqAPI(prompt: string): Promise<string> {
		try {
			// Build the request payload.
			const requestBody: GroqChatRequest = {
				model: this.config.model,
				messages: [
					{
						role: 'user',
						content: prompt,
					},
				],
				// Request JSON mode for structured output.
				response_format: { type: 'json_object' },
			};

			// Make POST request to chat completions endpoint.
			const response = await this.client.post(
				'/chat/completions',
				requestBody
			);

			// Extract the generated content from the response.
			const content = response.data.choices[0]?.message?.content;

			if (!content) {
				throw new Error('Empty response from Groq API');
			}

			return content;
		} catch (error: any) {
			// Handle different types of API errors.
			if (error.response) {
				// Server responded with error status.
				const status = error.response.status;
				const message = error.response.data?.error?.message || 'Unknown error';
				throw new Error(`Groq API error (${status}): ${message}`);
			} else if (error.request) {
				// Request was made but no response received (network error).
				throw new Error('Network error: Could not reach Groq API');
			} else {
				// Something else went wrong.
				throw new Error(`Something went wrong: ${error.message}`);
			}
		}
	}

	/**
	 * Parse and validate the JSON response from Groq API.
	 * Ensures the response matches the expected TaskBreakdown structure.
	 *
	 * @param responseContent - Raw JSON string from Groq.
	 * @param task - Original task (used for taskDescription field).
	 * @returns TaskBreakdown - Validated breakdown object.
	 * @throws Error if response is invalid or missing required fields.
	 */
	private parseGroqResponse(responseContent: string, task: Task): TaskBreakdown {
		try {
			// Step 1: Parse JSON string.
			const parsed = JSON.parse(responseContent);

			// Step 2: Validate that 'steps' array exists.
			if (!parsed.steps || !Array.isArray(parsed.steps)) {
				throw new Error('Response missing "steps" array');
			}

			if (parsed.steps.length === 0) {
				throw new Error('Response contains empty steps array');
			}

			// Step 3: Validate each step has required fields.
			const validatedSteps: Step[] = parsed.steps.map((step: any, index: number) => {
				// 'id' field.
				if (typeof step.id !== 'number') {
					throw new Error(`Step ${index + 1} missing valid 'id' field`);
				}

				// 'title' field.
				if (typeof step.title !== 'string' || !step.title.trim()) {
					throw new Error(`Step ${index + 1} missing valid 'title' field`);
				}

				// 'description' field.
				if (typeof step.description !== 'string' || !step.description.trim()) {
					throw new Error(`Step ${index + 1} missing valid 'description' field`);
				}

				// 'files' field (must be array, can be empty).
				if (!Array.isArray(step.files)) {
					throw new Error(`Step ${index + 1} 'files' must be an array`);
				}

				// Ensure all file paths are strings
				const validFiles = step.files.filter((f: any) => typeof f === 'string');

				// Return validated step.
				return {
					id: step.id,
					title: step.title.trim(),
					description: step.description.trim(),
					files: validFiles,
				};
			});

			// Step 4: Build and return TaskBreakdown object.
			return {
				taskDescription: task.description,
				steps: validatedSteps,
			};
		} catch (error: any) {
			// Handle JSON parse errors.
			if (error instanceof SyntaxError) {
				throw new Error(`Invalid JSON response from Groq: ${error.message}`);
			}
			// Re-throw validation errors.
			throw error;
		}
	}
}
