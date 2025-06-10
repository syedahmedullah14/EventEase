import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { rsvpSchema } from "@/lib/validations"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await req.json()
    const body = rsvpSchema.parse(json)

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { rsvps: true },
        },
      },
    })

    if (!event) {
      return new NextResponse("Event not found", { status: 404 })
    }

    if (!event.isPublic) {
      return new NextResponse("Event is private", { status: 403 })
    }

    if (event.capacity && event._count.rsvps >= event.capacity) {
      return new NextResponse("Event is at capacity", { status: 400 })
    }

    // Check if user has already RSVP'd
    const existingRSVP = await prisma.rSVP.findUnique({
      where: {
        eventId_email: {
          eventId: params.id,
          email: body.email,
        },
      },
    })

    if (existingRSVP) {
      return new NextResponse("Already RSVP'd to this event", { status: 400 })
    }

    const rsvp = await prisma.rSVP.create({
      data: {
        name: body.name,
        email: body.email,
        eventId: params.id,
      },
    })

    return NextResponse.json(rsvp)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 