
<p align="center">
	<a href="https://nodejs.org/en/about/releases/">
		<img src="https://img.shields.io/badge/node-%3E=18.0.0-green.svg" alt="Node version">
	</a>
	<a href="https://opensource.org/licenses/ISC">
		<img src="https://img.shields.io/badge/license-ISC-blue.svg" alt="License: ISC">
	</a>
</p>


<h1 align="center">📋 Mini-Traycer: The Planning Layer Demo</h1>

<p align="center">
  <b>Intelligent, modular task planning for code agents & humans</b><br>
  <a href="https://traycer.ai" target="_blank">Inspired by Traycer AI</a> · <a href="#">Demo Project</a>
</p>

---

## ✨ Project Overview

Mini-Traycer is a demonstration of the <b>planning layer</b> concept: transforming a high-level user task into a step-by-step, actionable plan for software development. It showcases how a planning layer can sit atop coding agents, orchestrating work by breaking down tasks into clear, logical steps.

> <b>Planning Layer:</b> <i>User Task → Planning Layer → Actionable Steps → (Coding Agent/Developer)</i>

This project is a focused, submission-ready showcase—not a full production system. For more on the vision, see <a href="https://traycer.ai" target="_blank">Traycer AI</a>.

---

## ✨ Features

- 🔍 <b>Task Classification (Hard Coded):</b> CRUD, Authentication, Refactor, Feature, Bugfix, Other.
- 🧠 <b>Dual Strategies:</b> Hardcoded (template-based) & LLM (AI-powered via Groq).
- 🖥️ <b>CLI Interface:</b> Plan tasks from the command line.
- 🏗️ <b>Extensible Architecture:</b> Strategy pattern for easy extension.
- 🛡️ <b>Production-Ready:</b> Error handling, retry logic, config management.

---

## 🏛️ Architecture

```text
src/
├── types/         # Type definitions (Task, Step, etc)
├── core/          # Parser, Analyzer, Formatter, Exports
├── strategies/    # Planning strategies (Hardcoded, LLM)
├── config/        # Config files (analyzer.config.json)
└── cli/           # CLI entry point
```

- <b>Pipeline:</b> <code>parser → analyzer → formatter</code>
- <b>Strategy Pattern:</b> Swap planning logic at runtime (template or LLM)
- <b>Dependency Injection:</b> Analyzer accepts any strategy
- <b>Type Safety:</b> All logic is strongly typed with TypeScript

---

## 🚀 Installation & Setup

<b>Prerequisites:</b> Node.js 18+, npm

```bash
# 1. Clone the repository
git clone https://github.com/Leon-The-Programmer/Mini-Traycer.git
cd mini-traycer

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. (Optional) Copy and edit environment variables
cp .env.example .env
```

---

## 🖥️ Usage

### Hardcoded Mode (Template-Based)

```bash
npm run start:cli "Add authentication to the app"
```

<details>
<summary>Example Output (Hardcoded Strategy)</summary>

```text
Using Hardcoded strategy (templates)...
Task: Add authentication to the app

1. Create User model with password field
	- Create a User model that includes fields for email/username and a hashed password, plus any profile metadata required by the application.
	- Files: src/models/User.ts

2. Implement password hashing utility
	- Add a secure password hashing utility (e.g., bcrypt wrapper) responsible for hashing and verifying passwords before storage or authentication attempts.
	- Files: src/utils/hash.ts

3. Create JWT token generation and verification utilities
	- Implement JWT creation and verification utilities to sign authentication tokens, include expiration handling, and provide a secure secret or key management approach.
	- Files: src/utils/jwt.ts

4. Implement authentication middleware
	- Add middleware to verify tokens on protected routes, attach authenticated user context to requests, and handle authentication errors consistently.
	- Files: src/middleware/auth.ts

5. Create login and signup endpoints
	- Implement endpoints for user registration and login that use the hashing and JWT utilities. Ensure proper validation, duplicate checks, and secure responses.
	- Files: src/routes/auth.ts

6. Add session management or token refresh logic
	- Implement session handling or token refresh mechanisms (refresh tokens or rotating tokens) to maintain user sessions securely and allow token renewal.
	- Files: src/controllers/authController.ts

7. Write authentication tests
	- Add unit and integration tests that cover registration, login, protected routes, token expiration, and refresh flows to prevent authentication regressions.
	- Files: tests/auth.test.ts
```
</details>

### AI-Powered Mode (Groq LLM)

1. Copy `.env.example` to `.env` and add your Groq API key
2. Set <code>ANALYZER_STRATEGY=LLM</code> in your `.env`
3. Run:

```bash
npm run start:cli "Design a calculator app in C++"
```

<details>
<summary>Example Output (LLM Strategy)</summary>

```text
Using LLM strategy (Groq API)...
Task: Design a calculator app in C++

1. Define requirements and features
	- List supported operations (add, subtract, multiply, divide), input/output format, error handling, and UI (console or GUI).
	- Files: []

2. Design class structure
	- Create C++ classes for Calculator, Operation, and User Interface. Plan methods and data members.
	- Files: src/Calculator.h, src/Calculator.cpp

3. Implement core calculator logic
	- Write the main calculation engine and operation handling logic.
	- Files: src/Calculator.cpp

4. Build user interface
	- Implement console or GUI interface for user input and output.
	- Files: src/UI.cpp, src/UI.h

5. Add error handling and validation
	- Ensure robust input validation and error messages for invalid operations.
	- Files: src/Calculator.cpp

6. Write tests
	- Create unit tests for all calculator operations and edge cases.
	- Files: tests/CalculatorTest.cpp
```
</details>

