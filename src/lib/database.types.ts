export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          agreed_price: number
          completed_at: string | null
          created_at: string | null
          id: string
          listing_id: string | null
          platform_fee: number | null
          provider_id: string
          requester_id: string
          scheduled_at: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          task_request_id: string | null
        }
        Insert: {
          agreed_price: number
          completed_at?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string | null
          platform_fee?: number | null
          provider_id: string
          requester_id: string
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          task_request_id?: string | null
        }
        Update: {
          agreed_price?: number
          completed_at?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string | null
          platform_fee?: number | null
          provider_id?: string
          requester_id?: string
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          task_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_task_request_id_fkey"
            columns: ["task_request_id"]
            isOneToOne: false
            referencedRelation: "task_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          avg_rating: number | null
          booking_count: number | null
          category: Database["public"]["Enums"]["listing_category"]
          created_at: string | null
          description: string
          fts: unknown
          id: string
          image_urls: string[] | null
          price: number
          pricing_type: Database["public"]["Enums"]["pricing_type"]
          provider_id: string
          status: Database["public"]["Enums"]["listing_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          avg_rating?: number | null
          booking_count?: number | null
          category: Database["public"]["Enums"]["listing_category"]
          created_at?: string | null
          description: string
          fts?: unknown
          id?: string
          image_urls?: string[] | null
          price: number
          pricing_type?: Database["public"]["Enums"]["pricing_type"]
          provider_id: string
          status?: Database["public"]["Enums"]["listing_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          avg_rating?: number | null
          booking_count?: number | null
          category?: Database["public"]["Enums"]["listing_category"]
          created_at?: string | null
          description?: string
          fts?: unknown
          id?: string
          image_urls?: string[] | null
          price?: number
          pricing_type?: Database["public"]["Enums"]["pricing_type"]
          provider_id?: string
          status?: Database["public"]["Enums"]["listing_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          captured_at: string | null
          created_at: string | null
          id: string
          platform_fee: number | null
          released_at: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          captured_at?: string | null
          created_at?: string | null
          id?: string
          platform_fee?: number | null
          released_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          captured_at?: string | null
          created_at?: string | null
          id?: string
          platform_fee?: number | null
          released_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          avg_rating: number | null
          bio: string | null
          campus: string
          class_year: string | null
          completed_gigs: number | null
          created_at: string | null
          email: string
          hourly_rate: number | null
          id: string
          is_available: boolean | null
          major: string | null
          name: string
          skills: string[] | null
          trust_score: number | null
          updated_at: string | null
          verification_tier: number | null
          wallet_balance: number | null
        }
        Insert: {
          avatar_url?: string | null
          avg_rating?: number | null
          bio?: string | null
          campus?: string
          class_year?: string | null
          completed_gigs?: number | null
          created_at?: string | null
          email: string
          hourly_rate?: number | null
          id: string
          is_available?: boolean | null
          major?: string | null
          name: string
          skills?: string[] | null
          trust_score?: number | null
          updated_at?: string | null
          verification_tier?: number | null
          wallet_balance?: number | null
        }
        Update: {
          avatar_url?: string | null
          avg_rating?: number | null
          bio?: string | null
          campus?: string
          class_year?: string | null
          completed_gigs?: number | null
          created_at?: string | null
          email?: string
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          major?: string | null
          name?: string
          skills?: string[] | null
          trust_score?: number | null
          updated_at?: string | null
          verification_tier?: number | null
          wallet_balance?: number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          tags: string[] | null
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          tags?: string[] | null
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_requests: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          category: Database["public"]["Enums"]["listing_category"]
          created_at: string | null
          deadline: string | null
          description: string
          id: string
          location: string | null
          requester_id: string
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          urgency: Database["public"]["Enums"]["urgency_level"] | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          category: Database["public"]["Enums"]["listing_category"]
          created_at?: string | null
          deadline?: string | null
          description: string
          id?: string
          location?: string | null
          requester_id: string
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          urgency?: Database["public"]["Enums"]["urgency_level"] | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          category?: Database["public"]["Enums"]["listing_category"]
          created_at?: string | null
          deadline?: string | null
          description?: string
          id?: string
          location?: string | null
          requester_id?: string
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          urgency?: Database["public"]["Enums"]["urgency_level"] | null
        }
        Relationships: [
          {
            foreignKeyName: "task_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "disputed"
      listing_category:
        | "tutoring"
        | "design"
        | "photography"
        | "coding"
        | "moving"
        | "cleaning"
        | "errands"
        | "beauty"
        | "tech_support"
        | "events"
        | "other"
      listing_status: "active" | "paused" | "archived"
      payment_status:
        | "pending"
        | "authorized"
        | "captured"
        | "released"
        | "refunded"
        | "failed"
      pricing_type: "hourly" | "fixed" | "negotiable"
      task_status:
        | "open"
        | "assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
      urgency_level: "low" | "medium" | "high" | "urgent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "disputed",
      ],
      listing_category: [
        "tutoring",
        "design",
        "photography",
        "coding",
        "moving",
        "cleaning",
        "errands",
        "beauty",
        "tech_support",
        "events",
        "other",
      ],
      listing_status: ["active", "paused", "archived"],
      payment_status: [
        "pending",
        "authorized",
        "captured",
        "released",
        "refunded",
        "failed",
      ],
      pricing_type: ["hourly", "fixed", "negotiable"],
      task_status: [
        "open",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
      ],
      urgency_level: ["low", "medium", "high", "urgent"],
    },
  },
} as const
