import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
})

export const registerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  role: z.enum(["ADMIN", "STAFF", "EVENT_OWNER"]),
})

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(1000).optional(),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required").max(100),
  isPublic: z.boolean().default(true),
  capacity: z.number().optional(),
  customFields: z.record(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]).default("PUBLISHED"),
})

export const rsvpSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  customData: z.record(z.string()).optional(),
}) 