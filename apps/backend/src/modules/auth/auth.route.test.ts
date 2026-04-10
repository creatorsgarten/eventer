import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Hoist mock stubs so they are available inside vi.mock() factories ────────
// vi.mock() calls are hoisted to the top of the file by Vitest, so any
// variables referenced inside a factory must also be hoisted via vi.hoisted().

const { mockGetUser, mockSetSession, mockFind, mockFindByEmail, mockCreate } = vi.hoisted(() => ({
	mockGetUser: vi.fn(),
	mockSetSession: vi.fn(),
	mockFind: vi.fn(),
	mockFindByEmail: vi.fn(),
	mockCreate: vi.fn(),
}));

// ─── Mock all external dependencies before importing the module under test ───

vi.mock("#backend/infrastructure/db", () => ({
	db: {},
}));

vi.mock("#backend/infrastructure/db/supabase", () => ({
	supabase: {
		auth: {
			getUser: mockGetUser,
			setSession: mockSetSession,
		},
	},
}));

vi.mock("#backend/modules/user/user.repository", () => ({
	UserRepository: vi.fn().mockImplementation(() => ({
		find: mockFind,
		findByEmail: mockFindByEmail,
		create: mockCreate,
	})),
}));

// Bypass the rate-limit plugin so tests are not throttled.
vi.mock("../../shared/middleware/rate-limit.middleware", async () => {
	const { Elysia } = await import("elysia");
	return {
		rateLimit: vi.fn().mockReturnValue(new Elysia()),
		rateLimitPresets: { strict: { max: 5, duration: 60000 } },
	};
});

// ─── Import the router under test (must be after all vi.mock() calls) ────────
import { authRouter } from "./auth.route";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Send a request to the Elysia router and return the parsed JSON response.
 */
async function handleRequest(
	method: string,
	path: string,
	options?: { body?: unknown; headers?: Record<string, string> }
) {
	const request = new Request(`http://localhost${path}`, {
		method,
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
		body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
	});

	const response = await authRouter.handle(request);

	let data: unknown;
	try {
		data = await response.json();
	} catch {
		data = null;
	}

	return { response, data };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Auth Router – GET /api/auth/session", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return { user: null } when no session cookie is present", async () => {
		// Default mock returns undefined → reveals the missing null-guard bug.
		const { response, data } = await handleRequest("GET", "/api/auth/session");

		expect(response.status).toBe(200);
		expect(data).toEqual({ user: null });
	});

	it("should return { user: null } when supabase returns an error", async () => {
		mockGetUser.mockResolvedValueOnce({
			data: { user: null },
			error: new Error("invalid JWT"),
		});

		const { response, data } = await handleRequest("GET", "/api/auth/session", {
			headers: { Cookie: "session=bad-token" },
		});

		expect(response.status).toBe(200);
		expect(data).toEqual({ user: null });
	});

	it("should return { user: null } when the user is not found in the database", async () => {
		mockGetUser.mockResolvedValueOnce({
			data: { user: { id: "supabase-uid-1" } },
			error: null,
		});
		mockFind.mockResolvedValueOnce(null);

		const { response, data } = await handleRequest("GET", "/api/auth/session", {
			headers: { Cookie: "session=valid-token" },
		});

		expect(response.status).toBe(200);
		expect(data).toEqual({ user: null });
	});

	it("should return the user object when the session is valid and the user exists", async () => {
		mockGetUser.mockResolvedValueOnce({
			data: { user: { id: "supabase-uid-1" } },
			error: null,
		});
		mockFind.mockResolvedValueOnce({
			id: "db-user-id",
			email: "alice@example.com",
			name: "Alice",
			avatarUrl: "https://cdn.example.com/alice.jpg",
		});

		const { response, data } = await handleRequest("GET", "/api/auth/session", {
			headers: { Cookie: "session=valid-token" },
		});

		expect(response.status).toBe(200);
		expect((data as Record<string, unknown>).user).toMatchObject({
			id: "db-user-id",
			email: "alice@example.com",
			name: "Alice",
			avatar_url: "https://cdn.example.com/alice.jpg",
		});
	});

	it("should omit avatar_url from the response when the user has no avatar", async () => {
		mockGetUser.mockResolvedValueOnce({
			data: { user: { id: "supabase-uid-2" } },
			error: null,
		});
		mockFind.mockResolvedValueOnce({
			id: "db-user-id-2",
			email: "bob@example.com",
			name: "Bob",
			avatarUrl: null,
		});

		const { data } = await handleRequest("GET", "/api/auth/session", {
			headers: { Cookie: "session=valid-token" },
		});

		const user = (data as Record<string, unknown>).user as Record<string, unknown>;
		expect(user).not.toHaveProperty("avatar_url");
	});
});

// ─────────────────────────────────────────────────────────────────────────────

