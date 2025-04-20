import { createClient } from "@/utils/supabase/server"
import InvitationForm from "@/components/invitations/invitation-form"
import type { Template } from "@/types/supabase"

export default async function NewInvitationPage() {
  const supabase = await createClient()

  // Get templates
  const { data: templates } = await supabase.from("templates").select("*").order("name")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Invitation</h1>
        <p className="text-muted-foreground">Fill in the details for your wedding invitation</p>
      </div>

      <InvitationForm templates={templates as Template[]} />
    </div>
  )
}
