"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Invitation } from "@/types/supabase"

export default function GuestFilter({ invitations }: { invitations: Invitation[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  
  const invitationId = searchParams.get("invitation")
  const invitationIdNumber = invitationId ? parseInt(invitationId, 10) : null

  const selectedInvitation = invitations.find(
    (invitation) => invitation.id === invitationIdNumber
  )

  const handleSelect = (value: string) => {
    setOpen(false)
    
    if (value === "all") {
      router.push("/dashboard/guests")
    } else {
      router.push(`/dashboard/guests?invitation=${value}`)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <p className="text-sm font-medium">Filter by invitation:</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[200px] justify-between"
          >
            {selectedInvitation 
              ? `${selectedInvitation.bride_name} & ${selectedInvitation.groom_name}`
              : "All Invitations"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search invitation..." />
            <CommandList>
              <CommandEmpty>No invitation found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => handleSelect("all")}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !invitationId ? "opacity-100" : "opacity-0"
                    )}
                  />
                  All Invitations
                </CommandItem>
                {invitations.map((invitation) => (
                  <CommandItem
                    key={invitation.id}
                    value={invitation.id.toString()} // Convert to string for value
                    onSelect={() => handleSelect(invitation.id.toString())} // Convert to string for handleSelect
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        invitation.id.toString() === invitationId // Convert to string for comparison
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {invitation.bride_name} & {invitation.groom_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
