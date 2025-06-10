import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard/nav"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link 
            href="/dashboard" 
            className="flex items-center space-x-2 transition-colors hover:text-blue-600"
          >
            <div className="flex items-center space-x-2">
              <span className="inline-block h-6 w-6 bg-blue-600 rounded-lg" />
              <span className="text-xl font-bold">EventEase</span>
            </div>
          </Link>
          <DashboardNav />
        </div>
      </header>

      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: '0.05'
        }}
      />

      <main className="relative z-10">
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  )
} 