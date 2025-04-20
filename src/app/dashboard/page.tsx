import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Mail, Users, Eye } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get invitation count
  const { count: invitationCount } = await supabase
    .from("invitations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)

  // Get guest count
  const { data: invitations } = await supabase.from("invitations").select("id").eq("user_id", user?.id)

  let guestCount = 0
  if (invitations && invitations.length > 0) {
    const invitationIds = invitations.map((inv) => inv.id)
    const { count } = await supabase
      .from("guests")
      .select("*", { count: "exact", head: true })
      .in("invitation_id", invitationIds)

    guestCount = count || 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/invitations/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invitation
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invitationCount || 0}</div>
            <p className="text-xs text-muted-foreground">Wedding invitations created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guestCount}</div>
            <p className="text-xs text-muted-foreground">Guests added to your invitations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">View your recent activity</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/invitations/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Invitation
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/guests">
                <Users className="mr-2 h-4 w-4" />
                Manage Guest List
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/invitations">
                <Eye className="mr-2 h-4 w-4" />
                View My Invitations
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>New to WeddingInvite? Here&apos;s how to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">1</div>
              <div>
                <p className="font-medium">Create an invitation</p>
                <p className="text-sm text-muted-foreground">Start by creating your first digital invitation</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">2</div>
              <div>
                <p className="font-medium">Customize your template</p>
                <p className="text-sm text-muted-foreground">Choose a template and customize it with your details</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">3</div>
              <div>
                <p className="font-medium">Share with guests</p>
                <p className="text-sm text-muted-foreground">Share your invitation link with your wedding guests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
