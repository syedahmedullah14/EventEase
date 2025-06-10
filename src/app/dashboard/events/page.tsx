import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { EventList } from "@/components/events/event-list"
import { CreateEventButton } from "@/components/events/create-event-button"
import { Role } from "@prisma/client"

export default async function EventsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  // Fetch events based on user role
  const where = session.user.role === "ADMIN"
    ? {}
    : session.user.role === "STAFF"
    ? { isPublic: true }
    : { creatorId: session.user.id }

  const events = await prisma.event.findMany({
    where,
    include: {
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          rsvps: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">
            Manage your events and track RSVPs
          </p>
        </div>
        <CreateEventButton />
      </div>
      <EventList events={events} userRole={session.user.role as Role} />
    </div>
  )
} 