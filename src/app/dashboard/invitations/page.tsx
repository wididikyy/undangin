import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PlusCircle, Eye, Edit, Trash2, Share2, Mail } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function InvitationsPage() {
  const supabase = await createClient()

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user's invitations
  const { data: invitations } = await supabase
    .from("invitations")
    .select(`
      *,
      templates(name, preview_image)
    `)
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Invitations</h1>
        <Button asChild>
          <Link href="/dashboard/invitations/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invitation
          </Link>
        </Button>
      </div>

      {invitations && invitations.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 z-10" />
                <img
                  src={invitation.templates?.preview_image || "/placeholder.svg?height=300&width=500"}
                  alt={invitation.templates?.name || "Invitation template"}
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {invitation.bride_name} & {invitation.groom_name}
                  </h3>
                  <p className="text-sm text-white/80">{formatDate(invitation.wedding_date)}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Template:</p>
                    <p className="text-sm text-muted-foreground">{invitation.templates?.name || "Custom"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status:</p>
                    <p className="text-sm text-muted-foreground capitalize">{invitation.status}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/invite/${invitation.slug}`} target="_blank">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Link>
                </Button>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/invitations/${invitation.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Mail className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No invitations yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You haven&apos;t created any invitations yet. Create your first invitation to get started.
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
    </div>
  )
}
