import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { RSVPForm } from "@/components/events/rsvp-form"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"

interface EventPageProps {
  params: {
    id: string
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const session = await auth()
  
  const event = await prisma.event.findUnique({
    where: {
      id: params.id,
    },
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
  })

  if (!event || (!event.isPublic && !session)) {
    notFound()
  }

  const isAtCapacity = event.capacity ? event._count.rsvps >= event.capacity : false

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <p className="text-muted-foreground">
              Hosted by {event.creator.name}
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold">When</h2>
              <p>{format(event.date, "PPP 'at' p")}</p>
            </div>
            <div>
              <h2 className="font-semibold">Where</h2>
              <p>{event.location}</p>
            </div>
            {event.description && (
              <div>
                <h2 className="font-semibold">About</h2>
                <p>{event.description}</p>
              </div>
            )}
            <div>
              <h2 className="font-semibold">Attendees</h2>
              <p>
                {event._count.rsvps} {event.capacity && `/ ${event.capacity}`}{" "}
                registered
              </p>
            </div>
          </div>
          {isAtCapacity ? (
            <Button disabled className="w-full">
              Event is at capacity
            </Button>
          ) : (
            <RSVPForm eventId={event.id} />
          )}
        </div>
      </div>
    </div>
  )
} 