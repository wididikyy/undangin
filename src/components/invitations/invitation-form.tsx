"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import type { Template, Invitation } from "@/types/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { slugify } from "@/lib/utils"

interface InvitationFormProps {
  templates: Template[]
  invitation?: Invitation
}

export default function InvitationForm({ templates, invitation }: InvitationFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState("details")
  const [selectedTemplate, setSelectedTemplate] = useState<number>(
    invitation?.template_id || (templates && templates.length > 0 ? templates[0].id : 1)
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    bride_name: invitation?.bride_name || "",
    groom_name: invitation?.groom_name || "",
    wedding_date: invitation?.wedding_date ? new Date(invitation.wedding_date).toISOString().split("T")[0] : "",
    venue: invitation?.venue || "",
    address: invitation?.address || "",
    ceremony_time: invitation?.ceremony_time || "",
    reception_time: invitation?.reception_time || "",
    custom_message: invitation?.custom_message || "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTemplateSelect = (templateId: number) => {
    setSelectedTemplate(templateId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Generate a slug from the couple's names
      const slug = slugify(`${formData.bride_name}-${formData.groom_name}-wedding`)

      const invitationData: Invitation = {
        ...formData,
        template_id: selectedTemplate,
        user_id: user.id,
        status: "draft",
        slug,
        id: invitation ? invitation.id : 0, 
        created_at: invitation?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (invitation) {
        // Update existing invitation
        const { error: updateError } = await supabase.from("invitations").update(invitationData).eq("id", invitation.id)

        if (updateError) throw updateError
      } else {
        // Create new invitation
        const { error: insertError } = await supabase.from("invitations").insert(invitationData)

        if (insertError) throw insertError
      }

      router.push("/dashboard/invitations")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the invitation")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Wedding Details</TabsTrigger>
          <TabsTrigger value="template">Choose Template</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bride_name">Bride's Name</Label>
              <Input
                id="bride_name"
                name="bride_name"
                value={formData.bride_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groom_name">Groom's Name</Label>
              <Input
                id="groom_name"
                name="groom_name"
                value={formData.groom_name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wedding_date">Wedding Date</Label>
            <Input
              id="wedding_date"
              name="wedding_date"
              type="date"
              value={formData.wedding_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue Name</Label>
            <Input id="venue" name="venue" value={formData.venue} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Venue Address</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ceremony_time">Ceremony Time</Label>
              <Input
                id="ceremony_time"
                name="ceremony_time"
                type="time"
                value={formData.ceremony_time}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reception_time">Reception Time</Label>
              <Input
                id="reception_time"
                name="reception_time"
                type="time"
                value={formData.reception_time}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom_message">Custom Message (Optional)</Label>
            <Textarea
              id="custom_message"
              name="custom_message"
              value={formData.custom_message}
              onChange={handleInputChange}
              rows={4}
              placeholder="Add a personal message to your guests..."
            />
          </div>
        </TabsContent>

        <TabsContent value="template" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates && templates.length > 0 ? (
              templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer overflow-hidden transition-all ${
                    selectedTemplate === template.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="aspect-video relative">
                    {/* Use the Cloudinary URL directly */}
                    <img
                      src={template.preview_image}
                      alt={template.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No templates available.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/invitations")}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {invitation ? "Update Invitation" : "Create Invitation"}
        </Button>
      </div>
    </form>
  )
}