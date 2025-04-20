import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Users, CheckCircle, XCircle } from 'lucide-react'
import GuestTable from "@/components/guests/guest-table"
import GuestFilter from "@/components/guests/guest-filter"
import { Toaster } from "@/components/ui/toaster"

export default async function GuestsPage() {
  const supabase = await createClient()

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser()
  

  // Get user's invitations
  const { data: invitations } = await supabase
    .from("invitations")
    .select("*") // Select all fields
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  // Get all guests from all user's invitations
  let guests = []
  if (invitations && invitations.length > 0) {
    const invitationIds = invitations.map((inv) => inv.id)
    const { data: guestsData } = await supabase
      .from("guests")
      .select(`
        *,
        invitations(bride_name, groom_name)
      `)
      .in("invitation_id", invitationIds)
      .order("created_at", { ascending: false })

    guests = guestsData || []
  }

  // Calculate statistics
  const totalGuests = guests.length
  const confirmedGuests = guests.filter((guest) => guest.attending === true).length
  const declinedGuests = guests.filter((guest) => guest.attending === false).length
  const pendingGuests = guests.filter((guest) => guest.attending === null).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Guest Management</h1>
        <Button asChild>
          <Link href="/dashboard/guests/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Guest
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGuests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedGuests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declined</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{declinedGuests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingGuests}</div>
          </CardContent>
        </Card>
      </div>

      {invitations && invitations.length > 0 ? (
        <>
          <GuestFilter invitations={invitations} />
          <GuestTable guests={guests} invitations={invitations} />
        </>
      ) : (
        <Card className="p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Users className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No invitations yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You need to create an invitation before you can add guests.
            </p>
            <Button asChild>
              <Link href="/dashboard/invitations/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Invitation
              </Link>
            </Button>
          </div>
        </Card>
      )}
      <Toaster/>
    </div>
  )
}
