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
      epa_regions_1: {
        Row: {
          name: string
          link: string | null
          id: number
          code: string
        }
        Insert: {
          name: string
          link?: string | null
          id?: number
          code: string
        }
        Update: {
          name?: string
          link?: string | null
          id?: number
          code?: string
        }
      }
      epa_regions_2: {
        Row: {
          name: string
          link: string | null
          id: number
          parent_id: number
          code: string
        }
        Insert: {
          name: string
          link?: string | null
          id?: number
          parent_id: number
          code: string
        }
        Update: {
          name?: string
          link?: string | null
          id?: number
          parent_id?: number
          code?: string
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
      hub_members: {
        Row: {
          hub_id: string
          user_id: string
          role_id: number
        }
        Insert: {
          hub_id: string
          user_id: string
          role_id: number
        }
        Update: {
          hub_id?: string
          user_id?: string
          role_id?: number
        }
      }
      hub_roles: {
        Row: {
          id: number
          name: string
          description: string | null
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
        }
      }
      hubs: {
        Row: {
          id: string
          created_at: string | null
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          name?: string
          description?: string | null
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
          id: number
          url: string
          type_id: number
          owner_id: string
        }
        Insert: {
          id?: number
          url: string
          type_id: number
          owner_id: string
        }
        Update: {
          id?: number
          url?: string
          type_id?: number
          owner_id?: string
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
          id: number
          name: string
          parent_id: number
          link: string | null
        }
        Insert: {
          id?: number
          name: string
          parent_id: number
          link?: string | null
        }
        Update: {
          id?: number
          name?: string
          parent_id?: number
          link?: string | null
        }
      }
      oe_regions_3: {
        Row: {
          name: string
          link: string | null
          id: number
          parent_id: number
          code: string
        }
        Insert: {
          name: string
          link?: string | null
          id?: number
          parent_id: number
          code: string
        }
        Update: {
          name?: string
          link?: string | null
          id?: number
          parent_id?: number
          code?: string
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
          id: string
          created_at: string
          username: string | null
          avatar_filename: string | null
        }
        Insert: {
          id: string
          created_at?: string
          username?: string | null
          avatar_filename?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string | null
          avatar_filename?: string | null
        }
      }
      project_members: {
        Row: {
          user_id: string
          role_id: number
          project_id: string
        }
        Insert: {
          user_id: string
          role_id: number
          project_id: string
        }
        Update: {
          user_id?: string
          role_id?: number
          project_id?: string
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
          owner_id: string
          oe_region_id: number | null
          rl_region_id: string | null
          epa_region_id: number | null
          oe_level: number | null
          epa_level: number | null
          rl_level: number | null
        }
        Insert: {
          owner_id: string
          oe_region_id?: number | null
          rl_region_id?: string | null
          epa_region_id?: number | null
          oe_level?: number | null
          epa_level?: number | null
          rl_level?: number | null
        }
        Update: {
          owner_id?: string
          oe_region_id?: number | null
          rl_region_id?: string | null
          epa_region_id?: number | null
          oe_level?: number | null
          epa_level?: number | null
          rl_level?: number | null
        }
      }
      rl_regions_1: {
        Row: {
          name: string
          link: string | null
          id: string
          description: string | null
        }
        Insert: {
          name: string
          link?: string | null
          id?: string
          description?: string | null
        }
        Update: {
          name?: string
          link?: string | null
          id?: string
          description?: string | null
        }
      }
      rl_regions_2: {
        Row: {
          name: string
          link: string | null
          id: string
          description: string | null
          parent_id: string
        }
        Insert: {
          name: string
          link?: string | null
          id?: string
          description?: string | null
          parent_id: string
        }
        Update: {
          name?: string
          link?: string | null
          id?: string
          description?: string | null
          parent_id?: string
        }
      }
      rl_regions_3: {
        Row: {
          name: string
          link: string | null
          id: string
          description: string | null
          parent_id: string
        }
        Insert: {
          name: string
          link?: string | null
          id?: string
          description?: string | null
          parent_id: string
        }
        Update: {
          name?: string
          link?: string | null
          id?: string
          description?: string | null
          parent_id?: string
        }
      }
      rl_regions_4: {
        Row: {
          name: string
          link: string | null
          id: string
          description: string | null
          parent_id: string
        }
        Insert: {
          name: string
          link?: string | null
          id?: string
          description?: string | null
          parent_id: string
        }
        Update: {
          name?: string
          link?: string | null
          id?: string
          description?: string | null
          parent_id?: string
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
      get_rl_region_info_l1: {
        Args: { region_id: string }
        Returns: Record<string, unknown>[]
      }
      get_rl_region_info_l2: {
        Args: { region_id: string }
        Returns: Record<string, unknown>[]
      }
      get_rl_region_info_l3: {
        Args: { region_id: string }
        Returns: Record<string, unknown>[]
      }
      get_rl_region_info_l4: {
        Args: { region_id: string }
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
