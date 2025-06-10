import { Role } from "@prisma/client"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  description?: string | null
  date: Date
  location: string
  creatorId: string
  createdAt: Date
  updatedAt: Date
  creator?: User
  rsvps?: RSVP[]
  _count?: {
    rsvps: number
  }
}

export interface RSVP {
  id: string
  name: string
  email: string
  eventId: string
  createdAt: Date
  event?: Event
}

export interface DashboardStats {
  totalEvents: number
  totalRsvps: number
  upcomingEvents: number
} 