export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      link_types: {
        Row: {
          id: number
          created_at: string | null
          name: string
        }
        Insert: {
          id?: number
          created_at?: string | null
          name: string
        }
        Update: {
          id?: number
          created_at?: string | null
          name?: string
        }
      }
      organization_members: {
        Row: {
          role_id: number
          id: number
          created_at: string | null
          organization_id: string
          user_id: string
        }
        Insert: {
          role_id: number
          id?: number
          created_at?: string | null
          organization_id: string
          user_id: string
        }
        Update: {
          role_id?: number
          id?: number
          created_at?: string | null
          organization_id?: string
          user_id?: string
        }
      }
      organization_roles: {
        Row: {
          id: number
          name: string | null
          description: string | null
        }
        Insert: {
          id?: number
          name?: string | null
          description?: string | null
        }
        Update: {
          id?: number
          name?: string | null
          description?: string | null
        }
      }
      organizations: {
        Row: {
          id: string
          created_at: string | null
          description: string | null
          website: string | null
          name: string
        }
        Insert: {
          id: string
          created_at?: string | null
          description?: string | null
          website?: string | null
          name: string
        }
        Update: {
          id?: string
          created_at?: string | null
          description?: string | null
          website?: string | null
          name?: string
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          avatar_url?: string | null
          website?: string | null
        }
      }
      project_links: {
        Row: {
          type_id: number
          project_id: string | null
          id: number
          created_at: string | null
          url: string
        }
        Insert: {
          type_id: number
          project_id?: string | null
          id?: number
          created_at?: string | null
          url: string
        }
        Update: {
          type_id?: number
          project_id?: string | null
          id?: number
          created_at?: string | null
          url?: string
        }
      }
      project_members: {
        Row: {
          project_id: string | null
          id: number
          user_id: string
          role_id: number
          created_at: string | null
        }
        Insert: {
          project_id?: string | null
          id?: number
          user_id: string
          role_id: number
          created_at?: string | null
        }
        Update: {
          project_id?: string | null
          id?: number
          user_id?: string
          role_id?: number
          created_at?: string | null
        }
      }
      project_roles: {
        Row: {
          id: number
          name: string | null
          description: string | null
        }
        Insert: {
          id?: number
          name?: string | null
          description?: string | null
        }
        Update: {
          id?: number
          name?: string | null
          description?: string | null
        }
      }
      projects: {
        Row: {
          created_at: string | null
          name: string
          description: string | null
          id: string | null
        }
        Insert: {
          created_at?: string | null
          name: string
          description?: string | null
          id?: string | null
        }
        Update: {
          created_at?: string | null
          name?: string
          description?: string | null
          id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
