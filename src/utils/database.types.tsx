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
      custom_regions: {
        Row: {
          id: string
          created_by: string
          name: string
          description: string | null
          link: string | null
        }
        Insert: {
          id?: string
          created_by: string
          name: string
          description?: string | null
          link?: string | null
        }
        Update: {
          id?: string
          created_by?: string
          name?: string
          description?: string | null
          link?: string | null
        }
      }
      epa_regions_1: {
        Row: {
          code: string
          name: string
          link: string | null
          id: number
        }
        Insert: {
          code: string
          name: string
          link?: string | null
          id?: number
        }
        Update: {
          code?: string
          name?: string
          link?: string | null
          id?: number
        }
      }
      epa_regions_2: {
        Row: {
          parent_id: number
          code: string
          name: string
          link: string | null
          id: number
        }
        Insert: {
          parent_id: number
          code: string
          name: string
          link?: string | null
          id?: number
        }
        Update: {
          parent_id?: number
          code?: string
          name?: string
          link?: string | null
          id?: number
        }
      }
      epa_regions_3: {
        Row: {
          name: string
          link: string | null
          id: number
          parent_id: number
        }
        Insert: {
          name: string
          link?: string | null
          id?: number
          parent_id: number
        }
        Update: {
          name?: string
          link?: string | null
          id?: number
          parent_id?: number
        }
      }
      epa_regions_4: {
        Row: {
          parent_id: number
          name: string
          link: string | null
          id: number
        }
        Insert: {
          parent_id: number
          name: string
          link?: string | null
          id?: number
        }
        Update: {
          parent_id?: number
          name?: string
          link?: string | null
          id?: number
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
      oe_regions_1: {
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
      oe_regions_2: {
        Row: {
          parent_id: number
          link: string | null
          id: number
          name: string
        }
        Insert: {
          parent_id: number
          link?: string | null
          id?: number
          name: string
        }
        Update: {
          parent_id?: number
          link?: string | null
          id?: number
          name?: string
        }
      }
      oe_regions_3: {
        Row: {
          name: string
          link: string | null
          code: string
          id: number
          parent_id: number
        }
        Insert: {
          name: string
          link?: string | null
          code: string
          id?: number
          parent_id: number
        }
        Update: {
          name?: string
          link?: string | null
          code?: string
          id?: number
          parent_id?: number
        }
      }
      oe_regions_4: {
        Row: {
          name: string
          link: string | null
          id: number
          parent_id: number
        }
        Insert: {
          name: string
          link?: string | null
          id?: number
          parent_id: number
        }
        Update: {
          name?: string
          link?: string | null
          id?: number
          parent_id?: number
        }
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          username: string | null
          avatar_filename: string | null
        }
        Insert: {
          created_at?: string
          id: string
          username?: string | null
          avatar_filename?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          username?: string | null
          avatar_filename?: string | null
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
      region_associations: {
        Row: {
          oe_region_id: number | null
          custom_id: string | null
          oe_level: number | null
          epa_region_id: number | null
          epa_level: number | null
          owner_id: string
        }
        Insert: {
          oe_region_id?: number | null
          custom_id?: string | null
          oe_level?: number | null
          epa_region_id?: number | null
          epa_level?: number | null
          owner_id: string
        }
        Update: {
          oe_region_id?: number | null
          custom_id?: string | null
          oe_level?: number | null
          epa_region_id?: number | null
          epa_level?: number | null
          owner_id?: string
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
      get_epa_region_info_l1: {
        Args: { region_id: number }
        Returns: Record<string, unknown>[]
      }
      get_epa_region_info_l2: {
        Args: { region_id: number }
        Returns: Record<string, unknown>[]
      }
      get_epa_region_info_l3: {
        Args: { region_id: number }
        Returns: Record<string, unknown>[]
      }
      get_epa_region_info_l4: {
        Args: { region_id: number }
        Returns: Record<string, unknown>[]
      }
      get_hub_members: {
        Args: { hub_id: string }
        Returns: Record<string, unknown>[]
      }
      get_oe_region_info_l1: {
        Args: { region_id: number }
        Returns: Record<string, unknown>[]
      }
      get_oe_region_info_l2: {
        Args: { region_id: number }
        Returns: Record<string, unknown>[]
      }
      get_oe_region_info_l3: {
        Args: { region_id: number }
        Returns: Record<string, unknown>[]
      }
      get_oe_region_info_l4: {
        Args: { region_id: number }
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
