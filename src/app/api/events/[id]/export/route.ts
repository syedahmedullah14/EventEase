import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { format } from "date-fns"
import { Prisma } from "@prisma/client"

type RSVP = {
  id: string
  name: string
  email: string
  customData: Prisma.JsonValue | null
  createdAt: Date
  updatedAt: Date
  eventId: string
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get the event and check permissions
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!event) {
      return new NextResponse("Event not found", { status: 404 })
    }

    // Only allow admin, staff, or event creator to export RSVPs
    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "STAFF" &&
      event.creator.id !== session.user.id
    ) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get all RSVPs for the event
    const rsvps = await prisma.rSVP.findMany({
      where: { eventId: params.id },
      orderBy: { createdAt: "asc" },
    }) as RSVP[]

    // Convert RSVPs to CSV format
    const headers = ["Name", "Email", "Registration Date", "Custom Data"]
    const rows = rsvps.map((rsvp) => [
      rsvp.name,
      rsvp.email,
      format(rsvp.createdAt, "PPP"),
      rsvp.customData ? JSON.stringify(rsvp.customData) : "",
    ])

    // Create CSV content with proper escaping for CSV values
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => {
          // Escape quotes and wrap in quotes
          const escaped = cell.toString().replace(/"/g, '""')
          return `"${escaped}"`
        }).join(",")
      ),
    ].join("\n")

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="event-${params.id}-rsvps.csv"`,
      },
    })
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 