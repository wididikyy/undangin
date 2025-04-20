"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckCircle, XCircle, MoreHorizontal, Pencil, Trash2, Mail } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Guest, Invitation } from "@/types/supabase"

export default function GuestTable({ guests, invitations }: { guests: Guest[], invitations: Invitation[] }) {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [filteredInvitationId, setFilteredInvitationId] = useState<number | null>(null) // Change type to number

  const filteredGuests = filteredInvitationId !== null
    ? guests.filter(guest => guest.invitation_id === filteredInvitationId)
    : guests

  const handleDelete = async () => {
    if (!selectedGuest) return

    try {
      const { error } = await supabase
        .from("guests")
        .delete()
        .eq("id", selectedGuest.id)

      if (error) throw error

      toast({
        title: "Guest deleted",
        description: "The guest has been removed successfully.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the guest. Please try again.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedGuest(null)
    }
  }

  const getInvitationName = (invitationId: number) => { // Change type to number
    const invitation = invitations.find(inv => inv.id === invitationId)
    return invitation ? `${invitation.bride_name} & ${invitation.groom_name}` : "Unknown"
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Invitation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuests.length > 0 ? (
              filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">{guest.name}</TableCell>
                  <TableCell>{guest.email || "-"}</TableCell>
                  <TableCell>{guest.phone || "-"}</TableCell>
                  <TableCell>{getInvitationName(guest.invitation_id)}</TableCell>
                  <TableCell>
                    {guest.attending === true && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" /> Attending
                      </Badge>
                    )}
                    {guest.attending === false && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <XCircle className="mr-1 h-3 w-3" /> Not Attending
                      </Badge>
                    )}
                    {guest.attending === null && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{guest.number_of_guests || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/guests/${guest.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`mailto:${guest.email}`}>
                            <Mail className="mr-2 h-4 w-4" /> Email
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedGuest(guest)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No guests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedGuest?.name} from your guest list.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
