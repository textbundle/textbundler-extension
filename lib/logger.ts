declare const __DEV__: boolean;

interface LogEntry {
  level: string;
  module: string;
  message: string;
  data?: unknown;
}

const logs: LogEntry[] = [];
let capturing = false;

/**
 * Format the prefix for log output.
 * @param module - The module name to include in the prefix
 * @returns Formatted prefix string in [TextBundler:{module}] format
 */
function prefix(module: string): string {
  return `[TextBundler:${module}]`;
}

/**
 * Structured logger for TextBundler modules.
 * Each method accepts a module name, message, and optional data payload.
 * In development (__DEV__), all levels log to console with [TextBundler:{module}] prefix.
 * In production, debug and info are no-ops (stripped by Vite define).
 * Section 10.4 - Logger calls include the module name.
 */
export const logger = {
  debug(module: string, message: string, data?: unknown): void {
    if (capturing) {
      logs.push({ level: 'debug', module, message, data });
    }
    if (__DEV__) {
      if (data !== undefined) {
        console.debug(prefix(module), message, data);
      } else {
        console.debug(prefix(module), message);
      }
    }
  },

  info(module: string, message: string, data?: unknown): void {
    if (capturing) {
      logs.push({ level: 'info', module, message, data });
    }
    if (__DEV__) {
      if (data !== undefined) {
        console.info(prefix(module), message, data);
      } else {
        console.info(prefix(module), message);
      }
    }
  },

  warn(module: string, message: string, data?: unknown): void {
    if (capturing) {
      logs.push({ level: 'warn', module, message, data });
    }
    if (data !== undefined) {
      console.warn(prefix(module), message, data);
    } else {
      console.warn(prefix(module), message);
    }
  },

  error(module: string, message: string, data?: unknown): void {
    if (capturing) {
      logs.push({ level: 'error', module, message, data });
    }
    if (data !== undefined) {
      console.error(prefix(module), message, data);
    } else {
      console.error(prefix(module), message);
    }
  },
};

/**
 * Enable log capturing for test assertions.
 * Clears any previously captured logs.
 */
export function _testStartCapture(): void {
  logs.length = 0;
  capturing = true;
}

/**
 * Stop capturing and return all captured log entries.
 * @returns Array of captured LogEntry objects
 */
export function _testStopCapture(): LogEntry[] {
  capturing = false;
  const result = [...logs];
  logs.length = 0;
  return result;
}

/**
 * Get captured logs without stopping capture.
 * @returns Array of captured LogEntry objects
 */
export function _testGetLogs(): LogEntry[] {
  return [...logs];
}

export type { LogEntry };
