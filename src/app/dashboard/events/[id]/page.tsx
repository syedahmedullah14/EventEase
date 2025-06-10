import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CSVDownloadButton } from "@/components/events/csv-download-button"
import { UpdateEventForm } from "@/components/events/update-event-form"

interface EventPageProps {
  params: {
    id: string
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const event = await prisma.event.findUnique({
    where: {
      id: params.id,
      ...(session.user.role !== "ADMIN" && {
        creatorId: session.user.id,
      }),
    },
    include: {
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
      rsvps: {
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          rsvps: true,
        },
      },
    },
  })

  if (!event) {
    notFound()
  }

  const isAtCapacity = event.capacity ? event._count.rsvps >= event.capacity : false

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p className="text-muted-foreground">
          Created by {event.creator.name}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Date and Time</h3>
              <p>{format(event.date, "PPP 'at' p")}</p>
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{event.location}</p>
            </div>
            {event.description && (
              <div>
                <h3 className="font-semibold">Description</h3>
                <p>{event.description}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold">Visibility</h3>
              <p>{event.isPublic ? "Public" : "Private"}</p>
            </div>
            {event.capacity && (
              <div>
                <h3 className="font-semibold">Capacity</h3>
                <p>
                  {event._count.rsvps} / {event.capacity} spots filled
                </p>
              </div>
            )}
            <div>
              <h3 className="font-semibold">Status</h3>
              <p className="capitalize">{event.status.toLowerCase()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UpdateEventForm event={event} />
            <div className="space-y-2">
              <h3 className="font-semibold">Export RSVPs</h3>
              <CSVDownloadButton eventId={event.id} />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>RSVPs ({event._count.rsvps})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {event.rsvps.map((rsvp) => (
              <div
                key={rsvp.id}
                className="flex items-center justify-between border-b py-4 last:border-0"
              >
                <div>
                  <p className="font-medium">{rsvp.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {rsvp.email}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(rsvp.createdAt, "PPP")}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 