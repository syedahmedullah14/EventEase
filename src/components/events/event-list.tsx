'use client'

import { format } from "date-fns"
import Link from "next/link"
import { Role, Prisma } from "@prisma/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "../ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"

type Event = {
  id: string
  title: string
  description: string | null
  date: Date
  location: string
  isPublic: boolean
  capacity: number | null
  status: "DRAFT" | "PUBLISHED" | "CANCELLED"
  customFields: Prisma.JsonValue | null
  createdAt: Date
  updatedAt: Date
  creatorId: string
  creator: {
    name: string
    email: string
  }
  _count: {
    rsvps: number
  }
}

interface EventListProps {
  events: Event[]
  userRole: Role
}

export function EventList({ events, userRole }: EventListProps) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id} className="flex flex-col hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  event.status === "PUBLISHED"
                    ? "default"
                    : event.status === "DRAFT"
                    ? "secondary"
                    : "destructive"
                }
                className="capitalize"
              >
                {event.status.toLowerCase()}
              </Badge>
              {!event.isPublic && (
                <Badge variant="outline" className="ml-2">
                  Private
                </Badge>
              )}
            </div>
            <CardTitle className="line-clamp-2 text-xl leading-tight">
              {event.title}
            </CardTitle>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{format(new Date(event.date), "PPP 'at' p")}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>
                  {event._count.rsvps} {event.capacity && `/ ${event.capacity}`} attendees
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {event.description || "No description provided."}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 pt-6">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href={`/event/${event.id}`}>View Details</Link>
            </Button>
            <Button variant="default" asChild className="w-full sm:w-auto">
              <Link href={`/dashboard/events/${event.id}`}>
                Manage Event
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 