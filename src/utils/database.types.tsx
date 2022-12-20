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
      entities: {
        Row: {
          id: string
          name: string
          description: string | null
          type_id: number
          created_by: string
          created_at: string
          position: number[] | null
          polygon: Json | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type_id: number
          created_by: string
          created_at?: string
          position?: number[] | null
          polygon?: Json | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type_id?: number
          created_by?: string
          created_at?: string
          position?: number[] | null
          polygon?: Json | null
        }
      }
      entity_types: {
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
          created_by: string
        }
        Insert: {
          id?: string
          created_at?: string | null
          name: string
          description?: string | null
          created_by?: string
        }
        Update: {
          id?: string
          created_at?: string | null
          name?: string
          description?: string | null
          created_by?: string
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
          status: number
        }
        Insert: {
          id: string
          created_at?: string
          username?: string | null
          avatar_filename?: string | null
          status?: number
        }
        Update: {
          id?: string
          created_at?: string
          username?: string | null
          avatar_filename?: string | null
          status?: number
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
          created_by: string
        }
        Insert: {
          created_at?: string | null
          name: string
          description?: string | null
          id?: string
          created_by?: string
        }
        Update: {
          created_at?: string | null
          name?: string
          description?: string | null
          id?: string
          created_by?: string
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
      relationships: {
        Row: {
          from_id: string
          to_id: string
          role_id: string
        }
        Insert: {
          from_id: string
          to_id: string
          role_id: string
        }
        Update: {
          from_id?: string
          to_id?: string
          role_id?: string
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
      roles: {
        Row: {
          id: string
          from_type: number
          to_type: number
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          from_type: number
          to_type: number
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          from_type?: number
          to_type?: number
          name?: string
          description?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_entity_source_candidates_by_type: {
        Args: { to_id: string; type_id: number }
        Returns: {
          id: string
          name: string
          description: string
          type_id: number
        }[]
      }
      get_entity_source_relations_by_type: {
        Args: { to_id: string; type_id: number }
        Returns: {
          id: string
          name: string
          description: string
          type_id: number
          role: string
        }[]
      }
      get_entity_target_candidates_by_type: {
        Args: { from_id: string; type_id: number }
        Returns: {
          id: string
          name: string
          description: string
          type_id: number
        }[]
      }
      get_entity_target_relations_by_type: {
        Args: { from_id: string; type_id: number }
        Returns: {
          id: string
          name: string
          description: string
          type_id: number
          role: string
        }[]
      }
      get_epa_region_info_l1: {
        Args: { region_id: number }
        Returns: { l1_id: number; l1_name: string; l1_link: string }[]
      }
      get_epa_region_info_l2: {
        Args: { region_id: number }
        Returns: {
          l1_id: number
          l1_name: string
          l1_link: string
          l2_id: number
          l2_name: string
          l2_link: string
        }[]
      }
      get_epa_region_info_l3: {
        Args: { region_id: number }
        Returns: {
          l1_id: number
          l1_name: string
          l1_link: string
          l2_id: number
          l2_name: string
          l2_link: string
          l3_id: number
          l3_name: string
          l3_link: string
        }[]
      }
      get_epa_region_info_l4: {
        Args: { region_id: number }
        Returns: {
          l1_id: number
          l1_name: string
          l1_link: string
          l2_id: number
          l2_name: string
          l2_link: string
          l3_id: number
          l3_name: string
          l3_link: string
          l4_id: number
          l4_name: string
          l4_link: string
        }[]
      }
      get_oe_region_info_l1: {
        Args: { region_id: number }
        Returns: { l1_id: number; l1_name: string; l1_link: string }[]
      }
      get_oe_region_info_l2: {
        Args: { region_id: number }
        Returns: {
          l1_id: number
          l1_name: string
          l1_link: string
          l2_id: number
          l2_name: string
          l2_link: string
        }[]
      }
      get_oe_region_info_l3: {
        Args: { region_id: number }
        Returns: {
          l1_id: number
          l1_name: string
          l1_link: string
          l2_id: number
          l2_name: string
          l2_link: string
          l3_id: number
          l3_name: string
          l3_link: string
        }[]
      }
      get_oe_region_info_l4: {
        Args: { region_id: number }
        Returns: {
          l1_id: number
          l1_name: string
          l1_link: string
          l2_id: number
          l2_name: string
          l2_link: string
          l3_id: number
          l3_name: string
          l3_link: string
          l4_id: number
          l4_name: string
          l4_link: string
        }[]
      }
      get_rl_region_info_l1: {
        Args: { region_id: string }
        Returns: { l1_id: string; l1_name: string; l1_link: string }[]
      }
      get_rl_region_info_l2: {
        Args: { region_id: string }
        Returns: {
          l1_id: string
          l1_name: string
          l1_link: string
          l2_id: string
          l2_name: string
          l2_link: string
        }[]
      }
      get_rl_region_info_l3: {
        Args: { region_id: string }
        Returns: {
          l1_id: string
          l1_name: string
          l1_link: string
          l2_id: string
          l2_name: string
          l2_link: string
          l3_id: string
          l3_name: string
          l3_link: string
        }[]
      }
      get_rl_region_info_l4: {
        Args: { region_id: string }
        Returns: {
          l1_id: string
          l1_name: string
          l1_link: string
          l2_id: string
          l2_name: string
          l2_link: string
          l3_id: string
          l3_name: string
          l3_link: string
          l4_id: string
          l4_name: string
          l4_link: string
        }[]
      }
      get_user_candidates: {
        Args: { entity_id: string }
        Returns: {
          user_id: string
          username: string
          avatar_filename: string
          status: number
        }[]
      }
      get_user_member: {
        Args: { user_id: string; entity_id: string }
        Returns: {
          user_id: string
          username: string
          avatar_filename: string
          role_name: string
        }[]
      }
      get_user_members: {
        Args: { entity_id: string }
        Returns: {
          user_id: string
          username: string
          avatar_filename: string
          role_name: string
        }[]
      }
      new_entity_with_user_relation: {
        Args: {
          name: string
          description: string
          entity_type_id: number
          role_id: string
          user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
