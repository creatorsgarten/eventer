// React Testing Library RTL setup file
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
	cleanup();
});

// Global setup for tests
beforeAll(() => {
	// Mock window.matchMedia for components that use it
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(), // deprecated
			removeListener: vi.fn(), // deprecated
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});

	// Mock window.ResizeObserver for components that use it
	global.ResizeObserver = vi.fn().mockImplementation(() => ({
		observe: vi.fn(),
		unobserve: vi.fn(),
		disconnect: vi.fn(),
	}));

	// Mock IntersectionObserver for components that use it
	global.IntersectionObserver = vi.fn().mockImplementation(() => ({
		observe: vi.fn(),
		unobserve: vi.fn(),
		disconnect: vi.fn(),
	}));
});

// Setup for each test
beforeEach(() => {
	// Clear all mocks before each test
	vi.clearAllMocks();
});
