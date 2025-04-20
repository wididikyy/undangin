export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
    public: {
        Tables: {
            invitations: {
                Row: {
                    id: number
                    created_at: string
                    updated_at: string
                    user_id: string
                    bride_name: string
                    groom_name: string
                    wedding_date: string
                    venue: string
                    address: string
                    reception_time: string
                    ceremony_time: string
                    template_id: number
                    custom_message: string
                    status: string
                    slug: string
                }
                Insert: {
                    id?: number
                    created_at?: string
                    updated_at?: string
                    user_id: string
                    bride_name: string
                    groom_name: string
                    wedding_date: string
                    venue: string
                    address: string
                    reception_time?: string
                    ceremony_time?: string
                    template_id: number
                    custom_message?: string
                    status?: string
                    slug: string
                }
                Update: {
                    id?: number
                    created_at?: string
                    updated_at?: string
                    user_id?: string
                    bride_name?: string
                    groom_name?: string
                    wedding_date?: string
                    venue?: string
                    address?: string
                    reception_time?: string
                    ceremony_time?: string
                    template_id?: number
                    custom_message?: string
                    status?: string
                    slug?: string
                }
            }
            templates: {
                Row: {
                    id: number
                    name: string
                    description: string
                    preview_image: string
                    created_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    description: string
                    preview_image: string
                    created_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    description?: string
                    preview_image?: string
                    created_at?: string
                }
            }
            guests: {
                Row: {
                    id: number
                    invitation_id: number
                    name: string
                    email: string
                    phone: string
                    attending: boolean | null
                    number_of_guests: number | null
                    message: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    invitation_id: number
                    name: string
                    email?: string
                    phone?: string
                    attending?: boolean | null
                    number_of_guests?: number | null
                    message?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    invitation_id?: number
                    name?: string
                    email?: string
                    phone?: string
                    attending?: boolean | null
                    number_of_guests?: number | null
                    message?: string | null
                    created_at?: string
                }
            }
        }
    }
}

export type Invitation = Database["public"]["Tables"]["invitations"]["Row"]
export type Template = Database["public"]["Tables"]["templates"]["Row"]
export type Guest = Database["public"]["Tables"]["guests"]["Row"]
