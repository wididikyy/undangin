import Link from "next/link"
import { Button } from "@/components/ui/button"
import SiteHeader from "@/components/layout/site-header"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Create Beautiful Digital Wedding Invitations
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Design, customize, and share your wedding invitations online. Easy to use templates and RSVP
                  management.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/templates">View Templates</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Create your digital wedding invitation in three simple steps
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">1</div>
                  <h3 className="text-xl font-bold">Create an Account</h3>
                  <p className="text-gray-500">Sign up for free and get access to all our features</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">2</div>
                  <h3 className="text-xl font-bold">Choose a Template</h3>
                  <p className="text-gray-500">Select from our beautiful wedding invitation templates</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">3</div>
                  <h3 className="text-xl font-bold">Customize & Share</h3>
                  <p className="text-gray-500">Add your details, customize the design, and share with your guests</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
              © 2023 WeddingInvite. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
