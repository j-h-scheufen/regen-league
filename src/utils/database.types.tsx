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
      bioregens2020_bioregions: {
        Row: {
          name: string
          link: string | null
          code: string
          id: number
          subrealm_id: number
        }
        Insert: {
          name: string
          link?: string | null
          code: string
          id?: number
          subrealm_id: number
        }
        Update: {
          name?: string
          link?: string | null
          code?: string
          id?: number
          subrealm_id?: number
        }
      }
      bioregens2020_ecoregions: {
        Row: {
          name: string
          link: string | null
          id: number
          bioregion_id: number
        }
        Insert: {
          name: string
          link?: string | null
          id?: number
          bioregion_id: number
        }
        Update: {
          name?: string
          link?: string | null
          id?: number
          bioregion_id?: number
        }
      }
      bioregions2020_realms: {
        Row: {
          id: number
          name: string
          link: string | null
        }
        Insert: {
          id?: number
          name: string
          link?: string | null
        }
        Update: {
          id?: number
          name?: string
          link?: string | null
        }
      }
      bioregions2020_subrealms: {
        Row: {
          realm_id: number | null
          id: number
          name: string
        }
        Insert: {
          realm_id?: number | null
          id?: number
          name: string
        }
        Update: {
          realm_id?: number | null
          id?: number
          name?: string
        }
      }
      hub_members: {
        Row: {
          role_id: number
          hub_id: string
          user_id: string
        }
        Insert: {
          role_id: number
          hub_id: string
          user_id: string
        }
        Update: {
          role_id?: number
          hub_id?: string
          user_id?: string
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
          name: string
        }
        Insert: {
          id?: string
          created_at?: string | null
          description?: string | null
          name: string
        }
        Update: {
          id?: string
          created_at?: string | null
          description?: string | null
          name?: string
        }
      }
      link_types: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      links: {
        Row: {
          type_id: number
          owner_id: string
          id: number
          url: string
        }
        Insert: {
          type_id: number
          owner_id: string
          id?: number
          url: string
        }
        Update: {
          type_id?: number
          owner_id?: string
          id?: number
          url?: string
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
      project_members: {
        Row: {
          project_id: string
          role_id: number
          user_id: string
        }
        Insert: {
          project_id: string
          role_id: number
          user_id: string
        }
        Update: {
          project_id?: string
          role_id?: number
          user_id?: string
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
      projects_to_hubs: {
        Row: {
          project_id: string
          hub_id: string
        }
        Insert: {
          project_id: string
          hub_id: string
        }
        Update: {
          project_id?: string
          hub_id?: string
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
      get_project_members: {
        Args: { project_id: string }
        Returns: Record<string, unknown>[]
      }
      get_user_hubs: {
        Args: { user_id: string }
        Returns: Record<string, unknown>[]
      }
      get_user_projects: {
        Args: { user_id: string }
        Returns: Record<string, unknown>[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
