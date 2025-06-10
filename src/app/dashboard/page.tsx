import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">Welcome, {session.user.name}!</h1>
      <p className="text-muted-foreground mt-2">You are logged in as {session.user.role}</p>
    </div>
  )
} 