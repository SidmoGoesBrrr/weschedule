
"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { userLogin } from "@/lib/serverUserUtil"

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full bg-background">
            <header className="w-full border-b-2 border-border bg-background sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-heading text-main [font-family:var(--font-new-york)]">
                        WeSchedule
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link href="/eventcreator">
                            <Button variant="neutral" size="sm">
                                Create Event
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="min-h-[calc(100vh-73px)] px-4 py-16 flex items-center justify-center">
                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-stretch">
                    <section className="flex flex-col justify-center gap-8">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-border bg-secondary-background px-4 py-2 shadow-shadow">
                            <span className="h-2.5 w-2.5 rounded-full bg-main" />
                            <span className="text-sm font-base">Secure access for organizers and guests</span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl font-heading leading-tight [font-family:var(--font-new-york)]">
                                welcome back to
                                <br />
                                <span className="block text-main text-6xl md:text-8xl mt-3">WeSchedule</span>
                            </h1>

                            <p className="text-lg md:text-xl text-foreground/80 max-w-xl">
                                Sign in to manage events, review availability, and keep your scheduling flow simple.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="border-2 border-border bg-secondary-background p-4 shadow-shadow rounded-base">
                                <p className="text-sm font-base text-foreground/70">Fast access</p>
                                <p className="text-lg font-heading mt-1">Quick sign-in</p>
                            </div>
                            <div className="border-2 border-border bg-secondary-background p-4 shadow-shadow rounded-base">
                                <p className="text-sm font-base text-foreground/70">Smart scheduling</p>
                                <p className="text-lg font-heading mt-1">Stay organized</p>
                            </div>
                            <div className="border-2 border-border bg-secondary-background p-4 shadow-shadow rounded-base">
                                <p className="text-sm font-base text-foreground/70">Simple design</p>
                                <p className="text-lg font-heading mt-1">Clean workflow</p>
                            </div>
                        </div>
                    </section>

                    <section className="flex items-center justify-center">
                        <div className="w-full max-w-lg border-2 border-border bg-secondary-background shadow-shadow rounded-base p-6 md:p-8">
                            <div className="mb-8">
                                <h2 className="text-3xl md:text-4xl font-heading [font-family:var(--font-new-york)]">
                                    Login
                                </h2>
                                <p className="mt-2 text-foreground/70">
                                    Enter your email and password to continue.
                                </p>
                            </div>

                            <form
                                action={async (formData) => {
                                    console.log(await userLogin(formData))
                                }}
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-heading">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="text"
                                        name="email"
                                        placeholder="email"
                                        required
                                        className="flex h-11 w-full rounded-base border-2 border-border bg-background px-3 py-2 text-sm font-base text-foreground placeholder:text-foreground/50 shadow-shadow focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-heading">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="password"
                                        className="flex h-11 w-full rounded-base border-2 border-border bg-background px-3 py-2 text-sm font-base text-foreground placeholder:text-foreground/50 shadow-shadow focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="inline-flex h-11 w-full items-center justify-center rounded-base border-2 border-border bg-main px-4 py-2 text-sm font-base text-main-foreground shadow-shadow transition-all duration-150 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                                >
                                    Login
                                </button>
                            </form>

                            <div className="mt-6 flex items-center justify-between text-sm text-foreground/70">
                                <span>Need an invite? Ask your organizer.</span>
                                <Link href="/" className="font-heading text-main hover:underline">
                                    Back home
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}


