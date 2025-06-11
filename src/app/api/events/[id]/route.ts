import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { eventSchema } from "@/lib/validations"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
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
        _count: {
          select: {
            rsvps: true,
          },
        },
      },
    })

    if (!event) {
      return new NextResponse("Event not found", { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = eventSchema.parse(json)

    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
        ...(session.user.role !== "ADMIN" && {
          creatorId: session.user.id,
        }),
      },
    })

    if (!event) {
      return new NextResponse("Event not found", { status: 404 })
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        location: body.location,
        isPublic: body.isPublic,
        capacity: body.capacity,
        status: body.status,
        customFields: body.customFields,
      },
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
        ...(session.user.role !== "ADMIN" && {
          creatorId: session.user.id,
        }),
      },
    })

    if (!event) {
      return new NextResponse("Event not found", { status: 404 })
    }

    await prisma.event.delete({
      where: {
        id: params.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 