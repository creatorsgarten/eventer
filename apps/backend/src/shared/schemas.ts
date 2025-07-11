import { z } from "@hono/zod-openapi";

// User schemas
export const UserSchema = z
  .object({
    id: z.string().openapi({ example: "user_123" }),
    username: z.string().min(1).openapi({ example: "john_doe" }),
    email: z.string().email().openapi({ example: "john@example.com" }),
    createdAt: z
      .string()
      .datetime()
      .openapi({ example: "2023-01-01T00:00:00Z" }),
    updatedAt: z
      .string()
      .datetime()
      .openapi({ example: "2023-01-01T00:00:00Z" }),
  })
  .openapi("User");

export const CreateUserSchema = z
  .object({
    id: z.string().openapi({ example: "user_123" }),
    username: z.string().min(1).openapi({ example: "john_doe" }),
    email: z.string().email().openapi({ example: "john@example.com" }),
  })
  .openapi("CreateUser");

export const UpdateUserSchema = z
  .object({
    username: z
      .string()
      .min(1)
      .optional()
      .openapi({ example: "john_doe_updated" }),
    email: z
      .string()
      .email()
      .optional()
      .openapi({ example: "john.updated@example.com" }),
  })
  .openapi("UpdateUser");

// Event schemas
export const EventSchema = z
  .object({
    id: z.string().openapi({ example: "event_123" }),
    name: z.string().min(1).openapi({ example: "Tech Conference 2025" }),
    startDate: z
      .string()
      .datetime()
      .openapi({ example: "2025-07-15T09:00:00Z" }),
    endDate: z.string().datetime().openapi({ example: "2025-07-15T17:00:00Z" }),
    location: z
      .string()
      .min(1)
      .openapi({ example: "Convention Center Hall A" }),
    description: z.string().nullable().openapi({
      example: "Annual technology conference featuring the latest innovations",
    }),
    createdBy: z.string().openapi({ example: "user_123" }),
  })
  .openapi("Event");

export const CreateEventSchema = z
  .object({
    name: z.string().min(1).openapi({ example: "Tech Conference 2025" }),
    startDate: z
      .string()
      .datetime()
      .openapi({ example: "2025-07-15T09:00:00Z" }),
    endDate: z.string().datetime().openapi({ example: "2025-07-15T17:00:00Z" }),
    location: z
      .string()
      .min(1)
      .openapi({ example: "Convention Center Hall A" }),
    description: z.string().nullable().optional().openapi({
      example: "Annual technology conference featuring the latest innovations",
    }),
  })
  .openapi("CreateEvent");

// Agenda schemas
export const AgendaSchema = z
  .object({
    id: z.string().openapi({ example: "agenda_123" }),
    eventId: z.string().openapi({ example: "event_123" }),
    start: z.string().openapi({ example: "09:00" }),
    end: z.string().openapi({ example: "10:30" }),
    personincharge: z.string().min(1).openapi({ example: "John Doe" }),
    duration: z.number().int().positive().openapi({ example: 90 }),
    activity: z.string().min(1).openapi({ example: "Keynote Presentation" }),
    remarks: z
      .string()
      .default("")
      .openapi({ example: "Special equipment needed" }),
  })
  .openapi("Agenda");

export const CreateAgendaSchema = z
  .object({
    eventId: z.string().openapi({ example: "event_123" }),
    start: z.string().openapi({ example: "09:00" }),
    end: z.string().openapi({ example: "10:30" }),
    personincharge: z.string().min(1).openapi({ example: "John Doe" }),
    duration: z.number().int().positive().openapi({ example: 90 }),
    activity: z.string().min(1).openapi({ example: "Keynote Presentation" }),
    remarks: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "Special equipment needed" }),
  })
  .openapi("CreateAgenda");

// Auth schemas
export const AuthUserSchema = z
  .object({
    id: z.string().openapi({ example: "user_123" }),
    email: z.string().email().openapi({ example: "john@example.com" }),
    username: z.string().openapi({ example: "John Doe" }),
    avatar_url: z
      .string()
      .url()
      .optional()
      .openapi({ example: "https://example.com/avatar.jpg" }),
  })
  .openapi("AuthUser");

export const AuthCallbackSchema = z
  .object({
    access_token: z
      .string()
      .openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
    refresh_token: z
      .string()
      .openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
  })
  .openapi("AuthCallback");

// Query schemas
export const PaginationQuerySchema = z
  .object({
    page: z.string().optional().default("1").openapi({ example: "1" }),
    limit: z.string().optional().default("10").openapi({ example: "10" }),
    sortBy: z.string().optional().openapi({ example: "createdAt" }),
    sortOrder: z
      .enum(["asc", "desc"])
      .optional()
      .default("desc")
      .openapi({ example: "desc" }),
  })
  .openapi("PaginationQuery");

// Response schemas
export const SuccessResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    message: z
      .string()
      .openapi({ example: "Operation completed successfully" }),
  })
  .openapi("SuccessResponse");

export const ErrorResponseSchema = z
  .object({
    error: z.string().openapi({ example: "Something went wrong" }),
  })
  .openapi("ErrorResponse");

export const AuthSuccessResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: "Authentication successful" }),
    user: AuthUserSchema,
  })
  .openapi("AuthSuccessResponse");
