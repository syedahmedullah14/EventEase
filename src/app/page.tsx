import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Globe2, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1920")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 px-4 py-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Make Your Events Memorable
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                EventEase helps you create, manage, and track events effortlessly. From small gatherings to large conferences, we've got you covered.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/dashboard">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-black hover:bg-white/40">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Everything You Need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Powerful Event Management Made Simple
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              From planning to execution, EventEase provides all the tools you need to create successful events.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Calendar className="h-5 w-5 flex-none text-blue-600" />
                  Easy Scheduling
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Create and manage events with our intuitive interface. Set dates, times, and locations effortlessly.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Users className="h-5 w-5 flex-none text-blue-600" />
                  RSVP Management
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Track attendees, manage registrations, and export guest lists with ease.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Shield className="h-5 w-5 flex-none text-blue-600" />
                  Secure & Private
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Control who can view and attend your events with our robust privacy settings.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to start planning?
              <br />
              Create your first event today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Join thousands of event planners who trust EventEase for their event management needs.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/register">Sign Up Now</Link>
              </Button>
              <Button asChild variant="link" size="lg" className="text-white hover:text-blue-100">
                <Link href="/dashboard/events">View Events →</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 