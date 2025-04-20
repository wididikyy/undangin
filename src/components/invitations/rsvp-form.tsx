"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RsvpFormProps {
  invitationId: string
}

export default function RsvpForm({ invitationId }: RsvpFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    attending: "yes",
    number_of_guests: "1",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, attending: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase.from("guests").insert({
        invitation_id: invitationId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        attending: formData.attending === "yes",
        number_of_guests: Number.parseInt(formData.number_of_guests),
        message: formData.message,
      })

      if (insertError) throw insertError

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your RSVP")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle>Thank You!</CardTitle>
          <CardDescription>Your RSVP has been submitted successfully</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">We look forward to celebrating with you!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>RSVP</CardTitle>
        <CardDescription>Please let us know if you can attend our wedding</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
          </div>

          <div className="space-y-2">
            <Label>Will you attend?</Label>
            <RadioGroup value={formData.attending} onValueChange={handleRadioChange} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="attending-yes" />
                <Label htmlFor="attending-yes">Yes, I'll be there</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="attending-no" />
                <Label htmlFor="attending-no">No, I can't make it</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.attending === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="number_of_guests">Number of Guests</Label>
              <Input
                id="number_of_guests"
                name="number_of_guests"
                type="number"
                min="1"
                max="10"
                value={formData.number_of_guests}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any dietary restrictions or special notes..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit RSVP
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
