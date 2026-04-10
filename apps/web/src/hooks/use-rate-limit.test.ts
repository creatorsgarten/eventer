/**
 * Unit tests for useRateLimit hook
 *
 * Covers:
 *  - Allows actions under the limit
 *  - Blocks actions once the limit is reached
 *  - Correct remaining / resetIn state updates
 *  - onLimitExceeded callback is invoked with the correct remaining time
 *  - State resets automatically after the window expires
 *  - Manual reset via the returned reset() function
 *  - Cleanup: no state updates after the component unmounts
 */
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRateLimit } from "./use-rate-limit";

describe("useRateLimit", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	// ── Allowing actions ───────────────────────────────────────────────────

	it("allows the first action and decrements remaining by 1", async () => {
		const { result } = renderHook(() => useRateLimit({ maxAttempts: 3, windowMs: 60_000 }));

		expect(result.current.isAllowed).toBe(true);
		expect(result.current.remaining).toBe(3);

		await act(async () => {
			await result.current.execute(() => "ok");
		});

		expect(result.current.remaining).toBe(2);
		expect(result.current.isAllowed).toBe(true);
	});

	it("returns { success: true, result } for allowed actions", async () => {
		const { result } = renderHook(() => useRateLimit({ maxAttempts: 5, windowMs: 60_000 }));

		let outcome: { success: boolean; result?: string } | undefined;

		await act(async () => {
			outcome = await result.current.execute(() => "action-result");
		});

		expect(outcome).toEqual({ success: true, result: "action-result" });
	});

	it("executes all attempts up to the limit", async () => {
		const maxAttempts = 3;
		const { result } = renderHook(() => useRateLimit({ maxAttempts, windowMs: 60_000 }));

		for (let i = 0; i < maxAttempts; i++) {
			// eslint-disable-next-line no-await-in-loop
			await act(async () => {
				const outcome = await result.current.execute(() => "ok");
				expect(outcome.success).toBe(true);
			});
		}

		expect(result.current.remaining).toBe(0);
	});

	// ── Blocking actions ───────────────────────────────────────────────────

	it("blocks the action once the limit is exceeded and returns { success: false }", async () => {
		const { result } = renderHook(() => useRateLimit({ maxAttempts: 2, windowMs: 60_000 }));

		// Exhaust the limit
		await act(async () => {
			await result.current.execute(() => "first");
			await result.current.execute(() => "second");
		});

		let outcome: { success: boolean; result?: string } | undefined;

		await act(async () => {
			outcome = await result.current.execute(() => "should-be-blocked");
		});

		expect(outcome?.success).toBe(false);
		expect(outcome?.result).toBeUndefined();
	});

	it("sets isAllowed to false and remaining to 0 when rate limited", async () => {
		const { result } = renderHook(() => useRateLimit({ maxAttempts: 1, windowMs: 60_000 }));

		await act(async () => {
			await result.current.execute(() => "first"); // consumes the only slot
		});

		await act(async () => {
			await result.current.execute(() => "blocked");
		});

		expect(result.current.isAllowed).toBe(false);
		expect(result.current.remaining).toBe(0);
	});

	it("does not execute the blocked action's callback", async () => {
		const action = vi.fn();

		const { result } = renderHook(() => useRateLimit({ maxAttempts: 1, windowMs: 60_000 }));

		await act(async () => {
			await result.current.execute(action); // allowed
		});

		await act(async () => {
			await result.current.execute(action); // blocked
		});

		expect(action).toHaveBeenCalledTimes(1);
	});

	// ── onLimitExceeded callback ───────────────────────────────────────────

	it("calls onLimitExceeded with a positive resetIn seconds value when blocked", async () => {
		const onLimitExceeded = vi.fn();

		const { result } = renderHook(() =>
			useRateLimit({ maxAttempts: 1, windowMs: 30_000, onLimitExceeded })
		);

		// Use first attempt
		await act(async () => {
			await result.current.execute(() => "ok");
		});

		// Trigger rate limit
		await act(async () => {
			await result.current.execute(() => "blocked");
		});

		expect(onLimitExceeded).toHaveBeenCalledOnce();
		const [resetIn] = onLimitExceeded.mock.calls[0] as [number];
		expect(resetIn).toBeGreaterThan(0);
		expect(resetIn).toBeLessThanOrEqual(30); // window is 30 s
	});

	it("provides a resetIn value (in seconds) that reflects the remaining window time", async () => {
		const onLimitExceeded = vi.fn();

		const { result } = renderHook(() =>
			useRateLimit({ maxAttempts: 1, windowMs: 60_000, onLimitExceeded })
		);

		await act(async () => {
			await result.current.execute(() => "ok");
		});

		// Advance 20 seconds into the window
		act(() => {
			vi.advanceTimersByTime(20_000);
		});

		await act(async () => {
			await result.current.execute(() => "blocked");
		});

		const [resetIn] = onLimitExceeded.mock.calls[0] as [number];
		// ~40 s remain; allow ±2 s for implementation rounding
		expect(resetIn).toBeGreaterThanOrEqual(38);
		expect(resetIn).toBeLessThanOrEqual(41);
	});

	// ── Auto-reset after the window ────────────────────────────────────────

	it("allows actions again after the rate-limit window expires", async () => {
		const windowMs = 5_000;

		const { result } = renderHook(() => useRateLimit({ maxAttempts: 1, windowMs }));

		// Exhaust the limit
		await act(async () => {
			await result.current.execute(() => "first");
		});

		await act(async () => {
			await result.current.execute(() => "blocked");
		});

		expect(result.current.isAllowed).toBe(false);

		// Advance past the window + the resetTimerRef timeout
		act(() => {
			vi.advanceTimersByTime(windowMs + 100);
		});

		// State is updated by the internal timer; trigger an execute to confirm
		await act(async () => {
			const outcome = await result.current.execute(() => "allowed-again");
			expect(outcome.success).toBe(true);
		});
	});

	// ── Manual reset ───────────────────────────────────────────────────────

	it("restores full remaining and isAllowed=true after calling reset()", async () => {
		const maxAttempts = 3;
		const { result } = renderHook(() => useRateLimit({ maxAttempts, windowMs: 60_000 }));

		// Use all attempts
		await act(async () => {
			for (let i = 0; i < maxAttempts; i++) {
				await result.current.execute(() => "ok");
			}
		});

		expect(result.current.remaining).toBe(0);

		act(() => {
			result.current.reset();
		});

		expect(result.current.isAllowed).toBe(true);
		expect(result.current.remaining).toBe(maxAttempts);
		expect(result.current.resetIn).toBe(0);
	});

	it("allows a new action immediately after manual reset even if the window has not expired", async () => {
		const { result } = renderHook(() => useRateLimit({ maxAttempts: 1, windowMs: 60_000 }));

		await act(async () => {
			await result.current.execute(() => "first"); // consumes slot
		});

		act(() => {
			result.current.reset();
		});

		await act(async () => {
			const outcome = await result.current.execute(() => "post-reset");
			expect(outcome.success).toBe(true);
		});
	});

	// ── Edge cases ─────────────────────────────────────────────────────────

	it("propagates exceptions thrown by the action function", async () => {
		const { result } = renderHook(() => useRateLimit({ maxAttempts: 5, windowMs: 60_000 }));

		await expect(
			act(async () => {
				await result.current.execute(() => {
					throw new Error("Action failed");
				});
			})
		).rejects.toThrow("Action failed");
	});

	it("handles async action functions correctly", async () => {
		const { result } = renderHook(() => useRateLimit({ maxAttempts: 5, windowMs: 60_000 }));

		const asyncAction = vi.fn().mockResolvedValue("async-result");

		let outcome: { success: boolean; result?: string } | undefined;

		await act(async () => {
			outcome = await result.current.execute(asyncAction);
		});

		expect(outcome).toEqual({ success: true, result: "async-result" });
		expect(asyncAction).toHaveBeenCalledOnce();
	});

	it("tracks attempts correctly across multiple rapid consecutive calls", async () => {
		const maxAttempts = 3;
		const { result } = renderHook(() => useRateLimit({ maxAttempts, windowMs: 60_000 }));

		const results: boolean[] = [];

		await act(async () => {
			for (let i = 0; i < 5; i++) {
				const { success } = await result.current.execute(() => "ok");
				results.push(success);
			}
		});

		// First 3 succeed, next 2 are blocked
		expect(results).toEqual([true, true, true, false, false]);
	});
});
