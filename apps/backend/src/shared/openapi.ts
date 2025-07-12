export const openApiDocumentation = {
  openapi: "3.0.0",
  info: {
    title: "Eventer API",
    version: "1.0.0",
    description:
      "A comprehensive event management API with type-safe endpoints",
    contact: {
      name: "Eventer API Support",
      email: "support@eventer.api",
    },
  },
  servers: [
    {
      url: "http://localhost:4000/api",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      sessionAuth: {
        type: "apiKey",
        in: "cookie",
        name: "session",
        description: "Session cookie authentication",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "user_123" },
          username: { type: "string", example: "john_doe" },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "username", "email", "createdAt", "updatedAt"],
      },
      CreateUser: {
        type: "object",
        properties: {
          id: { type: "string", example: "user_123" },
          username: { type: "string", example: "john_doe" },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
        },
        required: ["id", "username", "email"],
      },
      UpdateUser: {
        type: "object",
        properties: {
          username: { type: "string", example: "john_doe_updated" },
          email: {
            type: "string",
            format: "email",
            example: "john.updated@example.com",
          },
        },
      },
      Event: {
        type: "object",
        properties: {
          id: { type: "string", example: "event_123" },
          name: { type: "string", example: "Tech Conference 2025" },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
          location: { type: "string", example: "Convention Center Hall A" },
          description: { type: "string", nullable: true },
          createdBy: { type: "string", example: "user_123" },
        },
        required: [
          "id",
          "name",
          "startDate",
          "endDate",
          "location",
          "createdBy",
        ],
      },
      CreateEvent: {
        type: "object",
        properties: {
          name: { type: "string", example: "Tech Conference 2025" },
          startDate: {
            type: "string",
            format: "date-time",
            example: "2025-07-15T09:00:00Z",
          },
          endDate: {
            type: "string",
            format: "date-time",
            example: "2025-07-15T17:00:00Z",
          },
          location: { type: "string", example: "Convention Center Hall A" },
          description: {
            type: "string",
            nullable: true,
            example: "Annual technology conference",
          },
        },
        required: ["name", "startDate", "endDate", "location"],
      },
      Agenda: {
        type: "object",
        properties: {
          id: { type: "string", example: "agenda_123" },
          eventId: { type: "string", example: "event_123" },
          start: { type: "string", example: "09:00" },
          end: { type: "string", example: "10:30" },
          personincharge: { type: "string", example: "John Doe" },
          duration: { type: "integer", example: 90 },
          activity: { type: "string", example: "Keynote Presentation" },
          remarks: {
            type: "string",
            nullable: true,
            example: "Special equipment needed",
          },
        },
        required: [
          "id",
          "eventId",
          "start",
          "end",
          "personincharge",
          "duration",
          "activity",
        ],
      },
      AuthUser: {
        type: "object",
        properties: {
          id: { type: "string", example: "user_123" },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          username: { type: "string", example: "John Doe" },
          avatar_url: { type: "string", format: "uri", nullable: true },
        },
        required: ["id", "email", "username"],
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Something went wrong" },
        },
        required: ["error"],
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: {
            type: "string",
            example: "Operation completed successfully",
          },
        },
        required: ["success", "message"],
      },
      AuthSuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Authentication successful" },
          user: { $ref: "#/components/schemas/AuthUser" },
        },
        required: ["success", "message", "user"],
      },
      PaginatedResponse: {
        type: "object",
        properties: {
          data: { type: "array", items: {} },
          pagination: {
            type: "object",
            properties: {
              page: { type: "integer", example: 1 },
              limit: { type: "integer", example: 10 },
              total: { type: "integer", example: 100 },
            },
            required: ["page", "limit", "total"],
          },
        },
        required: ["data", "pagination"],
      },
    },
  },
  security: [
    {
      sessionAuth: [],
    },
  ],
  tags: [
    {
      name: "Authentication",
      description: "User authentication endpoints",
    },
    {
      name: "Users",
      description: "User management endpoints",
    },
    {
      name: "Events",
      description: "Event management endpoints",
    },
    {
      name: "Agenda",
      description: "Agenda management endpoints",
    },
  ],
  paths: {
    "/": {
      get: {
        tags: ["Home"],
        summary: "Welcome to the Eventer API",
        description: "Returns a welcome message",
        responses: {
          200: {
            description: "Welcome message",
            content: {
              "text/plain": {
                schema: { $ref: "#/components/schemas/HomeResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/google": {
      get: {
        tags: ["Authentication"],
        summary: "Initiate Google OAuth",
        description: "Redirects to Google OAuth for authentication",
        responses: {
          302: {
            description: "Redirect to Google OAuth",
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/callback": {
      post: {
        tags: ["Authentication"],
        summary: "Complete OAuth callback",
        description: "Handles OAuth callback with tokens",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  access_token: { type: "string" },
                  refresh_token: { type: "string" },
                },
                required: ["access_token", "refresh_token"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthSuccessResponse" },
              },
            },
          },
          400: {
            description: "Bad request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Logout user",
        description: "Clears the user session",
        security: [{ sessionAuth: [] }],
        responses: {
          200: {
            description: "Logout successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/event": {
      get: {
        tags: ["Events"],
        summary: "List events",
        description: "Get a paginated list of events",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "string", default: "1" },
            description: "Page number",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "string", default: "10" },
            description: "Items per page",
          },
          {
            name: "sortBy",
            in: "query",
            schema: { type: "string" },
            description: "Sort field",
          },
          {
            name: "sortOrder",
            in: "query",
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
            description: "Sort order",
          },
        ],
        responses: {
          200: {
            description: "Events retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/PaginatedResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Event" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Events"],
        summary: "Create event",
        description: "Create a new event (requires authentication)",
        security: [{ sessionAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateEvent" },
            },
          },
        },
        responses: {
          201: {
            description: "Event created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Event" },
              },
            },
          },
          400: {
            description: "Bad request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};
