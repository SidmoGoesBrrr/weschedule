"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

/**
 * Renders the site hero/home page layout with header, main hero content, video placeholder, and "How It Works" section.
 *
 * @returns A React element that displays a sticky header, a centered hero section with CTA and video demo placeholder, and a three-card "How It Works" grid.
 */
export default function HeroPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <header className="w-full border-b-2 border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-heading text-foreground">
            WeSchedule
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/create-event">
              <Button variant="neutral" size="sm">
                Create Event
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-background">
        <div className="max-w-6xl w-full mx-auto">
          {/* Main Message */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-heading mb-6 leading-tight">
              meet smarter with
              <br />
              <span className="text-6xl md:text-8xl text-main mt-5 block">WeSchedule</span>
            </h1>

            <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto mb-8">
              Schedule group meetings effortlessly with smart time suggestions, 
              calendar sync, and the Corq app.
            </p>
            <Link href="/create-event">
              <Button size="lg" className="text-lg px-8 py-6">
                Create Event
              </Button>
            </Link>
          </div>

          {/* Video Placeholder - Using Neobrutalism Box Pattern */}
          <div className="mt-16 mb-20">
            <div className="relative w-full max-w-4xl mx-auto border-2 border-border bg-secondary-background shadow-shadow rounded-base">
              <div className="aspect-video bg-foreground/5 flex items-center justify-center rounded-base">
                <div className="text-center">
                  <Button
                    variant="default"
                    size="icon"
                    className="w-20 h-20 rounded-full mb-4"
                    asChild
                  >
                    <div className="cursor-pointer">
                      <Play className="w-10 h-10 text-main-foreground ml-1" fill="currentColor" />
                    </div>
                  </Button>
                  <p className="text-lg font-heading">Video demo goes here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Using Neobrutalism Card Pattern */}
      <section className="w-full bg-secondary-background py-20 px-4 border-t-2 border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-heading text-center mb-16">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 - Neobrutalism Card */}
            <div className="border-2 border-border bg-background p-8 shadow-shadow rounded-base">
              <div className="text-4xl font-heading mb-4 text-main">01</div>
              <h3 className="text-2xl font-heading mb-4">Heading 1 here</h3>
              <p className="text-foreground/80 font-base">
                description 1 here
              </p>
            </div>

            {/* Step 2 - Neobrutalism Card */}
            <div className="border-2 border-border bg-background p-8 shadow-shadow rounded-base">
              <div className="text-4xl font-heading mb-4 text-main">02</div>
              <h3 className="text-2xl font-heading mb-4">Heading 2 here</h3>
              <p className="text-foreground/80 font-base">
                description 2 here
              </p>
            </div>

            {/* Step 3 - Neobrutalism Card */}
            <div className="border-2 border-border bg-background p-8 shadow-shadow rounded-base">
              <div className="text-4xl font-heading mb-4 text-main">03</div>
            <h3 className="text-2xl font-heading mb-4">Heading 3 here</h3>
              <p className="text-foreground/80 font-base">
                description 3 here
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
