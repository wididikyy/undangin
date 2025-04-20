"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Mail, Users, Settings, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Invitations",
    href: "/dashboard/invitations",
    icon: Mail,
  },
  {
    title: "Guest List",
    href: "/dashboard/guests",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r h-[calc(100vh-4rem)] p-4 hidden md:block">
      <div className="space-y-4">
        <Button asChild className="w-full" size="lg">
          <Link href="/dashboard/invitations/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invitation
          </Link>
        </Button>
        <div className="py-2">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
