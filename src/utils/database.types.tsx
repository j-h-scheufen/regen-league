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
      "bioregens2020-catalogue": {
        Row: {
          id: number
          created_at: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
        }
      }
      hub_members: {
        Row: {
          role_id: number
          hub_id: string
          profile_id: string
        }
        Insert: {
          role_id: number
          hub_id: string
          profile_id: string
        }
        Update: {
          role_id?: number
          hub_id?: string
          profile_id?: string
        }
      }
      hub_roles: {
        Row: {
          name: string
          id: number
          description: string | null
        }
        Insert: {
          name: string
          id?: number
          description?: string | null
        }
        Update: {
          name?: string
          id?: number
          description?: string | null
        }
      }
      hubs: {
        Row: {
          id: string
          created_at: string | null
          description: string | null
          website: string | null
          name: string
        }
        Insert: {
          id?: string
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
      profiles: {
        Row: {
          updated_at: string | null
          id: string
          username: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          updated_at?: string | null
          id: string
          username?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          updated_at?: string | null
          id?: string
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
          project_id: string
          role_id: number
          profile_id: string
        }
        Insert: {
          project_id: string
          role_id: number
          profile_id: string
        }
        Update: {
          project_id?: string
          role_id?: number
          profile_id?: string
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
          id: string
        }
        Insert: {
          created_at?: string | null
          name: string
          description?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          name?: string
          description?: string | null
          id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_hub: {
        Args: { name: string; description: string; firstadmin: string }
        Returns: string
      }
      add_project: {
        Args: { name: string; description: string; firstadmin: string }
        Returns: string
      }
      get_hub_members: {
        Args: { hub_id: string }
        Returns: Record<string, unknown>[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}