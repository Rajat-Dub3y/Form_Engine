// Load jest-dom matchers when running in environments that provide `expect`.
if (typeof (globalThis as any).expect !== 'undefined') {
	// dynamic import avoids errors in browser/storybook environment where `expect` may be undefined
	void import('@testing-library/jest-dom');
}

export {};
// Minimal Vitest setup for Storybook environment
// Add global test setup here if needed (e.g. jest-dom matchers)

export {};
