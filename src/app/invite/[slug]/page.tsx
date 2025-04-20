import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import RsvpForm from "@/components/invitations/rsvp-form"

export default async function InvitationPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const supabase = await createClient()

  // Get invitation data
  const { data: invitation } = await supabase
    .from("invitations")
    .select(`
      *,
      templates(*)
    `)
    .eq("slug", slug)
    .single()

  if (!invitation) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-serif font-light text-rose-800">
            {invitation.bride_name} & {invitation.groom_name}
          </h1>

          <p className="text-xl md:text-2xl font-light text-gray-600">We invite you to celebrate our wedding</p>

          <div className="my-12 text-center">
            <div className="text-3xl md:text-4xl font-serif mb-2">
              {formatDate(invitation.wedding_date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </div>
            {invitation.ceremony_time && (
              <div className="text-xl text-gray-600">Ceremony: {invitation.ceremony_time}</div>
            )}
            {invitation.reception_time && (
              <div className="text-xl text-gray-600">Reception: {invitation.reception_time}</div>
            )}
          </div>

          <div className="my-12 space-y-2">
            <h2 className="text-2xl md:text-3xl font-serif">Location</h2>
            <p className="text-xl font-medium">{invitation.venue}</p>
            <p className="text-lg text-gray-600">{invitation.address}</p>
          </div>

          {invitation.custom_message && (
            <div className="my-12 max-w-2xl mx-auto">
              <p className="text-lg italic text-gray-700">{invitation.custom_message}</p>
            </div>
          )}

          <div className="my-12 max-w-md mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif mb-6">RSVP</h2>
            <RsvpForm invitationId={invitation.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
