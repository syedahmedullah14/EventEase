import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { eventSchema } from "@/lib/validations"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = eventSchema.parse(json)

    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        location: body.location,
        isPublic: body.isPublic,
        capacity: body.capacity,
        customFields: body.customFields,
        creatorId: session.user.id,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    const where = {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
      AND: session.user.role === "ADMIN"
        ? undefined
        : session.user.role === "STAFF"
        ? [{ isPublic: true }]
        : [{ creatorId: session.user.id }],
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
          AND: session.user.role === "ADMIN"
            ? undefined
            : session.user.role === "STAFF"
            ? [{ isPublic: true }]
            : [{ creatorId: session.user.id }],
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
        orderBy: {
          date: "asc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
        AND: session.user.role === "ADMIN"
          ? undefined
          : session.user.role === "STAFF"
          ? [{ isPublic: true }]
          : [{ creatorId: session.user.id }],
      } }),
    ])

    return NextResponse.json({
      events,
      total,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 