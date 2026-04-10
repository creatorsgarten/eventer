/**
 * Unit tests for useAuthCallback hook
 *
 * Covers:
 *  - No tokens in URL hash → immediate redirect to /auth/login
 *  - Valid tokens → submits to backend → redirects to /event on success
 *  - Backend failure → sets error status → redirects to /auth/login
 *  - Token extraction edge cases (malformed hash, partial tokens)
 */
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockRouterPush = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockRouterPush,
		refresh: vi.fn(),
	}),
}));

// The mutation function and its control handles, set per test via mockImplementation.
const mockMutate = vi.fn();
let capturedCallbacks: {
	onSuccess?: (res: unknown) => void;
	onError?: (err: Error) => void;
} = {};

vi.mock("@/hooks/mutations/use-auth-callback", () => ({
	useAuthCallbackMutation: () => ({
		mutate: mockMutate,
		isPending: false,
	}),
}));

// Helper: set window.location.hash to simulate OAuth redirect URL
function setLocationHash(hash: string) {
	Object.defineProperty(window, "location", {
		writable: true,
		value: { ...window.location, hash },
	});
}

// ─── Import under test (must come after vi.mock calls) ───────────────────────
import { useAuthCallback } from "./use-handle-auth-callback";

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("useAuthCallback", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		capturedCallbacks = {};

		// Default mutate implementation: capture the callbacks so tests can
		// trigger onSuccess / onError imperatively.
		mockMutate.mockImplementation(
			(
				_params: unknown,
				callbacks: { onSuccess?: (res: unknown) => void; onError?: (err: Error) => void }
			) => {
				capturedCallbacks = callbacks ?? {};
			}
		);
	});

	afterEach(() => {
		// Reset hash between tests
		setLocationHash("");
	});

	// ── No tokens present ──────────────────────────────────────────────────

	it("redirects to /auth/login immediately when the URL hash is empty", async () => {
		setLocationHash("");

		renderHook(() => useAuthCallback());

		await waitFor(() => {
			expect(mockRouterPush).toHaveBeenCalledWith("/auth/login");
		});
		expect(mockMutate).not.toHaveBeenCalled();
	});

	it("redirects to /auth/login when the hash contains neither access_token nor refresh_token", async () => {
		setLocationHash("#some_other_param=value");

		renderHook(() => useAuthCallback());

		await waitFor(() => {
			expect(mockRouterPush).toHaveBeenCalledWith("/auth/login");
		});
		expect(mockMutate).not.toHaveBeenCalled();
	});

	it("redirects to /auth/login when access_token is present but refresh_token is missing", async () => {
		setLocationHash("#access_token=abc");

		renderHook(() => useAuthCallback());

		await waitFor(() => {
			expect(mockRouterPush).toHaveBeenCalledWith("/auth/login");
		});
		expect(mockMutate).not.toHaveBeenCalled();
	});

	it("redirects to /auth/login when refresh_token is present but access_token is missing", async () => {
		setLocationHash("#refresh_token=xyz");

		renderHook(() => useAuthCallback());

		await waitFor(() => {
			expect(mockRouterPush).toHaveBeenCalledWith("/auth/login");
		});
		expect(mockMutate).not.toHaveBeenCalled();
	});

	// ── Token submission ───────────────────────────────────────────────────

	it("calls mutate with the extracted tokens when both are present in the URL hash", async () => {
		setLocationHash("#access_token=AT123&refresh_token=RT456&token_type=bearer");

		renderHook(() => useAuthCallback());

		await waitFor(() => {
			expect(mockMutate).toHaveBeenCalledWith(
				{ access_token: "AT123", refresh_token: "RT456" },
				expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) })
			);
		});
	});

	// ── Success path ───────────────────────────────────────────────────────

	it("sets status to 'success' and redirects to /event after a successful callback", async () => {
		setLocationHash("#access_token=AT&refresh_token=RT");

		const { result } = renderHook(() => useAuthCallback());

		// Wait for the mutate call so capturedCallbacks is populated
		await waitFor(() => expect(mockMutate).toHaveBeenCalled());

		act(() => {
			capturedCallbacks.onSuccess?.({
				success: true,
				message: "ok",
				user: { id: "u1", email: "a@b.com", name: "Alice" },
			});
		});

		await waitFor(() => {
			expect(result.current.status).toBe("success");
			expect(result.current.message).toBe("Authentication successful! Redirecting...");
			expect(mockRouterPush).toHaveBeenCalledWith("/event");
		});
	});

	it("exposes the returned userInfo on success", async () => {
		setLocationHash("#access_token=AT&refresh_token=RT");

		const { result } = renderHook(() => useAuthCallback());

		await waitFor(() => expect(mockMutate).toHaveBeenCalled());

		act(() => {
			capturedCallbacks.onSuccess?.({
				success: true,
				message: "ok",
				user: {
					id: "u2",
					email: "bob@example.com",
					name: "Bob",
					avatar_url: "https://cdn.example.com/bob.jpg",
				},
			});
		});

		await waitFor(() => {
			expect(result.current.userInfo).toMatchObject({
				id: "u2",
				email: "bob@example.com",
				name: "Bob",
				avatar_url: "https://cdn.example.com/bob.jpg",
			});
		});
	});

	it("sets userInfo to null when the server response contains no user", async () => {
		setLocationHash("#access_token=AT&refresh_token=RT");

		const { result } = renderHook(() => useAuthCallback());

		await waitFor(() => expect(mockMutate).toHaveBeenCalled());

		act(() => {
			capturedCallbacks.onSuccess?.({ success: true, message: "ok", user: undefined });
		});

		await waitFor(() => {
			expect(result.current.userInfo).toBeNull();
		});
	});

	// ── Error path ─────────────────────────────────────────────────────────

	it("sets status to 'error' and shows an error message on backend failure", async () => {
		setLocationHash("#access_token=AT&refresh_token=RT");

		const { result } = renderHook(() => useAuthCallback());

		await waitFor(() => expect(mockMutate).toHaveBeenCalled());

		act(() => {
			capturedCallbacks.onError?.(new Error("Token rejected"));
		});

		await waitFor(() => {
			expect(result.current.status).toBe("error");
			expect(result.current.message).toBe("Authentication failed. Please try again.");
		});
	});

	it("redirects to /auth/login after a short delay on error", async () => {
		// Use shouldAdvanceTime so waitFor's internal polling still works while
		// we can also fast-forward the hook's 500 ms redirect timeout.
		vi.useFakeTimers({ shouldAdvanceTime: true });
		setLocationHash("#access_token=AT&refresh_token=RT");

		renderHook(() => useAuthCallback());

		await waitFor(() => expect(mockMutate).toHaveBeenCalled());

		act(() => {
			capturedCallbacks.onError?.(new Error("Server error"));
		});

		// Fast-forward past the 500 ms setTimeout inside the hook
		await act(async () => {
			vi.advanceTimersByTime(600);
		});

		expect(mockRouterPush).toHaveBeenCalledWith("/auth/login");

		vi.useRealTimers();
	});

	// ── Initial state ──────────────────────────────────────────────────────

	it("starts with status 'idle', empty message and null userInfo", () => {
		setLocationHash("#access_token=AT&refresh_token=RT");

		const { result } = renderHook(() => useAuthCallback());

		// Before any async resolution the initial state should be idle
		expect(result.current.status).toBe("idle");
		expect(result.current.message).toBe("");
		expect(result.current.userInfo).toBeNull();
	});
});
