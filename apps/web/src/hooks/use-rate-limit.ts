import { useCallback, useEffect, useRef, useState } from "react";

interface RateLimitConfig {
	/**
	 * Maximum number of allowed actions within the time window
	 */
	maxAttempts: number;

	/**
	 * Time window in milliseconds
	 */
	windowMs: number;

	/**
	 * Optional callback when rate limit is exceeded
	 */
	onLimitExceeded?: (remainingTime: number) => void;
}

interface RateLimitState {
	/**
	 * Whether an action is currently allowed
	 */
	isAllowed: boolean;

	/**
	 * Number of remaining attempts
	 */
	remaining: number;

	/**
	 * Time until the rate limit resets (in seconds)
	 */
	resetIn: number;

	/**
	 * Execute an action with rate limiting
	 * Returns true if the action was allowed, false if rate limited
	 */
	execute: <T>(action: () => T | Promise<T>) => Promise<{ success: boolean; result?: T }>;

	/**
	 * Reset the rate limiter
	 */
	reset: () => void;
}

/**
 * Hook for client-side rate limiting
 * Prevents users from performing actions too frequently
 *
 * @example
 * ```tsx
 * const { isAllowed, remaining, resetIn, execute } = useRateLimit({
 *   maxAttempts: 5,
 *   windowMs: 60000, // 1 minute
 *   onLimitExceeded: (resetIn) => {
 *     toast.error(`Too many attempts. Please wait ${resetIn} seconds.`);
 *   }
 * });
 *
 * const handleLogin = async () => {
 *   const { success, result } = await execute(() => loginApi());
 *   if (!success) {
 *     console.log("Rate limited");
 *   }
 * };
 * ```
 */
export function useRateLimit(config: RateLimitConfig): RateLimitState {
	const { maxAttempts, windowMs, onLimitExceeded } = config;

	const [isAllowed, setIsAllowed] = useState(true);
	const [remaining, setRemaining] = useState(maxAttempts);
	const [resetIn, setResetIn] = useState(0);

	const attemptsRef = useRef<number[]>([]);
	const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

	const updateState = useCallback(() => {
		const now = Date.now();
		const windowStart = now - windowMs;

		// Remove attempts outside the current window
		attemptsRef.current = attemptsRef.current.filter((timestamp) => timestamp > windowStart);

		const currentAttempts = attemptsRef.current.length;
		const newRemaining = Math.max(0, maxAttempts - currentAttempts);
		const allowed = currentAttempts < maxAttempts;

		setRemaining(newRemaining);
		setIsAllowed(allowed);

		if (!allowed && attemptsRef.current.length > 0) {
			const oldestAttempt = attemptsRef.current[0];
			if (oldestAttempt !== undefined) {
				const resetTime = Math.ceil((oldestAttempt + windowMs - now) / 1000);
				setResetIn(resetTime);
			}
		} else {
			setResetIn(0);
		}
	}, [maxAttempts, windowMs]);

	const execute = useCallback(
		async <T>(action: () => T | Promise<T>): Promise<{ success: boolean; result?: T }> => {
			const now = Date.now();
			const windowStart = now - windowMs;

			// Clean up old attempts
			attemptsRef.current = attemptsRef.current.filter((timestamp) => timestamp > windowStart);

			// Check if rate limit exceeded
			if (attemptsRef.current.length >= maxAttempts) {
				const oldestAttempt = attemptsRef.current[0];
				const resetTime =
					oldestAttempt !== undefined ? Math.ceil((oldestAttempt + windowMs - now) / 1000) : 60; // Default to 60 seconds if undefined

				setIsAllowed(false);
				setResetIn(resetTime);
				setRemaining(0);

				if (onLimitExceeded) {
					onLimitExceeded(resetTime);
				}

				// Set up automatic state update when rate limit resets
				if (resetTimerRef.current) {
					clearTimeout(resetTimerRef.current);
				}
				resetTimerRef.current = setTimeout(() => {
					updateState();
				}, resetTime * 1000);

				return { success: false };
			}

			// Record this attempt
			attemptsRef.current.push(now);
			updateState();

			// Execute the action
			try {
				const result = await Promise.resolve(action());
				return { success: true, result };
			} catch (error) {
				throw error;
			}
		},
		[maxAttempts, windowMs, onLimitExceeded, updateState]
	);

	const reset = useCallback(() => {
		attemptsRef.current = [];
		setIsAllowed(true);
		setRemaining(maxAttempts);
		setResetIn(0);

		if (resetTimerRef.current) {
			clearTimeout(resetTimerRef.current);
			resetTimerRef.current = null;
		}
	}, [maxAttempts]);

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (resetTimerRef.current) {
				clearTimeout(resetTimerRef.current);
			}
		};
	}, []);

	return {
		isAllowed,
		remaining,
		resetIn,
		execute,
		reset,
	};
}