describe("Auth Router – POST /api/auth/callback", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const validBody = {
		access_token: "google-access-token-abc",
		refresh_token: "google-refresh-token-xyz",
	};

	const mockSupabaseSession = { access_token: "new-session-token" };

	const mockSupabaseUser = {
		id: "supabase-uid-99",
		email: "carol@example.com",
		user_metadata: {
			full_name: "Carol",
			avatar_url: "https://cdn.example.com/carol.jpg",
			picture: null,
		},
	};

	it("should create a new user and return success when the user does not exist yet", async () => {
		mockSetSession.mockResolvedValueOnce({
			data: { session: mockSupabaseSession, user: mockSupabaseUser },
			error: null,
		});
		mockFindByEmail.mockResolvedValueOnce(null); // user doesn't exist
		mockCreate.mockResolvedValueOnce({});

		const { response, data } = await handleRequest("POST", "/api/auth/callback", {
			body: validBody,
		});

		expect(response.status).toBe(200);
		const res = data as Record<string, unknown>;
		expect(res.success).toBe(true);
		expect((res.user as Record<string, unknown>).email).toBe("carol@example.com");

		expect(mockCreate).toHaveBeenCalledOnce();
		expect(mockCreate).toHaveBeenCalledWith({
			id: "supabase-uid-99",
			email: "carol@example.com",
			name: "Carol",
			avatar_url: "https://cdn.example.com/carol.jpg",
		});
	});

	it("should skip user creation when the user already exists", async () => {
		mockSetSession.mockResolvedValueOnce({
			data: { session: mockSupabaseSession, user: mockSupabaseUser },
			error: null,
		});
		mockFindByEmail.mockResolvedValueOnce({
			id: "existing-db-id",
			email: "carol@example.com",
		});

		const { response, data } = await handleRequest("POST", "/api/auth/callback", {
			body: validBody,
		});

		expect(response.status).toBe(200);
		expect((data as Record<string, unknown>).success).toBe(true);
		expect(mockCreate).not.toHaveBeenCalled();
	});

	it("should fall back to picture when avatar_url is absent in user_metadata", async () => {
		const userWithPictureOnly = {
			...mockSupabaseUser,
			user_metadata: {
				full_name: "Carol",
				avatar_url: null,
				picture: "https://cdn.example.com/carol-picture.jpg",
			},
		};

		mockSetSession.mockResolvedValueOnce({
			data: { session: mockSupabaseSession, user: userWithPictureOnly },
			error: null,
		});
		mockFindByEmail.mockResolvedValueOnce(null);
		mockCreate.mockResolvedValueOnce({});

		const { data } = await handleRequest("POST", "/api/auth/callback", {
			body: validBody,
		});

		const user = (data as Record<string, unknown>).user as Record<string, unknown>;
		expect(user.avatar_url).toBe("https://cdn.example.com/carol-picture.jpg");
	});

	it("should not include avatar_url in the response when both avatar_url and picture are absent", async () => {
		const userNoAvatar = {
			...mockSupabaseUser,
			user_metadata: { full_name: "Carol", avatar_url: null, picture: null },
		};

		mockSetSession.mockResolvedValueOnce({
			data: { session: mockSupabaseSession, user: userNoAvatar },
			error: null,
		});
		mockFindByEmail.mockResolvedValueOnce(null);
		mockCreate.mockResolvedValueOnce({});

		const { data } = await handleRequest("POST", "/api/auth/callback", {
			body: validBody,
		});

		const user = (data as Record<string, unknown>).user as Record<string, unknown>;
		expect(user).not.toHaveProperty("avatar_url");
	});

	it("should respond 500 when supabase.setSession returns an error", async () => {
		mockSetSession.mockResolvedValueOnce({
			data: { session: null, user: null },
			error: new Error("Token expired"),
		});

		const { response } = await handleRequest("POST", "/api/auth/callback", {
			body: validBody,
		});

		expect(response.status).toBe(500);
	});

	it("should respond 500 when the supabase user has no email", async () => {
		mockSetSession.mockResolvedValueOnce({
			data: {
				session: mockSupabaseSession,
				user: { ...mockSupabaseUser, email: null },
			},
			error: null,
		});

		const { response } = await handleRequest("POST", "/api/auth/callback", {
			body: validBody,
		});

		expect(response.status).toBe(500);
	});

	/**
	 * Validates the Elysia body schema (AuthCallbackSchema) rejects incomplete
	 * payloads. Elysia returns 400 (not 422) for body validation failures.
	 */
	it("should respond 400 when refresh_token is missing from the request body", async () => {
		const { response } = await handleRequest("POST", "/api/auth/callback", {
			body: { access_token: "only-access" },
		});

		expect(response.status).toBe(400);
	});

	it("should respond 400 when the request body is empty", async () => {
		const { response } = await handleRequest("POST", "/api/auth/callback", {
			body: {},
		});

		expect(response.status).toBe(400);
	});
});

// ─────────────────────────────────────────────────────────────────────────────

describe("Auth Router – POST /api/auth/logout", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return 200 and success message when a session cookie is present", async () => {
		const { response, data } = await handleRequest("POST", "/api/auth/logout", {
			headers: { Cookie: "session=active-token" },
		});

		expect(response.status).toBe(200);
		const res = data as Record<string, unknown>;
		expect(res.success).toBe(true);
		expect(res.message).toBe("Logged out successfully");
	});

	it("should return 400 when no session cookie is present", async () => {
		const { response, data } = await handleRequest("POST", "/api/auth/logout");

		expect(response.status).toBe(400);
		expect((data as Record<string, unknown>).error).toBe("No session to logout");
	});
});