<b>Strategy Selection:</b> Set <code>ANALYZER_STRATEGY</code> in your environment or .env file. Default is <code>Hardcoded</code> (no API key required).

---

## ⚙️ Configuration

### Environment Variables

| Variable            | Description                        | Default                                 | Required (LLM) |
|---------------------|------------------------------------|-----------------------------------------|---------------|
| GROQ_API_KEY        | Your Groq API key                  | (none)                                  | Yes           |
| GROQ_MODEL          | Model name                         | openai/gpt-oss-20b                      | Yes           |
| GROQ_BASE_URL       | Groq API endpoint                  | https://api.groq.com/openai/v1          | Yes           |
| ANALYZER_STRATEGY   | Strategy: Hardcoded or LLM         | Hardcoded                               | No            |

### Configuration File: <code>src/config/analyzer.config.json</code>

```json
{
  "strategy": "Hardcoded",
  "groq": {
	 "apiKey": "",
	 "model": "openai/gpt-oss-20b",
	 "baseUrl": "https://api.groq.com/openai/v1",
	 "maxRetries": 3,
	 "timeout": 30000
  }
}
```

<b>Priority:</b> Environment variables override config file values.

---

## 📂 Project Structure

```text
mini-traycer/
├── src/
│   ├── types/
│   │   └── analysis.ts          # Core type definitions
│   ├── core/
│   │   ├── parser.ts            # Task parsing logic
│   │   ├── analyzer.ts          # Strategy orchestrator
│   │   ├── formatter.ts         # Output formatting
│   │   └── index.ts             # Public API exports
│   ├── strategies/
│   │   ├── HardcodedStrategy.ts # Template-based planning
│   │   └── LLMStrategy.ts       # AI-powered planning
│   ├── config/
│   │   └── analyzer.config.json # Default configuration
│   └── cli/
│       └── index.ts             # CLI entry point
├── .env.example                 # Environment template
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project metadata
```

---

## 🧠 Design Decisions

- <b>TypeScript:</b> Type safety, maintainability, self-documenting interfaces. Plus, it was a task requirement.
- <b>CLI-First:</b> Easy to test, foundation for future extensions (VS Code, web)
- <b>Groq for LLM:</b> Free tier, OpenAI-compatible, fast, modern models
- <b>Strategy Pattern:</b> Extensible, testable, runtime switching

---

## 🔮 Future Enhancements

- VS Code Extension: Planning in the editor
- Context Gathering: Smarter file suggestions
- More LLM Providers: OpenAI, Anthropic, local models
- Web UI: Browser-based interface
- Plan Execution: Integrate with coding agents
- Plan Versioning: Save/compare plans

---

## 🛠️ Development

| Command                                 | Description                           |
|------------------------------------------|------------------------------------- |
| <code>npm run build</code>               | Compile TypeScript to JavaScript     |
| <code>npm run start:cli "task"</code>   | Run CLI (ts-node)                     |
| <code>npm run watch</code>               | Auto-recompile on changes            |

### Testing Strategies

<b>Hardcoded:</b>
```bash
npm run start:cli "Create CRUD endpoints for products"
```

<b>LLM:</b>
```bash
ANALYZER_STRATEGY=LLM npm run start:cli "Build a REST API for a todo app"
or
npm run start:cli "Build a REST API for a todo app"
```

---


## 📝 Example Outputs

### Hardcoded Strategy Examples

<details>
<summary><b>Authentication Task</b></summary>

```text
Using Hardcoded strategy (templates)...
Task: Add authentication

1. Create User model with password field
2. Implement password hashing utility
3. Create JWT token generation and verification utilities
4. Implement authentication middleware
5. Create login and signup endpoints
6. Add session management or token refresh logic
7. Write authentication tests
```
</details>

<details>
<summary><b>CRUD Task</b></summary>

```text
Using Hardcoded strategy (templates)...
Task: Create CRUD endpoints for products

1. Create products data model
2. Create products controller with CRUD operations
3. Define API routes for products
4. Add input validation and error handling
5. Write unit tests for CRUD operations
6. Update API documentation
```
</details>

<details>
<summary><b>Refactor Task</b></summary>

```text
Using Hardcoded strategy (templates)...
Task: Refactor the payment module

1. Identify code smells in payment module
2. Extract reusable functions and utilities
3. Simplify complex logic and improve readability
4. Update or add missing unit tests
5. Document refactored code and update comments
```
</details>

### LLM Strategy Example

<details>
<summary><b>Design a Calculator App (LLM)</b></summary>

```text
Using LLM strategy (Groq API)...
Task: Design a calculator app

1. Define requirements and features
2. Design class structure
3. Implement core calculator logic
4. Build user interface
5. Add error handling and validation
6. Write tests
```
</details>

---

## 🤝 Contributing

This is a demonstration project. Feel free to fork, adapt, or use as inspiration for your own planning layer experiments!

## 📄 License

ISC

## 🙏 Acknowledgments

- Traycer AI (vision & inspiration)
- Groq (LLM API)
- OpenAI (API compatibility)

## 📧 Contact

Author:  [Subhanshu](https://www.linkedin.com/in/subhanshu1/)

Project: Mini-Traycer

---
