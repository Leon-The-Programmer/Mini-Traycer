/* const parseTask = (input: string) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('function')) {
        return {
            type: 'function',
            action: 'create',
            target: input.match(/function (\w+)/)?.[1],
            details: input,
        };
    }

    if (lowerInput.includes('file')) {
        return {
            type: 'file',
            action: 'create',
            target: input.match(/file(w+)/)?.[1],
            details: input,
        };
    }

    if (lowerInput.includes('refactor')) {
        return {
            type: 'refactor',
            action: 'refactor',
            details: input,
        };
    }

    return {
        type: 'other',
        action: 'unknown',
        details: input,
    };

    module.exports = { parseTask };
} */

export function parseFile(content: string): string {
    return content;
}