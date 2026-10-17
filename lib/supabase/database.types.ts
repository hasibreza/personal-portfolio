// Generated from the live schema (Supabase "Generate TypeScript types"), trimmed to what the app
// uses. Regenerate after every migration.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type ContentStatus = 'draft' | 'scheduled' | 'published'
type MessageStatus = 'new' | 'read' | 'archived'

export type Database = {
  __InternalSupabase: { PostgrestVersion: '14.18' }
  public: {
    Tables: {
      certifications: {
        Row: {
          badge_alt: string | null
          badge_image: string | null
          code: string
          detail: string | null
          featured: boolean
          id: string
          issuer: string
          name: string
          sort_order: number
          updated_at: string
          verify_url: string | null
          year: string
        }
        Insert: Partial<Database['public']['Tables']['certifications']['Row']> & {
          code: string
          name: string
          issuer: string
          year: string
        }
        Update: Partial<Database['public']['Tables']['certifications']['Row']>
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_hash: string
          message: string
          name: string
          status: MessageStatus
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_hash: string
          message: string
          name: string
          status?: MessageStatus
          subject: string
        }
        Update: Partial<Database['public']['Tables']['contact_messages']['Row']>
        Relationships: []
      }
      cv_files: {
        Row: {
          file_path: string
          id: string
          is_active: boolean
          label: string
          size_bytes: number | null
          updated_at: string
          uploaded_at: string
        }
        Insert: Partial<Database['public']['Tables']['cv_files']['Row']> & {
          file_path: string
          label: string
        }
        Update: Partial<Database['public']['Tables']['cv_files']['Row']>
        Relationships: []
      }
      posts: {
        Row: {
          body_html: string
          body_json: Json | null
          cover_alt: string | null
          cover_image: string | null
          created_at: string
          excerpt: string
          featured: boolean
          id: string
          og_image: string | null
          published_at: string | null
          reading_minutes: number
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: ContentStatus
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['posts']['Row']> & {
          slug: string
          title: string
        }
        Update: Partial<Database['public']['Tables']['posts']['Row']>
        Relationships: []
      }
      projects: {
        Row: {
          approach_html: string
          area: string
          cover_alt: string | null
          cover_image: string | null
          created_at: string
          featured: boolean
          file_path: string | null
          gallery: Json
          id: string
          outcome_html: string
          problem_html: string
          published_at: string | null
          role: string
          scale: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          stack: string
          status: ContentStatus
          summary: string
          tags: string[]
          timeline: string
          title: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['projects']['Row']> & {
          slug: string
          title: string
        }
        Update: Partial<Database['public']['Tables']['projects']['Row']>
        Relationships: []
      }
      site_settings: {
        Row: {
          default_description: string
          default_title: string
          email: string
          id: number
          linkedin_url: string | null
          og_image: string | null
          profile: Json
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['site_settings']['Row']> & {
          default_description: string
          default_title: string
          email: string
        }
        Update: Partial<Database['public']['Tables']['site_settings']['Row']>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { set_live_cv: { Args: { p_id: string }; Returns: undefined } }
    Enums: { content_status: ContentStatus; message_status: MessageStatus }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicTables = Database['public']['Tables']
export type Row<T extends keyof PublicTables> = PublicTables[T]['Row']
export type ContentStatusValue = ContentStatus
export type MessageStatusValue = MessageStatus
