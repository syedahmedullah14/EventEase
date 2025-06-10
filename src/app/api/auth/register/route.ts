import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/db"
import { registerSchema } from "@/lib/validations"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = registerSchema.parse(json)

    // Check if email already exists
    const exists = await prisma.user.findUnique({
      where: {
        email: body.email.toLowerCase(),
      },
    })

    if (exists) {
      return new NextResponse("Email already exists", { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(body.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        password: hashedPassword,
        role: body.role,
      },
    })

    // Remove password from response
    const { password: _, ...result } = user

    return NextResponse.json(result)
  } catch (error) {
    console.error("Registration error:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 