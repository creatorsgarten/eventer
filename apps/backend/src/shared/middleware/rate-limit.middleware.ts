import { Elysia } from "elysia";

interface RateLimitConfig {
	/**
	 * Maximum number of requests allowed within the duration window
	 */
	max: number;

	/**
	 * Time window in milliseconds
	 */
	duration: number;

	/**
	 * Optional custom key generator function
	 * Defaults to using IP address
	 */
	generator?: (context: {
		request: Request;
		headers: Record<string, string | undefined>;
	}) => string;

	/**
	 * Error message when rate limit is exceeded
	 */
	message?: string;

	/**
	 * Skip rate limiting based on custom logic
	 */
	skip?: (context: { request: Request }) => boolean;
}

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

class RateLimiter {
	private store: Map<string, RateLimitEntry> = new Map();
	private cleanupInterval: Timer;

	constructor() {
		// Clean up expired entries every minute
		this.cleanupInterval = setInterval(() => {
			const now = Date.now();
			for (const [key, entry] of this.store.entries()) {
				if (entry.resetTime < now) {
					this.store.delete(key);
				}
			}
		}, 60000);
	}

	public check(
		key: string,
		max: number,
		duration: number
	): { allowed: boolean; remaining: number; resetTime: number } {
		const now = Date.now();
		const entry = this.store.get(key);

		// No existing entry or entry has expired
		if (!entry || entry.resetTime < now) {
			const resetTime = now + duration;
			this.store.set(key, { count: 1, resetTime });
			return {
				allowed: true,
				remaining: max - 1,
				resetTime,
			};
		}

		// Increment count and check if limit exceeded
		entry.count++;
		this.store.set(key, entry);

		return {
			allowed: entry.count <= max,
			remaining: Math.max(0, max - entry.count),
			resetTime: entry.resetTime,
		};
	}

	public destroy() {
		clearInterval(this.cleanupInterval);
		this.store.clear();
	}
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

/**
 * Rate limiting middleware for Elysia
 *
 * @example
 * ```ts
 * app.use(rateLimit({
 *   max: 5,              // 5 requests
 *   duration: 60000,     // per minute
 * }))
 * ```
 */
export function rateLimit(config: RateLimitConfig) {
	const { max, duration, generator, message, skip } = config;

	return new Elysia({ name: "rate-limit" }).onBeforeHandle(({ request, set, headers }) => {
		// Skip rate limiting if custom skip function returns true
		if (skip?.({ request })) {
			return;
		}

		// Generate unique key for this client
		const key = generator ? generator({ request, headers }) : getClientIdentifier(request, headers);

		// Check rate limit
		const result = rateLimiter.check(key, max, duration);

		// Set rate limit headers
		set.headers["X-RateLimit-Limit"] = max.toString();
		set.headers["X-RateLimit-Remaining"] = result.remaining.toString();
		set.headers["X-RateLimit-Reset"] = new Date(result.resetTime).toISOString();

		// If limit exceeded, return 429 Too Many Requests
		if (!result.allowed) {
			set.status = 429;
			const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
			set.headers["Retry-After"] = retryAfter.toString();

			throw new Error(message || `Too many requests. Please try again in ${retryAfter} seconds.`);
		}
	});
}

/**
 * Get client identifier from request
 * Tries to use IP address from various headers, falls back to random identifier
 */
function getClientIdentifier(
	request: Request,
	headers: Record<string, string | undefined>
): string {
	// Try to get IP from common headers
	const forwardedFor = headers["x-forwarded-for"];
	if (forwardedFor) {
		return forwardedFor.split(",")[0]?.trim() || "unknown";
	}

	const realIp = headers["x-real-ip"];
	if (realIp) {
		return realIp;
	}

	const cfConnectingIp = headers["cf-connecting-ip"];
	if (cfConnectingIp) {
		return cfConnectingIp;
	}

	// Fallback to URL+User-Agent combo if no IP available
	const userAgent = headers["user-agent"] || "unknown";
	return `${request.url}-${userAgent}`;
}

/**
 * Predefined rate limit configurations
 */
export const rateLimitPresets = {
	/**
	 * Strict rate limit for sensitive operations (auth, password reset, etc.)
	 * 5 requests per minute
	 */
	strict: { max: 5, duration: 60000 },

	/**
	 * Moderate rate limit for API endpoints
	 * 30 requests per minute
	 */
	moderate: { max: 30, duration: 60000 },

	/**
	 * Relaxed rate limit for public endpoints
	 * 100 requests per minute
	 */
	relaxed: { max: 100, duration: 60000 },
};
