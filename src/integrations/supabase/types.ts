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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      "4500 Master": {
        Row: {
          ai_trajectory_score: number | null
          asset_id: number | null
          asset_name: string | null
          exemplar: string | null
          group_name: string | null
          lag_status: string | null
          lens: string | null
          signal_state: string | null
          status: string | null
          time_state: string | null
          variant_id: number | null
          variant_name: string | null
          velocity: string | null
        }
        Insert: {
          ai_trajectory_score?: number | null
          asset_id?: number | null
          asset_name?: string | null
          exemplar?: string | null
          group_name?: string | null
          lag_status?: string | null
          lens?: string | null
          signal_state?: string | null
          status?: string | null
          time_state?: string | null
          variant_id?: number | null
          variant_name?: string | null
          velocity?: string | null
        }
        Update: {
          ai_trajectory_score?: number | null
          asset_id?: number | null
          asset_name?: string | null
          exemplar?: string | null
          group_name?: string | null
          lag_status?: string | null
          lens?: string | null
          signal_state?: string | null
          status?: string | null
          time_state?: string | null
          variant_id?: number | null
          variant_name?: string | null
          velocity?: string | null
        }
        Relationships: []
      }
      accreditation_pathways: {
        Row: {
          assessment_methods: Json | null
          competency_framework: Json | null
          created_at: string | null
          description: string | null
          discipline_id: string | null
          id: string
          is_active: boolean | null
          level: string
          name: string
          renewal_requirements: Json | null
          required_courses: string[] | null
          requirements: Json | null
          validity_years: number | null
        }
        Insert: {
          assessment_methods?: Json | null
          competency_framework?: Json | null
          created_at?: string | null
          description?: string | null
          discipline_id?: string | null
          id?: string
          is_active?: boolean | null
          level: string
          name: string
          renewal_requirements?: Json | null
          required_courses?: string[] | null
          requirements?: Json | null
          validity_years?: number | null
        }
        Update: {
          assessment_methods?: Json | null
          competency_framework?: Json | null
          created_at?: string | null
          description?: string | null
          discipline_id?: string | null
          id?: string
          is_active?: boolean | null
          level?: string
          name?: string
          renewal_requirements?: Json | null
          required_courses?: string[] | null
          requirements?: Json | null
          validity_years?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "accreditation_pathways_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_audit: {
        Row: {
          action_type: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      activity_feeds: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          metadata: Json | null
          target_id: string | null
          target_type: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          activity_type: string
          child_id: string | null
          created_at: string
          description: string
          guardian_id: string | null
          id: string
          metadata: Json | null
          service_id: string | null
        }
        Insert: {
          activity_type: string
          child_id?: string | null
          created_at?: string
          description: string
          guardian_id?: string | null
          id?: string
          metadata?: Json | null
          service_id?: string | null
        }
        Update: {
          activity_type?: string
          child_id?: string | null
          created_at?: string
          description?: string
          guardian_id?: string | null
          id?: string
          metadata?: Json | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "digital_services"
            referencedColumns: ["id"]
          },
        ]
      }
      adventure_stories: {
        Row: {
          certificate_id: string | null
          content: string
          created_at: string
          id: string
          image_urls: Json | null
          is_featured: boolean
          likes_count: number
          location: string | null
          predator_type: string | null
          shares_count: number
          title: string
          updated_at: string
          user_id: string
          views_count: number
        }
        Insert: {
          certificate_id?: string | null
          content: string
          created_at?: string
          id?: string
          image_urls?: Json | null
          is_featured?: boolean
          likes_count?: number
          location?: string | null
          predator_type?: string | null
          shares_count?: number
          title: string
          updated_at?: string
          user_id: string
          views_count?: number
        }
        Update: {
          certificate_id?: string | null
          content?: string
          created_at?: string
          id?: string
          image_urls?: Json | null
          is_featured?: boolean
          likes_count?: number
          location?: string | null
          predator_type?: string | null
          shares_count?: number
          title?: string
          updated_at?: string
          user_id?: string
          views_count?: number
        }
        Relationships: []
      }
      "Agent Tasks Archive.csv": {
        Row: {
          assigned_agent: string | null
          projected_cost: number | null
          projected_hours: number | null
          report_id: string | null
          result: string | null
          result_timestamp: string | null
          status: string | null
          task_description: string | null
        }
        Insert: {
          assigned_agent?: string | null
          projected_cost?: number | null
          projected_hours?: number | null
          report_id?: string | null
          result?: string | null
          result_timestamp?: string | null
          status?: string | null
          task_description?: string | null
        }
        Update: {
          assigned_agent?: string | null
          projected_cost?: number | null
          projected_hours?: number | null
          report_id?: string | null
          result?: string | null
          result_timestamp?: string | null
          status?: string | null
          task_description?: string | null
        }
        Relationships: []
      }
      agent_contributions: {
        Row: {
          agent_description: string | null
          agent_name: string
          agent_type: string
          created_at: string
          downloads_count: number | null
          file_url: string | null
          github_url: string | null
          id: string
          image_band_url: string | null
          promoted_agent_id: string | null
          rating_avg: number | null
          rating_count: number | null
          source_data: Json
          status: string
          updated_at: string
          upload_source: string
          user_id: string
        }
        Insert: {
          agent_description?: string | null
          agent_name: string
          agent_type: string
          created_at?: string
          downloads_count?: number | null
          file_url?: string | null
          github_url?: string | null
          id?: string
          image_band_url?: string | null
          promoted_agent_id?: string | null
          rating_avg?: number | null
          rating_count?: number | null
          source_data?: Json
          status?: string
          updated_at?: string
          upload_source?: string
          user_id: string
        }
        Update: {
          agent_description?: string | null
          agent_name?: string
          agent_type?: string
          created_at?: string
          downloads_count?: number | null
          file_url?: string | null
          github_url?: string | null
          id?: string
          image_band_url?: string | null
          promoted_agent_id?: string | null
          rating_avg?: number | null
          rating_count?: number | null
          source_data?: Json
          status?: string
          updated_at?: string
          upload_source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_contributions_promoted_agent_id_fkey"
            columns: ["promoted_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_contributions_promoted_agent_id_fkey"
            columns: ["promoted_agent_id"]
            isOneToOne: false
            referencedRelation: "agents_recent"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_downloads: {
        Row: {
          agent_id: string
          agent_name: string | null
          download_date: string
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          agent_id: string
          agent_name?: string | null
          download_date?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string
          agent_name?: string | null
          download_date?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      agent_favorites: {
        Row: {
          agent_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_moderation_queue: {
        Row: {
          agent_id: string
          auto_score: number | null
          estimated_review_time: number | null
          id: string
          moderated_at: string | null
          moderation_notes: string | null
          moderator_id: string | null
          previous_status: string | null
          priority: string | null
          rejection_reason: string | null
          status: string
          submitted_at: string
        }
        Insert: {
          agent_id: string
          auto_score?: number | null
          estimated_review_time?: number | null
          id?: string
          moderated_at?: string | null
          moderation_notes?: string | null
          moderator_id?: string | null
          previous_status?: string | null
          priority?: string | null
          rejection_reason?: string | null
          status?: string
          submitted_at?: string
        }
        Update: {
          agent_id?: string
          auto_score?: number | null
          estimated_review_time?: number | null
          id?: string
          moderated_at?: string | null
          moderation_notes?: string | null
          moderator_id?: string | null
          previous_status?: string | null
          priority?: string | null
          rejection_reason?: string | null
          status?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_moderation_queue_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_ratings: {
        Row: {
          agent_id: string
          created_at: string | null
          helpful_count: number | null
          id: string
          is_verified: boolean | null
          rating: number
          review_text: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified?: boolean | null
          rating: number
          review_text?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified?: boolean | null
          rating?: number
          review_text?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agent_reviews: {
        Row: {
          agent_id: string
          created_at: string
          helpful_count: number | null
          id: string
          is_verified: boolean | null
          rating: number
          review_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_verified?: boolean | null
          rating: number
          review_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_verified?: boolean | null
          rating?: number
          review_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_reviews_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_tasks: {
        Row: {
          agent_id: string | null
          assigned_agent: string | null
          created_at: string | null
          id: string
          projected_cost: number | null
          projected_hours: number | null
          report_id: string | null
          result: string | null
          result_timestamp: string | null
          status: string | null
          task_description: string
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          assigned_agent?: string | null
          created_at?: string | null
          id?: string
          projected_cost?: number | null
          projected_hours?: number | null
          report_id?: string | null
          result?: string | null
          result_timestamp?: string | null
          status?: string | null
          task_description: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          assigned_agent?: string | null
          created_at?: string | null
          id?: string
          projected_cost?: number | null
          projected_hours?: number | null
          report_id?: string | null
          result?: string | null
          result_timestamp?: string | null
          status?: string | null
          task_description?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_tasks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "family_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_tasks_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "idea_board"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_tasks_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          category: string
          created_at: string
          creator: string
          description: string
          difficulty: string
          download_count: number | null
          github_url: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          last_updated: string | null
          name: string
          platform: string
          rating_average: number | null
          rating_count: number | null
          resource_url: string | null
          source_url: string | null
          status: string | null
          tags: string[] | null
          template_url: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
          use_case: string
          view_count: number | null
          youtube_url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          creator: string
          description: string
          difficulty: string
          download_count?: number | null
          github_url?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          last_updated?: string | null
          name: string
          platform?: string
          rating_average?: number | null
          rating_count?: number | null
          resource_url?: string | null
          source_url?: string | null
          status?: string | null
          tags?: string[] | null
          template_url?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
          use_case: string
          view_count?: number | null
          youtube_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          creator?: string
          description?: string
          difficulty?: string
          download_count?: number | null
          github_url?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          last_updated?: string | null
          name?: string
          platform?: string
          rating_average?: number | null
          rating_count?: number | null
          resource_url?: string | null
          source_url?: string | null
          status?: string | null
          tags?: string[] | null
          template_url?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          use_case?: string
          view_count?: number | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      "AI Automation _ n8n Templates - Templates.csv": {
        Row: {
          creator: string | null
          description: string | null
          id: string | null
          name: string | null
          resource_url: string | null
          template_url: string | null
          title: string | null
          youtube_url: string | null
        }
        Insert: {
          creator?: string | null
          description?: string | null
          id?: string | null
          name?: string | null
          resource_url?: string | null
          template_url?: string | null
          title?: string | null
          youtube_url?: string | null
        }
        Update: {
          creator?: string | null
          description?: string | null
          id?: string | null
          name?: string | null
          resource_url?: string | null
          template_url?: string | null
          title?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      ai_sweet_spots_faq_feedback: {
        Row: {
          created_at: string | null
          faq_id: string
          id: string
          is_helpful: boolean
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          faq_id: string
          id?: string
          is_helpful: boolean
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          faq_id?: string
          id?: string
          is_helpful?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_sweet_spots_faq_feedback_faq_id_fkey"
            columns: ["faq_id"]
            isOneToOne: false
            referencedRelation: "ai_sweet_spots_faqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_sweet_spots_faq_feedback_faq_id_fkey"
            columns: ["faq_id"]
            isOneToOne: false
            referencedRelation: "ai_sweet_spots_faqs_most_helpful"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_sweet_spots_faqs: {
        Row: {
          answer: string
          category: string
          citations: string[] | null
          created_at: string | null
          helpful_count: number | null
          id: string
          intensity_band: string[] | null
          is_published: boolean | null
          participant_count_context: string | null
          population_tags: string[] | null
          question: string
          related_faqs: string[] | null
          related_papers: string[] | null
          search_vector: unknown
          see_also: string[] | null
          study_phase: string[] | null
          tags: string[] | null
          technical_level: string
          tools_mentioned: string[] | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          answer: string
          category: string
          citations?: string[] | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          intensity_band?: string[] | null
          is_published?: boolean | null
          participant_count_context?: string | null
          population_tags?: string[] | null
          question: string
          related_faqs?: string[] | null
          related_papers?: string[] | null
          search_vector?: unknown
          see_also?: string[] | null
          study_phase?: string[] | null
          tags?: string[] | null
          technical_level?: string
          tools_mentioned?: string[] | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          answer?: string
          category?: string
          citations?: string[] | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          intensity_band?: string[] | null
          is_published?: boolean | null
          participant_count_context?: string | null
          population_tags?: string[] | null
          question?: string
          related_faqs?: string[] | null
          related_papers?: string[] | null
          search_vector?: unknown
          see_also?: string[] | null
          study_phase?: string[] | null
          tags?: string[] | null
          technical_level?: string
          tools_mentioned?: string[] | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      ai_sweet_spots_search_history: {
        Row: {
          created_at: string | null
          filters_applied: Json | null
          id: string
          results_count: number | null
          search_query: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          filters_applied?: Json | null
          id?: string
          results_count?: number | null
          search_query: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          filters_applied?: Json | null
          id?: string
          results_count?: number | null
          search_query?: string
          user_id?: string | null
        }
        Relationships: []
      }
      allowed_domains: {
        Row: {
          created_at: string
          domain: string
          id: string
          is_active: boolean
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          is_active?: boolean
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      animals: {
        Row: {
          category: string
          created_at: string
          danger_level: number
          description: string
          facts: string[]
          id: string
          image_url: string | null
          kills_per_year: number
          locations: string[]
          name: string
          rarity: string
        }
        Insert: {
          category: string
          created_at?: string
          danger_level: number
          description: string
          facts?: string[]
          id?: string
          image_url?: string | null
          kills_per_year?: number
          locations?: string[]
          name: string
          rarity: string
        }
        Update: {
          category?: string
          created_at?: string
          danger_level?: number
          description?: string
          facts?: string[]
          id?: string
          image_url?: string | null
          kills_per_year?: number
          locations?: string[]
          name?: string
          rarity?: string
        }
        Relationships: []
      }
      anonymous_assessments: {
        Row: {
          assessment_data: Json
          benefits_from_scaffolding: boolean | null
          completed_at: string
          created_at: string
          domain_tests: Json | null
          id: string
          metacognitive_accuracy: number | null
          novel_learning_slope: number | null
          overreliance_errors_caught: number | null
          overreliance_risk: string | null
          pattern_recognition_avg_response_time: number | null
          pattern_recognition_pattern_complexity: number | null
          pattern_recognition_total_correct: number | null
          processing_speed_avg_response_time: number | null
          processing_speed_error_rate: number | null
          processing_speed_total_correct: number | null
          results: Json
          session_id: string
          stress_response_baseline_span: number | null
          stress_response_decline: number | null
          stress_response_post_stress_span: number | null
          stress_vulnerability: string | null
          sustained_attention_decline: number | null
          sustained_attention_dprime: number | null
          sustained_attention_variability: number | null
          topic_slug: string | null
          wm_error_pattern: string | null
          working_memory_span: number | null
        }
        Insert: {
          assessment_data: Json
          benefits_from_scaffolding?: boolean | null
          completed_at?: string
          created_at?: string
          domain_tests?: Json | null
          id?: string
          metacognitive_accuracy?: number | null
          novel_learning_slope?: number | null
          overreliance_errors_caught?: number | null
          overreliance_risk?: string | null
          pattern_recognition_avg_response_time?: number | null
          pattern_recognition_pattern_complexity?: number | null
          pattern_recognition_total_correct?: number | null
          processing_speed_avg_response_time?: number | null
          processing_speed_error_rate?: number | null
          processing_speed_total_correct?: number | null
          results: Json
          session_id: string
          stress_response_baseline_span?: number | null
          stress_response_decline?: number | null
          stress_response_post_stress_span?: number | null
          stress_vulnerability?: string | null
          sustained_attention_decline?: number | null
          sustained_attention_dprime?: number | null
          sustained_attention_variability?: number | null
          topic_slug?: string | null
          wm_error_pattern?: string | null
          working_memory_span?: number | null
        }
        Update: {
          assessment_data?: Json
          benefits_from_scaffolding?: boolean | null
          completed_at?: string
          created_at?: string
          domain_tests?: Json | null
          id?: string
          metacognitive_accuracy?: number | null
          novel_learning_slope?: number | null
          overreliance_errors_caught?: number | null
          overreliance_risk?: string | null
          pattern_recognition_avg_response_time?: number | null
          pattern_recognition_pattern_complexity?: number | null
          pattern_recognition_total_correct?: number | null
          processing_speed_avg_response_time?: number | null
          processing_speed_error_rate?: number | null
          processing_speed_total_correct?: number | null
          results?: Json
          session_id?: string
          stress_response_baseline_span?: number | null
          stress_response_decline?: number | null
          stress_response_post_stress_span?: number | null
          stress_vulnerability?: string | null
          sustained_attention_decline?: number | null
          sustained_attention_dprime?: number | null
          sustained_attention_variability?: number | null
          topic_slug?: string | null
          wm_error_pattern?: string | null
          working_memory_span?: number | null
        }
        Relationships: []
      }
      api_rate_limit_log: {
        Row: {
          blocked_until: string | null
          created_at: string | null
          endpoint: string
          id: string
          identifier: string
          last_request: string | null
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          blocked_until?: string | null
          created_at?: string | null
          endpoint: string
          id?: string
          identifier: string
          last_request?: string | null
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          blocked_until?: string | null
          created_at?: string | null
          endpoint?: string
          id?: string
          identifier?: string
          last_request?: string | null
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      api_rate_limits: {
        Row: {
          endpoint: string
          id: string
          identifier: string
          last_request: string | null
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          endpoint: string
          id?: string
          identifier: string
          last_request?: string | null
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          endpoint?: string
          id?: string
          identifier?: string
          last_request?: string | null
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      app_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      article_inputs: {
        Row: {
          agent_refs: string[] | null
          business_area: string | null
          cluster: string | null
          created_at: string | null
          external_signals: string | null
          headline: string | null
          hook: string | null
          id: number
          pov_notes: string | null
          sub_component: string | null
        }
        Insert: {
          agent_refs?: string[] | null
          business_area?: string | null
          cluster?: string | null
          created_at?: string | null
          external_signals?: string | null
          headline?: string | null
          hook?: string | null
          id?: number
          pov_notes?: string | null
          sub_component?: string | null
        }
        Update: {
          agent_refs?: string[] | null
          business_area?: string | null
          cluster?: string | null
          created_at?: string | null
          external_signals?: string | null
          headline?: string | null
          hook?: string | null
          id?: number
          pov_notes?: string | null
          sub_component?: string | null
        }
        Relationships: []
      }
      article_outputs: {
        Row: {
          carousel: string | null
          created_at: string | null
          id: number
          input_id: number | null
          section_a: string | null
          section_b: string | null
          section_c: string | null
          section_d: string | null
          section_e: string | null
          section_f: string | null
          section_g: string | null
          video_prompts: string | null
          visuals: string | null
        }
        Insert: {
          carousel?: string | null
          created_at?: string | null
          id?: number
          input_id?: number | null
          section_a?: string | null
          section_b?: string | null
          section_c?: string | null
          section_d?: string | null
          section_e?: string | null
          section_f?: string | null
          section_g?: string | null
          video_prompts?: string | null
          visuals?: string | null
        }
        Update: {
          carousel?: string | null
          created_at?: string | null
          id?: number
          input_id?: number | null
          section_a?: string | null
          section_b?: string | null
          section_c?: string | null
          section_d?: string | null
          section_e?: string | null
          section_f?: string | null
          section_g?: string | null
          video_prompts?: string | null
          visuals?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_outputs_input_id_fkey"
            columns: ["input_id"]
            isOneToOne: false
            referencedRelation: "article_engine_full"
            referencedColumns: ["input_id"]
          },
          {
            foreignKeyName: "article_outputs_input_id_fkey"
            columns: ["input_id"]
            isOneToOne: false
            referencedRelation: "article_inputs"
            referencedColumns: ["id"]
          },
        ]
      }
      article_schedule: {
        Row: {
          cadence: string | null
          id: number
          last_run: string | null
          next_run: string | null
          status: string | null
        }
        Insert: {
          cadence?: string | null
          id?: number
          last_run?: string | null
          next_run?: string | null
          status?: string | null
        }
        Update: {
          cadence?: string | null
          id?: number
          last_run?: string | null
          next_run?: string | null
          status?: string | null
        }
        Relationships: []
      }
      assessment_results: {
        Row: {
          assessment_data: Json
          benefits_from_scaffolding: boolean | null
          completed_at: string
          created_at: string
          domain_tests: Json | null
          id: string
          metacognitive_accuracy: number | null
          novel_learning_slope: number | null
          overreliance_errors_caught: number | null
          overreliance_risk: string | null
          pattern_recognition_avg_response_time: number | null
          pattern_recognition_pattern_complexity: number | null
          pattern_recognition_total_correct: number | null
          processing_speed_avg_response_time: number | null
          processing_speed_error_rate: number | null
          processing_speed_total_correct: number | null
          results: Json
          stress_response_baseline_span: number | null
          stress_response_decline: number | null
          stress_response_post_stress_span: number | null
          stress_vulnerability: string | null
          sustained_attention_decline: number | null
          sustained_attention_dprime: number | null
          sustained_attention_variability: number | null
          topic_slug: string | null
          updated_at: string
          user_id: string | null
          wm_error_pattern: string | null
          working_memory_span: number | null
        }
        Insert: {
          assessment_data: Json
          benefits_from_scaffolding?: boolean | null
          completed_at?: string
          created_at?: string
          domain_tests?: Json | null
          id?: string
          metacognitive_accuracy?: number | null
          novel_learning_slope?: number | null
          overreliance_errors_caught?: number | null
          overreliance_risk?: string | null
          pattern_recognition_avg_response_time?: number | null
          pattern_recognition_pattern_complexity?: number | null
          pattern_recognition_total_correct?: number | null
          processing_speed_avg_response_time?: number | null
          processing_speed_error_rate?: number | null
          processing_speed_total_correct?: number | null
          results: Json
          stress_response_baseline_span?: number | null
          stress_response_decline?: number | null
          stress_response_post_stress_span?: number | null
          stress_vulnerability?: string | null
          sustained_attention_decline?: number | null
          sustained_attention_dprime?: number | null
          sustained_attention_variability?: number | null
          topic_slug?: string | null
          updated_at?: string
          user_id?: string | null
          wm_error_pattern?: string | null
          working_memory_span?: number | null
        }
        Update: {
          assessment_data?: Json
          benefits_from_scaffolding?: boolean | null
          completed_at?: string
          created_at?: string
          domain_tests?: Json | null
          id?: string
          metacognitive_accuracy?: number | null
          novel_learning_slope?: number | null
          overreliance_errors_caught?: number | null
          overreliance_risk?: string | null
          pattern_recognition_avg_response_time?: number | null
          pattern_recognition_pattern_complexity?: number | null
          pattern_recognition_total_correct?: number | null
          processing_speed_avg_response_time?: number | null
          processing_speed_error_rate?: number | null
          processing_speed_total_correct?: number | null
          results?: Json
          stress_response_baseline_span?: number | null
          stress_response_decline?: number | null
          stress_response_post_stress_span?: number | null
          stress_vulnerability?: string | null
          sustained_attention_decline?: number | null
          sustained_attention_dprime?: number | null
          sustained_attention_variability?: number | null
          topic_slug?: string | null
          updated_at?: string
          user_id?: string | null
          wm_error_pattern?: string | null
          working_memory_span?: number | null
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          partner_org_id: string | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          partner_org_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          partner_org_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_partner_org_id_fkey"
            columns: ["partner_org_id"]
            isOneToOne: false
            referencedRelation: "partner_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_metrics: {
        Row: {
          audit_id: string | null
          id: string
          metric_type: string
          metric_value: number
          page_url: string | null
          recorded_at: string | null
        }
        Insert: {
          audit_id?: string | null
          id?: string
          metric_type: string
          metric_value: number
          page_url?: string | null
          recorded_at?: string | null
        }
        Update: {
          audit_id?: string | null
          id?: string
          metric_type?: string
          metric_value?: number
          page_url?: string | null
          recorded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_metrics_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "site_audits"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_article_likes: {
        Row: {
          article_id: string | null
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          article_id?: string | null
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_article_likes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "blog_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_article_views: {
        Row: {
          article_id: string | null
          id: string
          ip_address: unknown
          referrer: string | null
          user_agent: string | null
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          article_id?: string | null
          id?: string
          ip_address?: unknown
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          article_id?: string | null
          id?: string
          ip_address?: unknown
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "blog_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_articles: {
        Row: {
          author_avatar_url: string | null
          author_id: string | null
          author_name: string
          category: string | null
          comment_count: number | null
          content: string | null
          content_type: string
          cover_image_url: string | null
          created_at: string | null
          excerpt: string | null
          external_url: string | null
          featured: boolean | null
          id: string
          like_count: number | null
          published_at: string | null
          reading_time_minutes: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          source: string | null
          source_metadata: Json | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
          video_embed_id: string | null
          video_platform: string | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          author_avatar_url?: string | null
          author_id?: string | null
          author_name: string
          category?: string | null
          comment_count?: number | null
          content?: string | null
          content_type?: string
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          external_url?: string | null
          featured?: boolean | null
          id?: string
          like_count?: number | null
          published_at?: string | null
          reading_time_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          source?: string | null
          source_metadata?: Json | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          video_embed_id?: string | null
          video_platform?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          author_avatar_url?: string | null
          author_id?: string | null
          author_name?: string
          category?: string | null
          comment_count?: number | null
          content?: string | null
          content_type?: string
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          external_url?: string | null
          featured?: boolean | null
          id?: string
          like_count?: number | null
          published_at?: string | null
          reading_time_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          source?: string | null
          source_metadata?: Json | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          video_embed_id?: string | null
          video_platform?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      "Book → Chapter (cluster) → Sub-components - %.csv": {
        Row: {
          book: string | null
          book_percent: number | null
          chapter: string | null
          chapter_percent: number | null
          notes: string | null
          sub_component: string | null
          sub_percent: number | null
        }
        Insert: {
          book?: string | null
          book_percent?: number | null
          chapter?: string | null
          chapter_percent?: number | null
          notes?: string | null
          sub_component?: string | null
          sub_percent?: number | null
        }
        Update: {
          book?: string | null
          book_percent?: number | null
          chapter?: string | null
          chapter_percent?: number | null
          notes?: string | null
          sub_component?: string | null
          sub_percent?: number | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          class_id: string
          created_at: string
          id: string
          notes: string | null
          payment_status: string
          status: string
          updated_at: string
          user_email: string
          user_name: string
          user_phone: string | null
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_status?: string
          status?: string
          updated_at?: string
          user_email: string
          user_name: string
          user_phone?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_status?: string
          status?: string
          updated_at?: string
          user_email?: string
          user_name?: string
          user_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      bundle_products: {
        Row: {
          animal_count: number
          base_price: number
          category: string | null
          created_at: string | null
          description: string | null
          features: string[] | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          savings: number
        }
        Insert: {
          animal_count: number
          base_price: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          savings: number
        }
        Update: {
          animal_count?: number
          base_price?: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          savings?: number
        }
        Relationships: []
      }
      "Business Areas and Domains": {
        Row: {
          "Analytics ID": string | null
          "Auth Method": string | null
          "Auto Renew": string | null
          "Backup Policy": string | null
          "Billing Account": string | null
          "Billing Owner": string | null
          "Car Park": string | null
          CDN: string | null
          "CI Pipeline": string | null
          Compliance: string | null
          "Cost Centre": string | null
          "Data Classification": string | null
          "Domain/URL": string | null
          Environment: string | null
          "Expiry Date": string | null
          "Hosting Provider": string | null
          "Last Audit Date": string | null
          "Last Uptime 30d": string | null
          "Monitoring URL": number | null
          "Next Review Date": string | null
          Notes: string | null
          Owner: string | null
          "Owner Email": string | null
          "PII Present": string | null
          Platform: string | null
          Priority: string | null
          "Prod URL": string | null
          Project: string | null
          Region: string | null
          Registrar: string | null
          "Registration Date": string | null
          "Repo URL": string | null
          "Robots URL": string | null
          "RPO hours": number | null
          "RTO hours": string | null
          "Search Console": string | null
          "Secrets Location": string | null
          "SEO Priority": string | null
          "Sitemap URL": string | null
          "SSL Expiry": string | null
          "SSL Status": string | null
          "Staging URL": string | null
          Status: string | null
          "Status Page": number | null
          Tags: string | null
          Team: string | null
          "Uptime Target": string | null
          WAF: string | null
        }
        Insert: {
          "Analytics ID"?: string | null
          "Auth Method"?: string | null
          "Auto Renew"?: string | null
          "Backup Policy"?: string | null
          "Billing Account"?: string | null
          "Billing Owner"?: string | null
          "Car Park"?: string | null
          CDN?: string | null
          "CI Pipeline"?: string | null
          Compliance?: string | null
          "Cost Centre"?: string | null
          "Data Classification"?: string | null
          "Domain/URL"?: string | null
          Environment?: string | null
          "Expiry Date"?: string | null
          "Hosting Provider"?: string | null
          "Last Audit Date"?: string | null
          "Last Uptime 30d"?: string | null
          "Monitoring URL"?: number | null
          "Next Review Date"?: string | null
          Notes?: string | null
          Owner?: string | null
          "Owner Email"?: string | null
          "PII Present"?: string | null
          Platform?: string | null
          Priority?: string | null
          "Prod URL"?: string | null
          Project?: string | null
          Region?: string | null
          Registrar?: string | null
          "Registration Date"?: string | null
          "Repo URL"?: string | null
          "Robots URL"?: string | null
          "RPO hours"?: number | null
          "RTO hours"?: string | null
          "Search Console"?: string | null
          "Secrets Location"?: string | null
          "SEO Priority"?: string | null
          "Sitemap URL"?: string | null
          "SSL Expiry"?: string | null
          "SSL Status"?: string | null
          "Staging URL"?: string | null
          Status?: string | null
          "Status Page"?: number | null
          Tags?: string | null
          Team?: string | null
          "Uptime Target"?: string | null
          WAF?: string | null
        }
        Update: {
          "Analytics ID"?: string | null
          "Auth Method"?: string | null
          "Auto Renew"?: string | null
          "Backup Policy"?: string | null
          "Billing Account"?: string | null
          "Billing Owner"?: string | null
          "Car Park"?: string | null
          CDN?: string | null
          "CI Pipeline"?: string | null
          Compliance?: string | null
          "Cost Centre"?: string | null
          "Data Classification"?: string | null
          "Domain/URL"?: string | null
          Environment?: string | null
          "Expiry Date"?: string | null
          "Hosting Provider"?: string | null
          "Last Audit Date"?: string | null
          "Last Uptime 30d"?: string | null
          "Monitoring URL"?: number | null
          "Next Review Date"?: string | null
          Notes?: string | null
          Owner?: string | null
          "Owner Email"?: string | null
          "PII Present"?: string | null
          Platform?: string | null
          Priority?: string | null
          "Prod URL"?: string | null
          Project?: string | null
          Region?: string | null
          Registrar?: string | null
          "Registration Date"?: string | null
          "Repo URL"?: string | null
          "Robots URL"?: string | null
          "RPO hours"?: number | null
          "RTO hours"?: string | null
          "Search Console"?: string | null
          "Secrets Location"?: string | null
          "SEO Priority"?: string | null
          "Sitemap URL"?: string | null
          "SSL Expiry"?: string | null
          "SSL Status"?: string | null
          "Staging URL"?: string | null
          Status?: string | null
          "Status Page"?: number | null
          Tags?: string | null
          Team?: string | null
          "Uptime Target"?: string | null
          WAF?: string | null
        }
        Relationships: []
      }
      calculator_history: {
        Row: {
          calculations: Json
          created_at: string | null
          id: string
          item_description: string | null
          original_price: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          calculations: Json
          created_at?: string | null
          id?: string
          item_description?: string | null
          original_price: number
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          calculations?: Json
          created_at?: string | null
          id?: string
          item_description?: string | null
          original_price?: number
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chapter_keywords: {
        Row: {
          book: string
          chapter: string
          id: string
          keyword: string
        }
        Insert: {
          book: string
          chapter: string
          id?: string
          keyword: string
        }
        Update: {
          book?: string
          chapter?: string
          id?: string
          keyword?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_group: boolean
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_group?: boolean
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_group?: boolean
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_edited: boolean
          message_type: string
          reply_to_id: string | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_edited?: boolean
          message_type?: string
          reply_to_id?: string | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_edited?: boolean
          message_type?: string
          reply_to_id?: string | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      child_consents: {
        Row: {
          child_id: string
          consent_template_id: string | null
          created_at: string
          expires_at: string | null
          given_by: string
          granted_at: string
          id: string
          metadata: Json
          purpose: string | null
          revoked_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          child_id: string
          consent_template_id?: string | null
          created_at?: string
          expires_at?: string | null
          given_by: string
          granted_at?: string
          id?: string
          metadata?: Json
          purpose?: string | null
          revoked_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          child_id?: string
          consent_template_id?: string | null
          created_at?: string
          expires_at?: string | null
          given_by?: string
          granted_at?: string
          id?: string
          metadata?: Json
          purpose?: string | null
          revoked_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_consents_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_consents_consent_template_id_fkey"
            columns: ["consent_template_id"]
            isOneToOne: false
            referencedRelation: "consent_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      child_documents: {
        Row: {
          child_id: string
          content_type: string | null
          created_at: string
          doc_type: string
          expires_at: string | null
          file_name: string
          id: string
          metadata: Json
          size_bytes: number | null
          storage_path: string
          updated_at: string
          uploaded_by: string
          verification_status: string
        }
        Insert: {
          child_id: string
          content_type?: string | null
          created_at?: string
          doc_type: string
          expires_at?: string | null
          file_name: string
          id?: string
          metadata?: Json
          size_bytes?: number | null
          storage_path: string
          updated_at?: string
          uploaded_by: string
          verification_status?: string
        }
        Update: {
          child_id?: string
          content_type?: string | null
          created_at?: string
          doc_type?: string
          expires_at?: string | null
          file_name?: string
          id?: string
          metadata?: Json
          size_bytes?: number | null
          storage_path?: string
          updated_at?: string
          uploaded_by?: string
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_documents_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          created_at: string
          date_of_birth: string
          first_name: string
          guardian_id: string | null
          id: string
          last_name: string
          updated_at: string
          verification_status: string
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          first_name: string
          guardian_id?: string | null
          id?: string
          last_name: string
          updated_at?: string
          verification_status?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          first_name?: string
          guardian_id?: string | null
          id?: string
          last_name?: string
          updated_at?: string
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          capacity: number
          class_type: string
          created_at: string
          description: string | null
          end_time: string
          enrolled_count: number
          id: string
          instructor: string
          is_active: boolean
          language: string
          level: string | null
          location: string | null
          online_link: string | null
          price: number
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          class_type: string
          created_at?: string
          description?: string | null
          end_time: string
          enrolled_count?: number
          id?: string
          instructor?: string
          is_active?: boolean
          language: string
          level?: string | null
          location?: string | null
          online_link?: string | null
          price?: number
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          class_type?: string
          created_at?: string
          description?: string | null
          end_time?: string
          enrolled_count?: number
          id?: string
          instructor?: string
          is_active?: boolean
          language?: string
          level?: string | null
          location?: string | null
          online_link?: string | null
          price?: number
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      coach_build_videos: {
        Row: {
          agent_id: string | null
          created_at: string
          creator_display: string | null
          description: string | null
          difficulty: string
          duration_seconds: number | null
          embed_url: string | null
          id: string
          language: string
          like_count: number
          platform: string
          published_at: string | null
          source_type: string
          status: string
          tags: string[]
          title: string
          tools: string[]
          updated_at: string
          use_case: string | null
          user_id: string | null
          video_id: string | null
          video_url: string
          view_count: number
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          creator_display?: string | null
          description?: string | null
          difficulty?: string
          duration_seconds?: number | null
          embed_url?: string | null
          id?: string
          language?: string
          like_count?: number
          platform: string
          published_at?: string | null
          source_type?: string
          status?: string
          tags?: string[]
          title: string
          tools?: string[]
          updated_at?: string
          use_case?: string | null
          user_id?: string | null
          video_id?: string | null
          video_url: string
          view_count?: number
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          creator_display?: string | null
          description?: string | null
          difficulty?: string
          duration_seconds?: number | null
          embed_url?: string | null
          id?: string
          language?: string
          like_count?: number
          platform?: string
          published_at?: string | null
          source_type?: string
          status?: string
          tags?: string[]
          title?: string
          tools?: string[]
          updated_at?: string
          use_case?: string | null
          user_id?: string | null
          video_id?: string | null
          video_url?: string
          view_count?: number
        }
        Relationships: []
      }
      coach_video_likes: {
        Row: {
          created_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_video_likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "coach_build_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      coaching_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          message_type: string
          metadata: Json | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string
          metadata?: Json | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string
          metadata?: Json | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          fail_id: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          fail_id: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          fail_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_fail_id_fkey"
            columns: ["fail_id"]
            isOneToOne: false
            referencedRelation: "oopsies"
            referencedColumns: ["id"]
          },
        ]
      }
      community_challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          reward_points: number | null
          start_date: string
          title: string
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          reward_points?: number | null
          start_date: string
          title: string
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          reward_points?: number | null
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          certificate_id: string | null
          comments_count: number
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes_count: number
          location: string | null
          shares_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          certificate_id?: string | null
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number
          location?: string | null
          shares_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          certificate_id?: string | null
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number
          location?: string | null
          shares_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      compliance_requirements: {
        Row: {
          applies_to_roles: Json | null
          category: string
          created_at: string
          description: string | null
          id: string
          is_mandatory: boolean | null
          name: string
          renewal_period_months: number | null
          required_documents: Json | null
          updated_at: string
        }
        Insert: {
          applies_to_roles?: Json | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_mandatory?: boolean | null
          name: string
          renewal_period_months?: number | null
          required_documents?: Json | null
          updated_at?: string
        }
        Update: {
          applies_to_roles?: Json | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_mandatory?: boolean | null
          name?: string
          renewal_period_months?: number | null
          required_documents?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      conferences_discipline: {
        Row: {
          call_for_papers: string | null
          created_at: string | null
          discipline_id: string | null
          early_bird_fee: number | null
          end_date: string | null
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          program_committee: Json | null
          registration_fee: number | null
          start_date: string | null
          stripe_price_ids: Json | null
          student_fee: number | null
          theme: string | null
          updated_at: string | null
          website_url: string | null
          year: number
        }
        Insert: {
          call_for_papers?: string | null
          created_at?: string | null
          discipline_id?: string | null
          early_bird_fee?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
          program_committee?: Json | null
          registration_fee?: number | null
          start_date?: string | null
          stripe_price_ids?: Json | null
          student_fee?: number | null
          theme?: string | null
          updated_at?: string | null
          website_url?: string | null
          year: number
        }
        Update: {
          call_for_papers?: string | null
          created_at?: string | null
          discipline_id?: string | null
          early_bird_fee?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          program_committee?: Json | null
          registration_fee?: number | null
          start_date?: string | null
          stripe_price_ids?: Json | null
          student_fee?: number | null
          theme?: string | null
          updated_at?: string | null
          website_url?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "conferences_discipline_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      consent_earnings: {
        Row: {
          amount: number
          consent_template_id: string | null
          currency: string
          earning_type: string
          id: string
          metadata: Json | null
          source_service: string | null
          transaction_date: string
          user_id: string
        }
        Insert: {
          amount: number
          consent_template_id?: string | null
          currency?: string
          earning_type: string
          id?: string
          metadata?: Json | null
          source_service?: string | null
          transaction_date?: string
          user_id: string
        }
        Update: {
          amount?: number
          consent_template_id?: string | null
          currency?: string
          earning_type?: string
          id?: string
          metadata?: Json | null
          source_service?: string | null
          transaction_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_earnings_consent_template_id_fkey"
            columns: ["consent_template_id"]
            isOneToOne: false
            referencedRelation: "consent_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_expiry_warnings: {
        Row: {
          consent_id: string
          created_at: string
          email_sent: boolean | null
          id: string
          sent_at: string
          warning_type: string
        }
        Insert: {
          consent_id: string
          created_at?: string
          email_sent?: boolean | null
          id?: string
          sent_at?: string
          warning_type: string
        }
        Update: {
          consent_id?: string
          created_at?: string
          email_sent?: boolean | null
          id?: string
          sent_at?: string
          warning_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_expiry_warnings_consent_id_fkey"
            columns: ["consent_id"]
            isOneToOne: false
            referencedRelation: "consentx_records"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_history: {
        Row: {
          change_reason: string | null
          changed_by: string | null
          created_at: string
          id: string
          metadata: Json | null
          new_status: string
          previous_status: string | null
          user_consent_id: string
        }
        Insert: {
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          new_status: string
          previous_status?: string | null
          user_consent_id: string
        }
        Update: {
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          new_status?: string
          previous_status?: string | null
          user_consent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_history_user_consent_id_fkey"
            columns: ["user_consent_id"]
            isOneToOne: false
            referencedRelation: "user_consents"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_marketplace: {
        Row: {
          consent_ownership_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          listing_type: string
          price: number
          seller_id: string
          views_count: number
        }
        Insert: {
          consent_ownership_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          listing_type?: string
          price: number
          seller_id: string
          views_count?: number
        }
        Update: {
          consent_ownership_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          listing_type?: string
          price?: number
          seller_id?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "consent_marketplace_consent_ownership_id_fkey"
            columns: ["consent_ownership_id"]
            isOneToOne: false
            referencedRelation: "consent_ownership"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_ownership: {
        Row: {
          consent_template_id: string
          created_at: string
          id: string
          is_transferable: boolean
          metadata: Json | null
          owner_id: string
          ownership_type: string
          transfer_price: number | null
          updated_at: string
        }
        Insert: {
          consent_template_id: string
          created_at?: string
          id?: string
          is_transferable?: boolean
          metadata?: Json | null
          owner_id: string
          ownership_type?: string
          transfer_price?: number | null
          updated_at?: string
        }
        Update: {
          consent_template_id?: string
          created_at?: string
          id?: string
          is_transferable?: boolean
          metadata?: Json | null
          owner_id?: string
          ownership_type?: string
          transfer_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_ownership_consent_template_id_fkey"
            columns: ["consent_template_id"]
            isOneToOne: false
            referencedRelation: "consent_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_records: {
        Row: {
          child_id: string | null
          completion_date: string | null
          consent_type: string
          created_at: string
          id: string
          notes: string | null
          request_date: string
          service_id: string | null
          status: string
        }
        Insert: {
          child_id?: string | null
          completion_date?: string | null
          consent_type: string
          created_at?: string
          id?: string
          notes?: string | null
          request_date?: string
          service_id?: string | null
          status?: string
        }
        Update: {
          child_id?: string | null
          completion_date?: string | null
          consent_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          request_date?: string
          service_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_records_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_records_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "digital_services"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_templates: {
        Row: {
          can_customize: boolean | null
          category_id: string | null
          created_at: string
          data_types: Json | null
          description: string
          id: string
          is_active: boolean | null
          is_required: boolean | null
          legal_basis: string | null
          life_stage_id: string | null
          privacy_impact_score: number | null
          purposes: Json | null
          retention_period: string | null
          service_id: string | null
          template_version: number | null
          title: string
          updated_at: string
        }
        Insert: {
          can_customize?: boolean | null
          category_id?: string | null
          created_at?: string
          data_types?: Json | null
          description: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          legal_basis?: string | null
          life_stage_id?: string | null
          privacy_impact_score?: number | null
          purposes?: Json | null
          retention_period?: string | null
          service_id?: string | null
          template_version?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          can_customize?: boolean | null
          category_id?: string | null
          created_at?: string
          data_types?: Json | null
          description?: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          legal_basis?: string | null
          life_stage_id?: string | null
          privacy_impact_score?: number | null
          purposes?: Json | null
          retention_period?: string | null
          service_id?: string | null
          template_version?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "consent_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_templates_life_stage_id_fkey"
            columns: ["life_stage_id"]
            isOneToOne: false
            referencedRelation: "life_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_templates_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "digital_services"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_transfers: {
        Row: {
          completed_at: string | null
          consent_ownership_id: string
          created_at: string
          from_user_id: string
          id: string
          price: number | null
          status: string
          to_user_id: string
          transfer_type: string
        }
        Insert: {
          completed_at?: string | null
          consent_ownership_id: string
          created_at?: string
          from_user_id: string
          id?: string
          price?: number | null
          status?: string
          to_user_id: string
          transfer_type?: string
        }
        Update: {
          completed_at?: string | null
          consent_ownership_id?: string
          created_at?: string
          from_user_id?: string
          id?: string
          price?: number | null
          status?: string
          to_user_id?: string
          transfer_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_transfers_consent_ownership_id_fkey"
            columns: ["consent_ownership_id"]
            isOneToOne: false
            referencedRelation: "consent_ownership"
            referencedColumns: ["id"]
          },
        ]
      }
      consentx_records: {
        Row: {
          consent_type: string
          created_at: string
          expires_at: string | null
          granted_at: string
          id: string
          metadata: Json | null
          purpose: string
          revoked_at: string | null
          status: string
          tenant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consent_type: string
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          id?: string
          metadata?: Json | null
          purpose: string
          revoked_at?: string | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consent_type?: string
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          id?: string
          metadata?: Json | null
          purpose?: string
          revoked_at?: string | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consentx_records_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          interest_area: string
          message: string | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          interest_area?: string
          message?: string | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          interest_area?: string
          message?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      content_analytics: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          oopsie_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          oopsie_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          oopsie_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_analytics_oopsie_id_fkey"
            columns: ["oopsie_id"]
            isOneToOne: false
            referencedRelation: "oopsies"
            referencedColumns: ["id"]
          },
        ]
      }
      content_categories: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_contributors: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          name: string
          social_links: Json | null
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          name: string
          social_links?: Json | null
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          social_links?: Json | null
          website_url?: string | null
        }
        Relationships: []
      }
      content_entries: {
        Row: {
          category_id: string | null
          contributor_id: string | null
          created_at: string | null
          description: string | null
          download_count: number | null
          duration_seconds: number | null
          featured_until: string | null
          file_size_bytes: number | null
          id: string
          is_featured: boolean | null
          license_id: string | null
          metadata: Json | null
          published_at: string | null
          search_vector: unknown
          slug: string
          source_name: string | null
          source_url: string | null
          status: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          category_id?: string | null
          contributor_id?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          duration_seconds?: number | null
          featured_until?: string | null
          file_size_bytes?: number | null
          id?: string
          is_featured?: boolean | null
          license_id?: string | null
          metadata?: Json | null
          published_at?: string | null
          search_vector?: unknown
          slug: string
          source_name?: string | null
          source_url?: string | null
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          category_id?: string | null
          contributor_id?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          duration_seconds?: number | null
          featured_until?: string | null
          file_size_bytes?: number | null
          id?: string
          is_featured?: boolean | null
          license_id?: string | null
          metadata?: Json | null
          published_at?: string | null
          search_vector?: unknown
          slug?: string
          source_name?: string | null
          source_url?: string | null
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_entries_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_entries_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "content_contributors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_entries_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "content_licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      content_health_checks: {
        Row: {
          checked_at: string | null
          entry_id: string | null
          error_message: string | null
          id: string
          is_accessible: boolean | null
          response_time_ms: number | null
          status_code: number | null
          url_checked: string
        }
        Insert: {
          checked_at?: string | null
          entry_id?: string | null
          error_message?: string | null
          id?: string
          is_accessible?: boolean | null
          response_time_ms?: number | null
          status_code?: number | null
          url_checked: string
        }
        Update: {
          checked_at?: string | null
          entry_id?: string | null
          error_message?: string | null
          id?: string
          is_accessible?: boolean | null
          response_time_ms?: number | null
          status_code?: number | null
          url_checked?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_health_checks_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "content_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_health_checks_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "content_entries_public"
            referencedColumns: ["id"]
          },
        ]
      }
      content_licenses: {
        Row: {
          code: string
          commercial_use_allowed: boolean | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          license_url: string | null
          name: string
          redistribution_allowed: boolean | null
          requires_attribution: boolean | null
        }
        Insert: {
          code: string
          commercial_use_allowed?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          license_url?: string | null
          name: string
          redistribution_allowed?: boolean | null
          requires_attribution?: boolean | null
        }
        Update: {
          code?: string
          commercial_use_allowed?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          license_url?: string | null
          name?: string
          redistribution_allowed?: boolean | null
          requires_attribution?: boolean | null
        }
        Relationships: []
      }
      content_media_assets: {
        Row: {
          created_at: string | null
          entry_id: string | null
          height: number | null
          id: string
          is_primary: boolean | null
          media_type: string
          title: string | null
          url: string
          width: number | null
        }
        Insert: {
          created_at?: string | null
          entry_id?: string | null
          height?: number | null
          id?: string
          is_primary?: boolean | null
          media_type: string
          title?: string | null
          url: string
          width?: number | null
        }
        Update: {
          created_at?: string | null
          entry_id?: string | null
          height?: number | null
          id?: string
          is_primary?: boolean | null
          media_type?: string
          title?: string | null
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_media_assets_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "content_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_media_assets_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "content_entries_public"
            referencedColumns: ["id"]
          },
        ]
      }
      content_sources: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_checked: string | null
          platform: string
          source_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_checked?: string | null
          platform: string
          source_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_checked?: string | null
          platform?: string
          source_id?: string
        }
        Relationships: []
      }
      contributor_reputation: {
        Row: {
          approval_rate: number | null
          approved_submissions: number | null
          contributor_level: string | null
          created_at: string | null
          id: string
          last_updated: string | null
          quality_score: number | null
          rejected_submissions: number | null
          total_submissions: number | null
          user_id: string
        }
        Insert: {
          approval_rate?: number | null
          approved_submissions?: number | null
          contributor_level?: string | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          quality_score?: number | null
          rejected_submissions?: number | null
          total_submissions?: number | null
          user_id: string
        }
        Update: {
          approval_rate?: number | null
          approved_submissions?: number | null
          contributor_level?: string | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          quality_score?: number | null
          rejected_submissions?: number | null
          total_submissions?: number | null
          user_id?: string
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          certificate_issued: boolean | null
          certificate_url: string | null
          completion_date: string | null
          course_id: string | null
          created_at: string | null
          enrollment_date: string | null
          final_grade: number | null
          id: string
          payment_status: string | null
          progress_percentage: number | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          certificate_issued?: boolean | null
          certificate_url?: string | null
          completion_date?: string | null
          course_id?: string | null
          created_at?: string | null
          enrollment_date?: string | null
          final_grade?: number | null
          id?: string
          payment_status?: string | null
          progress_percentage?: number | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          certificate_issued?: boolean | null
          certificate_url?: string | null
          completion_date?: string | null
          course_id?: string | null
          created_at?: string | null
          enrollment_date?: string | null
          final_grade?: number | null
          id?: string
          payment_status?: string | null
          progress_percentage?: number | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_submissions: {
        Row: {
          company: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          link_url: string
          provider: string
          status: string
          submitted_by: string | null
          title: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          link_url: string
          provider: string
          status?: string
          submitted_by?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          link_url?: string
          provider?: string
          status?: string
          submitted_by?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          certification_requirements: Json | null
          company: string | null
          created_at: string
          description: string | null
          discipline_id: string | null
          duration_hours: number | null
          id: string
          image_url: string | null
          is_published: boolean
          learning_outcomes: string[] | null
          level: string | null
          link_url: string
          prerequisites: string[] | null
          provider: string
          stripe_price_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          certification_requirements?: Json | null
          company?: string | null
          created_at?: string
          description?: string | null
          discipline_id?: string | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          learning_outcomes?: string[] | null
          level?: string | null
          link_url: string
          prerequisites?: string[] | null
          provider: string
          stripe_price_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          certification_requirements?: Json | null
          company?: string | null
          created_at?: string
          description?: string | null
          discipline_id?: string | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          learning_outcomes?: string[] | null
          level?: string | null
          link_url?: string
          prerequisites?: string[] | null
          provider?: string
          stripe_price_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
        ]
      }
      cross_tenant_shares: {
        Row: {
          created_at: string
          data_types: string[]
          expires_at: string | null
          granted_at: string
          id: string
          is_active: boolean | null
          source_tenant_id: string | null
          target_tenant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_types?: string[]
          expires_at?: string | null
          granted_at?: string
          id?: string
          is_active?: boolean | null
          source_tenant_id?: string | null
          target_tenant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_types?: string[]
          expires_at?: string | null
          granted_at?: string
          id?: string
          is_active?: boolean | null
          source_tenant_id?: string | null
          target_tenant_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cross_tenant_shares_source_tenant_id_fkey"
            columns: ["source_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_tenant_shares_target_tenant_id_fkey"
            columns: ["target_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_stories: {
        Row: {
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean
          offering_id: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          offering_id: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          offering_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_stories_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_analytics: {
        Row: {
          active_users: number | null
          created_at: string | null
          date: string
          id: string
          new_users: number | null
          top_category: string | null
          total_downloads: number | null
          total_views: number | null
          trending_agents: Json | null
        }
        Insert: {
          active_users?: number | null
          created_at?: string | null
          date?: string
          id?: string
          new_users?: number | null
          top_category?: string | null
          total_downloads?: number | null
          total_views?: number | null
          trending_agents?: Json | null
        }
        Update: {
          active_users?: number | null
          created_at?: string | null
          date?: string
          id?: string
          new_users?: number | null
          top_category?: string | null
          total_downloads?: number | null
          total_views?: number | null
          trending_agents?: Json | null
        }
        Relationships: []
      }
      daily_challenges: {
        Row: {
          board_data: Json
          challenge_date: string
          created_at: string
          id: string
          seed: string
          theme: string
        }
        Insert: {
          board_data: Json
          challenge_date: string
          created_at?: string
          id?: string
          seed: string
          theme?: string
        }
        Update: {
          board_data?: Json
          challenge_date?: string
          created_at?: string
          id?: string
          seed?: string
          theme?: string
        }
        Relationships: []
      }
      daily_nutrition_summary: {
        Row: {
          average_vibe_score: number | null
          breakfast_count: number | null
          created_at: string
          date: string
          dinner_count: number | null
          id: string
          lunch_count: number | null
          mood_summary: Json | null
          music_vibes: string[] | null
          notes: string | null
          nutrition_data: Json | null
          snack_count: number | null
          total_meals: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_vibe_score?: number | null
          breakfast_count?: number | null
          created_at?: string
          date: string
          dinner_count?: number | null
          id?: string
          lunch_count?: number | null
          mood_summary?: Json | null
          music_vibes?: string[] | null
          notes?: string | null
          nutrition_data?: Json | null
          snack_count?: number | null
          total_meals?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_vibe_score?: number | null
          breakfast_count?: number | null
          created_at?: string
          date?: string
          dinner_count?: number | null
          id?: string
          lunch_count?: number | null
          mood_summary?: Json | null
          music_vibes?: string[] | null
          notes?: string | null
          nutrition_data?: Json | null
          snack_count?: number | null
          total_meals?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dashboard_snapshots: {
        Row: {
          created_at: string
          id: string
          snapshot: Json
        }
        Insert: {
          created_at?: string
          id?: string
          snapshot: Json
        }
        Update: {
          created_at?: string
          id?: string
          snapshot?: Json
        }
        Relationships: []
      }
      detail_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string | null
          request_type: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name?: string | null
          request_type?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string | null
          request_type?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      digital_services: {
        Row: {
          category: string
          contact_email: string | null
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          privacy_policy_url: string | null
          website_url: string | null
        }
        Insert: {
          category: string
          contact_email?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          privacy_policy_url?: string | null
          website_url?: string | null
        }
        Update: {
          category?: string
          contact_email?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          privacy_policy_url?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      discipline_checklists: {
        Row: {
          audit_notes: string | null
          checklist_data: Json
          completion_percentage: number | null
          created_at: string | null
          discipline_id: string | null
          id: string
          last_audit_date: string | null
          updated_at: string | null
        }
        Insert: {
          audit_notes?: string | null
          checklist_data?: Json
          completion_percentage?: number | null
          created_at?: string | null
          discipline_id?: string | null
          id?: string
          last_audit_date?: string | null
          updated_at?: string | null
        }
        Update: {
          audit_notes?: string | null
          checklist_data?: Json
          completion_percentage?: number | null
          created_at?: string | null
          discipline_id?: string | null
          id?: string
          last_audit_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discipline_checklists_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: true
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
        ]
      }
      disciplines: {
        Row: {
          branding: Json | null
          charter: string | null
          colors: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          scope: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          branding?: Json | null
          charter?: string | null
          colors?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          scope?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          branding?: Json | null
          charter?: string | null
          colors?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          scope?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      docs: {
        Row: {
          author: string | null
          content: string
          created_at: string | null
          id: string
          is_current: boolean | null
          title: string
          type: string | null
          version: number
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_current?: boolean | null
          title: string
          type?: string | null
          version?: number
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_current?: boolean | null
          title?: string
          type?: string | null
          version?: number
        }
        Relationships: []
      }
      doctor_appointments: {
        Row: {
          appointment_type: string
          created_at: string
          doctor_name: string
          duration_minutes: number | null
          follow_up_required: boolean | null
          id: string
          location: string | null
          notes: string | null
          scheduled_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_type: string
          created_at?: string
          doctor_name: string
          duration_minutes?: number | null
          follow_up_required?: boolean | null
          id?: string
          location?: string | null
          notes?: string | null
          scheduled_at: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_type?: string
          created_at?: string
          doctor_name?: string
          duration_minutes?: number | null
          follow_up_required?: boolean | null
          id?: string
          location?: string | null
          notes?: string | null
          scheduled_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      document_access_log: {
        Row: {
          accessed_at: string
          accessed_by: string
          action: string
          document_id: string
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          accessed_at?: string
          accessed_by: string
          action: string
          document_id: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          accessed_at?: string
          accessed_by?: string
          action?: string
          document_id?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_access_log_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "child_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      domain_tenant_mappings: {
        Row: {
          created_at: string
          domain: string
          id: string
          is_active: boolean
          tenant_id: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          is_active?: boolean
          tenant_id: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          is_active?: boolean
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "domain_tenant_mappings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      domains_map: {
        Row: {
          business_area: string
          created_at: string | null
          description: string | null
          domain_name: string
          id: string
        }
        Insert: {
          business_area: string
          created_at?: string | null
          description?: string | null
          domain_name: string
          id?: string
        }
        Update: {
          business_area?: string
          created_at?: string | null
          description?: string | null
          domain_name?: string
          id?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          currency: string
          donor_email: string | null
          id: string
          paid_at: string | null
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          donor_email?: string | null
          id?: string
          paid_at?: string | null
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          donor_email?: string | null
          id?: string
          paid_at?: string | null
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_captures: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          source: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          source: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          source?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      email_subscriptions: {
        Row: {
          created_at: string
          email: string
          source: string | null
          subscribed_at: string
          target_email: string
        }
        Insert: {
          created_at?: string
          email: string
          source?: string | null
          subscribed_at?: string
          target_email?: string
        }
        Update: {
          created_at?: string
          email?: string
          source?: string | null
          subscribed_at?: string
          target_email?: string
        }
        Relationships: []
      }
      family_agents: {
        Row: {
          achievement: string | null
          agent_code: string
          background: string | null
          consultant_hourly_rate: number | null
          core_skills: string | null
          cost_rate: number | null
          created_at: string | null
          cultural_expertise: string | null
          delivery_type: string | null
          division_name: string | null
          domain: string | null
          domain_id: string | null
          family_member_id: string | null
          function: string | null
          id: string
          persona: string
          sfia_level: number | null
          signature_method: string | null
          specialization: string | null
          summary_bio: string | null
          task_coverage_pct: number | null
          tech_stack: string | null
          updated_at: string | null
        }
        Insert: {
          achievement?: string | null
          agent_code: string
          background?: string | null
          consultant_hourly_rate?: number | null
          core_skills?: string | null
          cost_rate?: number | null
          created_at?: string | null
          cultural_expertise?: string | null
          delivery_type?: string | null
          division_name?: string | null
          domain?: string | null
          domain_id?: string | null
          family_member_id?: string | null
          function?: string | null
          id?: string
          persona: string
          sfia_level?: number | null
          signature_method?: string | null
          specialization?: string | null
          summary_bio?: string | null
          task_coverage_pct?: number | null
          tech_stack?: string | null
          updated_at?: string | null
        }
        Update: {
          achievement?: string | null
          agent_code?: string
          background?: string | null
          consultant_hourly_rate?: number | null
          core_skills?: string | null
          cost_rate?: number | null
          created_at?: string | null
          cultural_expertise?: string | null
          delivery_type?: string | null
          division_name?: string | null
          domain?: string | null
          domain_id?: string | null
          family_member_id?: string | null
          function?: string | null
          id?: string
          persona?: string
          sfia_level?: number | null
          signature_method?: string | null
          specialization?: string | null
          summary_bio?: string | null
          task_coverage_pct?: number | null
          tech_stack?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      family_agents_ai: {
        Row: {
          agent_code: string | null
          change_family: string | null
          core_skills: string | null
          cost_rate: number | null
          domain: string | null
          function: string | null
          future_value_state: string | null
          id: string
          impact_vector: string | null
          persona: string | null
          sfia_level: number | null
          summary_bio: string | null
          transition_steps: string | null
        }
        Insert: {
          agent_code?: string | null
          change_family?: string | null
          core_skills?: string | null
          cost_rate?: number | null
          domain?: string | null
          function?: string | null
          future_value_state?: string | null
          id: string
          impact_vector?: string | null
          persona?: string | null
          sfia_level?: number | null
          summary_bio?: string | null
          transition_steps?: string | null
        }
        Update: {
          agent_code?: string | null
          change_family?: string | null
          core_skills?: string | null
          cost_rate?: number | null
          domain?: string | null
          function?: string | null
          future_value_state?: string | null
          id?: string
          impact_vector?: string | null
          persona?: string | null
          sfia_level?: number | null
          summary_bio?: string | null
          transition_steps?: string | null
        }
        Relationships: []
      }
      family_agents_ai_native: {
        Row: {
          core_skills: string | null
          cost_factor: number | null
          cost_rate: number | null
          domain: string | null
          domain_weight: number | null
          enriched_at: string | null
          function: string | null
          future_premium: number | null
          id: string | null
          impact_score: number | null
          impact_vector: string | null
          persona: string | null
          reskilling_path: string[] | null
          sfia_level: number | null
          sfia_modifier: number | null
          skill_disruption: number | null
          summary_bio: string | null
        }
        Insert: {
          core_skills?: string | null
          cost_factor?: number | null
          cost_rate?: number | null
          domain?: string | null
          domain_weight?: number | null
          enriched_at?: string | null
          function?: string | null
          future_premium?: number | null
          id?: string | null
          impact_score?: number | null
          impact_vector?: string | null
          persona?: string | null
          reskilling_path?: string[] | null
          sfia_level?: number | null
          sfia_modifier?: number | null
          skill_disruption?: number | null
          summary_bio?: string | null
        }
        Update: {
          core_skills?: string | null
          cost_factor?: number | null
          cost_rate?: number | null
          domain?: string | null
          domain_weight?: number | null
          enriched_at?: string | null
          function?: string | null
          future_premium?: number | null
          id?: string | null
          impact_score?: number | null
          impact_vector?: string | null
          persona?: string | null
          reskilling_path?: string[] | null
          sfia_level?: number | null
          sfia_modifier?: number | null
          skill_disruption?: number | null
          summary_bio?: string | null
        }
        Relationships: []
      }
      family_agents_rows: {
        Row: {
          achievement: string | null
          agent_code: string | null
          background: string | null
          consultant_hourly_rate: number | null
          core_skills: string | null
          created_at: string | null
          cultural_expertise: string | null
          delivery_type: string | null
          division_name: string | null
          domain: string | null
          family_member_id: string | null
          final_cost: number | null
          function: string | null
          id: string | null
          persona: string | null
          sfia_level: number | null
          signature_method: string | null
          specialization: string | null
          summary_bio: string | null
          task_coverage_pct: number | null
          tech_stack: string | null
          updated_at: string | null
        }
        Insert: {
          achievement?: string | null
          agent_code?: string | null
          background?: string | null
          consultant_hourly_rate?: number | null
          core_skills?: string | null
          created_at?: string | null
          cultural_expertise?: string | null
          delivery_type?: string | null
          division_name?: string | null
          domain?: string | null
          family_member_id?: string | null
          final_cost?: number | null
          function?: string | null
          id?: string | null
          persona?: string | null
          sfia_level?: number | null
          signature_method?: string | null
          specialization?: string | null
          summary_bio?: string | null
          task_coverage_pct?: number | null
          tech_stack?: string | null
          updated_at?: string | null
        }
        Update: {
          achievement?: string | null
          agent_code?: string | null
          background?: string | null
          consultant_hourly_rate?: number | null
          core_skills?: string | null
          created_at?: string | null
          cultural_expertise?: string | null
          delivery_type?: string | null
          division_name?: string | null
          domain?: string | null
          family_member_id?: string | null
          final_cost?: number | null
          function?: string | null
          id?: string | null
          persona?: string | null
          sfia_level?: number | null
          signature_method?: string | null
          specialization?: string | null
          summary_bio?: string | null
          task_coverage_pct?: number | null
          tech_stack?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      "family_agents_rows.csv": {
        Row: {
          achievement: string | null
          agent_code: string | null
          background: string | null
          consultant_hourly_rate: number | null
          core_skills: string | null
          created_at: string | null
          cultural_expertise: string | null
          delivery_type: string | null
          division_name: string | null
          domain: string | null
          family_member_id: string | null
          final_cost: number | null
          function: string | null
          id: string | null
          persona: string | null
          sfia_level: number | null
          signature_method: string | null
          specialization: string | null
          summary_bio: string | null
          task_coverage_pct: number | null
          tech_stack: string | null
          updated_at: string | null
        }
        Insert: {
          achievement?: string | null
          agent_code?: string | null
          background?: string | null
          consultant_hourly_rate?: number | null
          core_skills?: string | null
          created_at?: string | null
          cultural_expertise?: string | null
          delivery_type?: string | null
          division_name?: string | null
          domain?: string | null
          family_member_id?: string | null
          final_cost?: number | null
          function?: string | null
          id?: string | null
          persona?: string | null
          sfia_level?: number | null
          signature_method?: string | null
          specialization?: string | null
          summary_bio?: string | null
          task_coverage_pct?: number | null
          tech_stack?: string | null
          updated_at?: string | null
        }
        Update: {
          achievement?: string | null
          agent_code?: string | null
          background?: string | null
          consultant_hourly_rate?: number | null
          core_skills?: string | null
          created_at?: string | null
          cultural_expertise?: string | null
          delivery_type?: string | null
          division_name?: string | null
          domain?: string | null
          family_member_id?: string | null
          final_cost?: number | null
          function?: string | null
          id?: string | null
          persona?: string | null
          sfia_level?: number | null
          signature_method?: string | null
          specialization?: string | null
          summary_bio?: string | null
          task_coverage_pct?: number | null
          tech_stack?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      family_budgets: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string
          end_date: string | null
          family_group_id: string
          id: string
          period: string
          start_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          created_by: string
          end_date?: string | null
          family_group_id: string
          id?: string
          period?: string
          start_date?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string
          end_date?: string | null
          family_group_id?: string
          id?: string
          period?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_budgets_family_group_id_fkey"
            columns: ["family_group_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      family_events: {
        Row: {
          child_id: string | null
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          event_type: string
          family_group_id: string
          id: string
          location: string | null
          reminders: Json
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          event_type: string
          family_group_id: string
          id?: string
          location?: string | null
          reminders?: Json
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          child_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          event_type?: string
          family_group_id?: string
          id?: string
          location?: string | null
          reminders?: Json
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_events_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_events_family_group_id_fkey"
            columns: ["family_group_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      family_groups: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          privacy_level: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          privacy_level?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          privacy_level?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          can_manage_others: boolean | null
          child_id: string | null
          family_group_id: string
          guardian_id: string | null
          id: string
          joined_at: string
          permissions: Json | null
          role: string
        }
        Insert: {
          can_manage_others?: boolean | null
          child_id?: string | null
          family_group_id: string
          guardian_id?: string | null
          id?: string
          joined_at?: string
          permissions?: Json | null
          role?: string
        }
        Update: {
          can_manage_others?: boolean | null
          child_id?: string | null
          family_group_id?: string
          guardian_id?: string | null
          id?: string
          joined_at?: string
          permissions?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_family_group_id_fkey"
            columns: ["family_group_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
        ]
      }
      family_relationships: {
        Row: {
          created_at: string
          family_group_id: string
          id: string
          permissions: string[]
          relationship_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          family_group_id: string
          id?: string
          permissions?: string[]
          relationship_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          family_group_id?: string
          id?: string
          permissions?: string[]
          relationship_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_relationships_family_group_id_fkey"
            columns: ["family_group_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      family_transactions: {
        Row: {
          amount: number
          category: string
          child_id: string | null
          created_at: string
          created_by: string
          currency: string
          description: string | null
          family_group_id: string
          id: string
          receipt_path: string | null
          transaction_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          child_id?: string | null
          created_at?: string
          created_by: string
          currency?: string
          description?: string | null
          family_group_id: string
          id?: string
          receipt_path?: string | null
          transaction_date?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          child_id?: string | null
          created_at?: string
          created_by?: string
          currency?: string
          description?: string | null
          family_group_id?: string
          id?: string
          receipt_path?: string | null
          transaction_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_transactions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_transactions_family_group_id_fkey"
            columns: ["family_group_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_content_slots: {
        Row: {
          created_at: string | null
          ends_at: string
          entry_id: string | null
          id: string
          is_active: boolean | null
          slot_position: number | null
          starts_at: string
        }
        Insert: {
          created_at?: string | null
          ends_at: string
          entry_id?: string | null
          id?: string
          is_active?: boolean | null
          slot_position?: number | null
          starts_at: string
        }
        Update: {
          created_at?: string | null
          ends_at?: string
          entry_id?: string | null
          id?: string
          is_active?: boolean | null
          slot_position?: number | null
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_content_slots_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "content_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_content_slots_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "content_entries_public"
            referencedColumns: ["id"]
          },
        ]
      }
      file_library: {
        Row: {
          category: string
          created_date: string
          direction: string | null
          file_ext: string
          file_name: string
          id: string
          notes: string | null
          source_url: string | null
          tags: string | null
          theme_title: string
        }
        Insert: {
          category: string
          created_date?: string
          direction?: string | null
          file_ext: string
          file_name: string
          id?: string
          notes?: string | null
          source_url?: string | null
          tags?: string | null
          theme_title: string
        }
        Update: {
          category?: string
          created_date?: string
          direction?: string | null
          file_ext?: string
          file_name?: string
          id?: string
          notes?: string | null
          source_url?: string | null
          tags?: string | null
          theme_title?: string
        }
        Relationships: []
      }
      form_submission_tracking: {
        Row: {
          form_type: string
          id: string
          ip_address: unknown
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          form_type: string
          id?: string
          ip_address: unknown
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          form_type?: string
          id?: string
          ip_address?: unknown
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      fun_activities: {
        Row: {
          activity_name: string
          activity_type: string
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          points: number | null
          user_id: string
        }
        Insert: {
          activity_name: string
          activity_type: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          points?: number | null
          user_id: string
        }
        Update: {
          activity_name?: string
          activity_type?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          points?: number | null
          user_id?: string
        }
        Relationships: []
      }
      governance_events: {
        Row: {
          created_at: string | null
          details: string | null
          event_type: string
          id: string
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          event_type: string
          id?: string
        }
        Update: {
          created_at?: string | null
          details?: string | null
          event_type?: string
          id?: string
        }
        Relationships: []
      }
      guardians: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string | null
          verification_status: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
          verification_status?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
          verification_status?: string
        }
        Relationships: []
      }
      health_documents: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          document_data: Json
          document_type: string
          expires_at: string | null
          extracted_at: string | null
          id: string
          original_image_url: string | null
          qr_token: string
          updated_at: string | null
          user_id: string | null
          validation_status: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          document_data?: Json
          document_type: string
          expires_at?: string | null
          extracted_at?: string | null
          id?: string
          original_image_url?: string | null
          qr_token: string
          updated_at?: string | null
          user_id?: string | null
          validation_status?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          document_data?: Json
          document_type?: string
          expires_at?: string | null
          extracted_at?: string | null
          id?: string
          original_image_url?: string | null
          qr_token?: string
          updated_at?: string | null
          user_id?: string | null
          validation_status?: string | null
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          updated_at: string
          usage_location: string
          user_id: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          updated_at?: string
          usage_location?: string
          user_id?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          updated_at?: string
          usage_location?: string
          user_id?: string | null
        }
        Relationships: []
      }
      "Ideas Backlog B.csv": {
        Row: {
          content: string | null
          folder_path: string | null
          id: number | null
          owner: string | null
          priority: string | null
          status: string | null
          tags: string | null
        }
        Insert: {
          content?: string | null
          folder_path?: string | null
          id?: number | null
          owner?: string | null
          priority?: string | null
          status?: string | null
          tags?: string | null
        }
        Update: {
          content?: string | null
          folder_path?: string | null
          id?: number | null
          owner?: string | null
          priority?: string | null
          status?: string | null
          tags?: string | null
        }
        Relationships: []
      }
      import_jobs: {
        Row: {
          completed_at: string | null
          config: Json | null
          created_at: string | null
          errors: string[] | null
          id: string
          platform: string
          processed_items: number
          query: string | null
          started_at: string | null
          status: string
          total_items: number
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string | null
          errors?: string[] | null
          id: string
          platform: string
          processed_items?: number
          query?: string | null
          started_at?: string | null
          status?: string
          total_items?: number
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string | null
          errors?: string[] | null
          id?: string
          platform?: string
          processed_items?: number
          query?: string | null
          started_at?: string | null
          status?: string
          total_items?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      insurance_policies: {
        Row: {
          coverage_amount: number
          coverage_duration_days: number
          covered_animals: string[]
          covered_regions: string[]
          created_at: string
          description: string
          exclusions: string[]
          id: string
          is_active: boolean
          name: string
          price: number
          requirements: string[]
        }
        Insert: {
          coverage_amount: number
          coverage_duration_days?: number
          covered_animals?: string[]
          covered_regions?: string[]
          created_at?: string
          description: string
          exclusions?: string[]
          id?: string
          is_active?: boolean
          name: string
          price: number
          requirements?: string[]
        }
        Update: {
          coverage_amount?: number
          coverage_duration_days?: number
          covered_animals?: string[]
          covered_regions?: string[]
          created_at?: string
          description?: string
          exclusions?: string[]
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          requirements?: string[]
        }
        Relationships: []
      }
      interview_stories: {
        Row: {
          action: string
          action_score: number | null
          ai_suggestions: Json | null
          completeness_score: number | null
          created_at: string
          external_docs_url: string | null
          framing: string
          id: string
          last_analyzed_at: string | null
          lesson: string
          lesson_score: number | null
          organisation: string
          quality_score: number | null
          result: string
          result_score: number | null
          role: string | null
          score: number | null
          search_vector: unknown
          situation: string
          situation_score: number | null
          star_l_id: string | null
          star_rating: number | null
          task: string
          task_score: number | null
          theme: string
          tier: number | null
          total_star_score: number | null
          updated_at: string
          user_id: string | null
          values_bonus: number | null
          year: number | null
        }
        Insert: {
          action: string
          action_score?: number | null
          ai_suggestions?: Json | null
          completeness_score?: number | null
          created_at?: string
          external_docs_url?: string | null
          framing: string
          id?: string
          last_analyzed_at?: string | null
          lesson: string
          lesson_score?: number | null
          organisation: string
          quality_score?: number | null
          result: string
          result_score?: number | null
          role?: string | null
          score?: number | null
          search_vector?: unknown
          situation: string
          situation_score?: number | null
          star_l_id?: string | null
          star_rating?: number | null
          task: string
          task_score?: number | null
          theme: string
          tier?: number | null
          total_star_score?: number | null
          updated_at?: string
          user_id?: string | null
          values_bonus?: number | null
          year?: number | null
        }
        Update: {
          action?: string
          action_score?: number | null
          ai_suggestions?: Json | null
          completeness_score?: number | null
          created_at?: string
          external_docs_url?: string | null
          framing?: string
          id?: string
          last_analyzed_at?: string | null
          lesson?: string
          lesson_score?: number | null
          organisation?: string
          quality_score?: number | null
          result?: string
          result_score?: number | null
          role?: string | null
          score?: number | null
          search_vector?: unknown
          situation?: string
          situation_score?: number | null
          star_l_id?: string | null
          star_rating?: number | null
          task?: string
          task_score?: number | null
          theme?: string
          tier?: number | null
          total_star_score?: number | null
          updated_at?: string
          user_id?: string | null
          values_bonus?: number | null
          year?: number | null
        }
        Relationships: []
      }
      ip_blocklist: {
        Row: {
          blocked_at: string | null
          blocked_by: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: unknown
          is_permanent: boolean | null
          reason: string
        }
        Insert: {
          blocked_at?: string | null
          blocked_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address: unknown
          is_permanent?: boolean | null
          reason: string
        }
        Update: {
          blocked_at?: string | null
          blocked_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          is_permanent?: boolean | null
          reason?: string
        }
        Relationships: []
      }
      jd_story_matches: {
        Row: {
          created_at: string
          id: string
          is_recommended: boolean | null
          jd_id: string
          match_reasons: Json | null
          match_score: number | null
          story_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_recommended?: boolean | null
          jd_id: string
          match_reasons?: Json | null
          match_score?: number | null
          story_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_recommended?: boolean | null
          jd_id?: string
          match_reasons?: Json | null
          match_score?: number | null
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jd_story_matches_jd_id_fkey"
            columns: ["jd_id"]
            isOneToOne: false
            referencedRelation: "job_descriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jd_story_matches_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "interview_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      job_descriptions: {
        Row: {
          company: string | null
          created_at: string
          description: string
          extracted_keywords: Json | null
          extracted_themes: Json | null
          id: string
          requirements_json: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          description: string
          extracted_keywords?: Json | null
          extracted_themes?: Json | null
          id?: string
          requirements_json?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          description?: string
          extracted_keywords?: Json | null
          extracted_themes?: Json | null
          id?: string
          requirements_json?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      jobs_waitlist: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          metadata: Json | null
          name: string | null
          referrer_url: string | null
          role_interest: string
          source: string | null
          status: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          name?: string | null
          referrer_url?: string | null
          role_interest: string
          source?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          name?: string | null
          referrer_url?: string | null
          role_interest?: string
          source?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          entry_type: string
          id: string
          is_shared_with_coach: boolean | null
          mood_rating: number | null
          tags: Json | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          entry_type?: string
          id?: string
          is_shared_with_coach?: boolean | null
          mood_rating?: number | null
          tags?: Json | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          entry_type?: string
          id?: string
          is_shared_with_coach?: boolean | null
          mood_rating?: number | null
          tags?: Json | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journals: {
        Row: {
          aims_scope: string | null
          created_at: string | null
          discipline_id: string | null
          editorial_board: Json | null
          id: string
          is_active: boolean | null
          issn: string | null
          name: string
          review_policy: string | null
          submission_guidelines: string | null
          updated_at: string | null
        }
        Insert: {
          aims_scope?: string | null
          created_at?: string | null
          discipline_id?: string | null
          editorial_board?: Json | null
          id?: string
          is_active?: boolean | null
          issn?: string | null
          name: string
          review_policy?: string | null
          submission_guidelines?: string | null
          updated_at?: string | null
        }
        Update: {
          aims_scope?: string | null
          created_at?: string | null
          discipline_id?: string | null
          editorial_board?: Json | null
          id?: string
          is_active?: boolean | null
          issn?: string | null
          name?: string
          review_policy?: string | null
          submission_guidelines?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journals_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_results: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          ordered_by: string | null
          reference_range: string | null
          result_value: string | null
          status: string | null
          test_date: string
          test_name: string
          test_type: string
          unit: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          ordered_by?: string | null
          reference_range?: string | null
          result_value?: string | null
          status?: string | null
          test_date: string
          test_name: string
          test_type: string
          unit?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          ordered_by?: string | null
          reference_range?: string | null
          result_value?: string | null
          status?: string | null
          test_date?: string
          test_name?: string
          test_type?: string
          unit?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lead_submissions: {
        Row: {
          company: string | null
          consent_marketing: boolean | null
          consent_terms: boolean | null
          created_at: string
          email: string
          id: string
          ip_address: string | null
          journey_type: string
          message: string | null
          name: string | null
          phone: string | null
          role: string | null
          source: string | null
          status: string | null
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          company?: string | null
          consent_marketing?: boolean | null
          consent_terms?: boolean | null
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          journey_type: string
          message?: string | null
          name?: string | null
          phone?: string | null
          role?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          company?: string | null
          consent_marketing?: boolean | null
          consent_terms?: boolean | null
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          journey_type?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          role?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      leaderboards: {
        Row: {
          category: string
          created_at: string | null
          id: string
          period_end: string | null
          period_start: string | null
          rank: number | null
          score: number
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          rank?: number | null
          score: number
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          rank?: number | null
          score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          display_email: string | null
          email: string
          id: string
          message: string | null
          name: string
          service: string | null
          source: string | null
          target_email: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          display_email?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          service?: string | null
          source?: string | null
          target_email?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          display_email?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          service?: string | null
          source?: string | null
          target_email?: string
          updated_at?: string
        }
        Relationships: []
      }
      life_stages: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          max_age: number | null
          min_age: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          max_age?: number | null
          min_age: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          max_age?: number | null
          min_age?: number
          name?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          fail_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fail_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          fail_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_fail_id_fkey"
            columns: ["fail_id"]
            isOneToOne: false
            referencedRelation: "oopsies"
            referencedColumns: ["id"]
          },
        ]
      }
      link_health: {
        Row: {
          checked_count: number | null
          error_message: string | null
          first_discovered: string | null
          id: string
          is_healthy: boolean | null
          last_checked: string | null
          response_time: number | null
          status_code: number | null
          url: string
        }
        Insert: {
          checked_count?: number | null
          error_message?: string | null
          first_discovered?: string | null
          id?: string
          is_healthy?: boolean | null
          last_checked?: string | null
          response_time?: number | null
          status_code?: number | null
          url: string
        }
        Update: {
          checked_count?: number | null
          error_message?: string | null
          first_discovered?: string | null
          id?: string
          is_healthy?: boolean | null
          last_checked?: string | null
          response_time?: number | null
          status_code?: number | null
          url?: string
        }
        Relationships: []
      }
      mcp_catalog_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mcp_catalog_items: {
        Row: {
          category: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          sector: string | null
          slug: string
          sort_order: number | null
          tags: string[] | null
          tier: string
          updated_at: string | null
          vendor: string | null
          website_url: string
        }
        Insert: {
          category?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          sector?: string | null
          slug: string
          sort_order?: number | null
          tags?: string[] | null
          tier: string
          updated_at?: string | null
          vendor?: string | null
          website_url: string
        }
        Update: {
          category?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          sector?: string | null
          slug?: string
          sort_order?: number | null
          tags?: string[] | null
          tier?: string
          updated_at?: string | null
          vendor?: string | null
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcp_catalog_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "mcp_catalog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_contributions: {
        Row: {
          attachment_url: string | null
          created_at: string | null
          description: string | null
          id: string
          repo_url: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_by: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          repo_url: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_by?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attachment_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          repo_url?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_by?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mcp_exam_answers: {
        Row: {
          attempt_id: string
          correct: boolean
          created_at: string | null
          qid: string
          selected_index: number
        }
        Insert: {
          attempt_id: string
          correct?: boolean
          created_at?: string | null
          qid: string
          selected_index: number
        }
        Update: {
          attempt_id?: string
          correct?: boolean
          created_at?: string | null
          qid?: string
          selected_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "mcp_exam_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "mcp_exam_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_exam_attempts: {
        Row: {
          completed_at: string | null
          created_at: string | null
          exam_version: string
          id: string
          passed: boolean | null
          score_numeric: number | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          exam_version: string
          id?: string
          passed?: boolean | null
          score_numeric?: number | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          exam_version?: string
          id?: string
          passed?: boolean | null
          score_numeric?: number | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meal_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      meal_reports: {
        Row: {
          achievements: Json | null
          created_at: string
          end_date: string
          favorite_meals: Json | null
          goals_progress: Json | null
          id: string
          least_favorite_meals: Json | null
          mood_patterns: Json | null
          new_foods_tried: number | null
          nutrition_trends: Json | null
          report_data: Json | null
          report_type: string
          start_date: string
          total_meals: number | null
          user_id: string
        }
        Insert: {
          achievements?: Json | null
          created_at?: string
          end_date: string
          favorite_meals?: Json | null
          goals_progress?: Json | null
          id?: string
          least_favorite_meals?: Json | null
          mood_patterns?: Json | null
          new_foods_tried?: number | null
          nutrition_trends?: Json | null
          report_data?: Json | null
          report_type: string
          start_date: string
          total_meals?: number | null
          user_id: string
        }
        Update: {
          achievements?: Json | null
          created_at?: string
          end_date?: string
          favorite_meals?: Json | null
          goals_progress?: Json | null
          id?: string
          least_favorite_meals?: Json | null
          mood_patterns?: Json | null
          new_foods_tried?: number | null
          nutrition_trends?: Json | null
          report_data?: Json | null
          report_type?: string
          start_date?: string
          total_meals?: number | null
          user_id?: string
        }
        Relationships: []
      }
      meal_templates: {
        Row: {
          brand: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          ingredients: string[] | null
          is_active: boolean | null
          name: string
          nutrition_info: Json | null
          preset_values: Json | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          ingredients?: string[] | null
          is_active?: boolean | null
          name: string
          nutrition_info?: Json | null
          preset_values?: Json | null
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          ingredients?: string[] | null
          is_active?: boolean | null
          name?: string
          nutrition_info?: Json | null
          preset_values?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          allergens: string[] | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          is_gluten_free: boolean | null
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          liteneasy_id: string | null
          name: string
          nutrition_info: Json | null
          prep_time_minutes: number | null
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          is_gluten_free?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          liteneasy_id?: string | null
          name: string
          nutrition_info?: Json | null
          prep_time_minutes?: number | null
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          is_gluten_free?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          liteneasy_id?: string | null
          name?: string
          nutrition_info?: Json | null
          prep_time_minutes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "meal_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          compliance_flags: Json | null
          created_at: string
          description: string | null
          document_url: string | null
          expiry_date: string | null
          id: string
          issued_by: string
          issued_date: string
          metadata: Json | null
          record_type: string
          title: string
          updated_at: string
          user_id: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          compliance_flags?: Json | null
          created_at?: string
          description?: string | null
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issued_by: string
          issued_date: string
          metadata?: Json | null
          record_type: string
          title: string
          updated_at?: string
          user_id: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          compliance_flags?: Json | null
          created_at?: string
          description?: string | null
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issued_by?: string
          issued_date?: string
          metadata?: Json | null
          record_type?: string
          title?: string
          updated_at?: string
          user_id?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      medications: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          typical_onset_hours: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          typical_onset_hours?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          typical_onset_hours?: number | null
        }
        Relationships: []
      }
      membership_tiers: {
        Row: {
          annual_fee: number | null
          benefits: Json | null
          created_at: string | null
          discipline_id: string | null
          id: string
          is_active: boolean | null
          level: string
          lifetime_fee: number | null
          name: string
          requirements: Json | null
          stripe_price_id: string | null
        }
        Insert: {
          annual_fee?: number | null
          benefits?: Json | null
          created_at?: string | null
          discipline_id?: string | null
          id?: string
          is_active?: boolean | null
          level: string
          lifetime_fee?: number | null
          name: string
          requirements?: Json | null
          stripe_price_id?: string | null
        }
        Update: {
          annual_fee?: number | null
          benefits?: Json | null
          created_at?: string | null
          discipline_id?: string | null
          id?: string
          is_active?: boolean | null
          level?: string
          lifetime_fee?: number | null
          name?: string
          requirements?: Json | null
          stripe_price_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_tiers_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string | null
          discipline_id: string | null
          expiry_date: string | null
          id: string
          joined_date: string | null
          payment_status: string | null
          status: string | null
          stripe_subscription_id: string | null
          tier_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          discipline_id?: string | null
          expiry_date?: string | null
          id?: string
          joined_date?: string | null
          payment_status?: string | null
          status?: string | null
          stripe_subscription_id?: string | null
          tier_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          discipline_id?: string | null
          expiry_date?: string | null
          id?: string
          joined_date?: string | null
          payment_status?: string | null
          status?: string | null
          stripe_subscription_id?: string | null
          tier_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memberships_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "membership_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_history: {
        Row: {
          action: string
          created_at: string | null
          id: string
          moderation_queue_id: string | null
          moderator_id: string | null
          new_status: string | null
          notes: string | null
          previous_status: string | null
          review_time_seconds: number | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          moderation_queue_id?: string | null
          moderator_id?: string | null
          new_status?: string | null
          notes?: string | null
          previous_status?: string | null
          review_time_seconds?: number | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          moderation_queue_id?: string | null
          moderator_id?: string | null
          new_status?: string | null
          notes?: string | null
          previous_status?: string | null
          review_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_history_moderation_queue_id_fkey"
            columns: ["moderation_queue_id"]
            isOneToOne: false
            referencedRelation: "agent_moderation_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          moderator_id: string | null
          new_status: string | null
          oopsie_id: string | null
          previous_status: string | null
          reason: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          moderator_id?: string | null
          new_status?: string | null
          oopsie_id?: string | null
          previous_status?: string | null
          reason?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          moderator_id?: string | null
          new_status?: string | null
          oopsie_id?: string | null
          previous_status?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_logs_oopsie_id_fkey"
            columns: ["oopsie_id"]
            isOneToOne: false
            referencedRelation: "oopsies"
            referencedColumns: ["id"]
          },
        ]
      }
      music_memories: {
        Row: {
          artist: string | null
          created_at: string
          id: string
          meal_entry_id: string | null
          memory_note: string | null
          mood_tag: string | null
          playlist_name: string | null
          song_title: string | null
          user_id: string
        }
        Insert: {
          artist?: string | null
          created_at?: string
          id?: string
          meal_entry_id?: string | null
          memory_note?: string | null
          mood_tag?: string | null
          playlist_name?: string | null
          song_title?: string | null
          user_id: string
        }
        Update: {
          artist?: string | null
          created_at?: string
          id?: string
          meal_entry_id?: string | null
          memory_note?: string | null
          mood_tag?: string | null
          playlist_name?: string | null
          song_title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      neurodivergent_faq_feedback: {
        Row: {
          created_at: string | null
          faq_id: string | null
          feedback_text: string | null
          id: string
          is_helpful: boolean
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          faq_id?: string | null
          feedback_text?: string | null
          id?: string
          is_helpful: boolean
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          faq_id?: string | null
          feedback_text?: string | null
          id?: string
          is_helpful?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "neurodivergent_faq_feedback_faq_id_fkey"
            columns: ["faq_id"]
            isOneToOne: false
            referencedRelation: "neurodivergent_faqs"
            referencedColumns: ["id"]
          },
        ]
      }
      neurodivergent_faqs: {
        Row: {
          answer: string
          author_id: string | null
          category: string
          created_at: string | null
          helpful_count: number | null
          id: string
          is_published: boolean | null
          question: string
          search_vector: unknown
          tags: string[] | null
          technical_level: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          answer: string
          author_id?: string | null
          category: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_published?: boolean | null
          question: string
          search_vector?: unknown
          tags?: string[] | null
          technical_level: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          answer?: string
          author_id?: string | null
          category?: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_published?: boolean | null
          question?: string
          search_vector?: unknown
          tags?: string[] | null
          technical_level?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      neurodivergent_media_downloads: {
        Row: {
          asset_name: string
          asset_type: string
          asset_url: string
          created_at: string
          downloaded_by: string | null
          id: string
          ip_address: unknown
          user_agent: string | null
        }
        Insert: {
          asset_name: string
          asset_type: string
          asset_url: string
          created_at?: string
          downloaded_by?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
        }
        Update: {
          asset_name?: string
          asset_type?: string
          asset_url?: string
          created_at?: string
          downloaded_by?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
        }
        Relationships: []
      }
      neurodivergent_resources: {
        Row: {
          audience: string[] | null
          created_at: string | null
          description: string
          download_count: number | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_featured: boolean | null
          population_tags: string[] | null
          resource_type: string
          search_vector: unknown
          title: string
          updated_at: string | null
        }
        Insert: {
          audience?: string[] | null
          created_at?: string | null
          description: string
          download_count?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_featured?: boolean | null
          population_tags?: string[] | null
          resource_type: string
          search_vector?: unknown
          title: string
          updated_at?: string | null
        }
        Update: {
          audience?: string[] | null
          created_at?: string | null
          description?: string
          download_count?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_featured?: boolean | null
          population_tags?: string[] | null
          resource_type?: string
          search_vector?: unknown
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      neurodivergent_search_history: {
        Row: {
          created_at: string | null
          filters: Json | null
          id: string
          result_count: number | null
          search_query: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          result_count?: number | null
          search_query: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          result_count?: number | null
          search_query?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          language: string | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          language?: string | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          language?: string | null
          subscribed_at?: string
        }
        Relationships: []
      }
      notification_queue: {
        Row: {
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          notification_type: string
          recipient_email: string | null
          recipient_type: string
          sent_at: string | null
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          notification_type: string
          recipient_email?: string | null
          recipient_type: string
          sent_at?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          notification_type?: string
          recipient_email?: string | null
          recipient_type?: string
          sent_at?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          category: string | null
          created_at: string
          from_user_id: string | null
          id: string
          message: string
          priority: string | null
          read: boolean
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          from_user_id?: string | null
          id?: string
          message: string
          priority?: string | null
          read?: boolean
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          from_user_id?: string | null
          id?: string
          message?: string
          priority?: string | null
          read?: boolean
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      offerings: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          group_id: string
          icon: string | null
          id: string
          is_active: boolean
          long_content: string | null
          slug: string
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          group_id: string
          icon?: string | null
          id?: string
          is_active?: boolean
          long_content?: string | null
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          group_id?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          long_content?: string | null
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offerings_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "vertical_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      omani_delegation: {
        Row: {
          business_plan_overview: Json | null
          contact_preferences: Json | null
          created_at: string
          delegation_year: number | null
          email: string | null
          follow_up_timeline: Json | null
          full_name: string
          id: string
          interests: string | null
          investment_opportunities: Json | null
          job_title: string | null
          meeting_schedule: Json | null
          organization: string | null
          phone: string | null
          sector: string | null
          strategic_information: Json | null
          updated_at: string
        }
        Insert: {
          business_plan_overview?: Json | null
          contact_preferences?: Json | null
          created_at?: string
          delegation_year?: number | null
          email?: string | null
          follow_up_timeline?: Json | null
          full_name: string
          id?: string
          interests?: string | null
          investment_opportunities?: Json | null
          job_title?: string | null
          meeting_schedule?: Json | null
          organization?: string | null
          phone?: string | null
          sector?: string | null
          strategic_information?: Json | null
          updated_at?: string
        }
        Update: {
          business_plan_overview?: Json | null
          contact_preferences?: Json | null
          created_at?: string
          delegation_year?: number | null
          email?: string | null
          follow_up_timeline?: Json | null
          full_name?: string
          id?: string
          interests?: string | null
          investment_opportunities?: Json | null
          job_title?: string | null
          meeting_schedule?: Json | null
          organization?: string | null
          phone?: string | null
          sector?: string | null
          strategic_information?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      oopsie_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes: number
          oopsie_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes?: number
          oopsie_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes?: number
          oopsie_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oopsie_comments_oopsie_id_fkey"
            columns: ["oopsie_id"]
            isOneToOne: false
            referencedRelation: "oopsies"
            referencedColumns: ["id"]
          },
        ]
      }
      oopsies: {
        Row: {
          auto_generated: boolean | null
          category: string
          comments: number
          confidence_score: number | null
          content_type: string | null
          created_at: string
          description: string
          discovery_date: string | null
          featured_score: number | null
          featured_until: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          likes: number
          metadata: Json | null
          moderation_notes: string | null
          processed_at: string | null
          review_status: string | null
          shares: number
          source_platform: string | null
          source_url: string | null
          status: string
          submission_karma: number | null
          submission_notes: string | null
          tags: string[] | null
          title: string
          trending_score: number | null
          updated_at: string
          user_id: string | null
          video_url: string | null
          view_count: number | null
          viral_score: number
        }
        Insert: {
          auto_generated?: boolean | null
          category: string
          comments?: number
          confidence_score?: number | null
          content_type?: string | null
          created_at?: string
          description: string
          discovery_date?: string | null
          featured_score?: number | null
          featured_until?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          likes?: number
          metadata?: Json | null
          moderation_notes?: string | null
          processed_at?: string | null
          review_status?: string | null
          shares?: number
          source_platform?: string | null
          source_url?: string | null
          status?: string
          submission_karma?: number | null
          submission_notes?: string | null
          tags?: string[] | null
          title: string
          trending_score?: number | null
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
          view_count?: number | null
          viral_score?: number
        }
        Update: {
          auto_generated?: boolean | null
          category?: string
          comments?: number
          confidence_score?: number | null
          content_type?: string | null
          created_at?: string
          description?: string
          discovery_date?: string | null
          featured_score?: number | null
          featured_until?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          likes?: number
          metadata?: Json | null
          moderation_notes?: string | null
          processed_at?: string | null
          review_status?: string | null
          shares?: number
          source_platform?: string | null
          source_url?: string | null
          status?: string
          submission_karma?: number | null
          submission_notes?: string | null
          tags?: string[] | null
          title?: string
          trending_score?: number | null
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
          view_count?: number | null
          viral_score?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          id: string
          is_bundle: boolean
          items: Json | null
          plan_id: string
          plan_name: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_email: string
          customer_name: string
          id?: string
          is_bundle?: boolean
          items?: Json | null
          plan_id: string
          plan_name: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string
          id?: string
          is_bundle?: boolean
          items?: Json | null
          plan_id?: string
          plan_name?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      partner_accounts: {
        Row: {
          application_id: string | null
          branding_config: Json | null
          commission_rate: number | null
          company_name: string
          contact_email: string
          created_at: string | null
          custom_domain: string | null
          id: string
          is_active: boolean | null
          partner_code: string
          total_orders: number | null
          total_revenue: number | null
          updated_at: string | null
          white_label_enabled: boolean | null
          wholesale_tier_id: string | null
        }
        Insert: {
          application_id?: string | null
          branding_config?: Json | null
          commission_rate?: number | null
          company_name: string
          contact_email: string
          created_at?: string | null
          custom_domain?: string | null
          id?: string
          is_active?: boolean | null
          partner_code: string
          total_orders?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          white_label_enabled?: boolean | null
          wholesale_tier_id?: string | null
        }
        Update: {
          application_id?: string | null
          branding_config?: Json | null
          commission_rate?: number | null
          company_name?: string
          contact_email?: string
          created_at?: string | null
          custom_domain?: string | null
          id?: string
          is_active?: boolean | null
          partner_code?: string
          total_orders?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          white_label_enabled?: boolean | null
          wholesale_tier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_accounts_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "partner_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_accounts_wholesale_tier_id_fkey"
            columns: ["wholesale_tier_id"]
            isOneToOne: false
            referencedRelation: "wholesale_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_api_logs: {
        Row: {
          created_at: string
          endpoint: string
          environment: string
          id: string
          ip_address: unknown
          method: string
          partner_org_id: string
          request_body: Json | null
          response_body: Json | null
          response_time_ms: number
          status_code: number
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          environment: string
          id?: string
          ip_address?: unknown
          method: string
          partner_org_id: string
          request_body?: Json | null
          response_body?: Json | null
          response_time_ms: number
          status_code: number
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          environment?: string
          id?: string
          ip_address?: unknown
          method?: string
          partner_org_id?: string
          request_body?: Json | null
          response_body?: Json | null
          response_time_ms?: number
          status_code?: number
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_api_logs_partner_org_id_fkey"
            columns: ["partner_org_id"]
            isOneToOne: false
            referencedRelation: "partner_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_applications: {
        Row: {
          additional_notes: string | null
          annual_revenue_range: string | null
          business_type: string
          company_name: string
          company_size: string | null
          contact_name: string
          created_at: string | null
          current_distribution_channels: string[] | null
          custom_branding_needs: string | null
          email: string
          expected_monthly_volume: number | null
          id: string
          integration_requirements: string | null
          lead_score: number | null
          marketing_budget_range: string | null
          phone: string | null
          preferred_commission_structure: string | null
          status: string | null
          target_market: string | null
          timeline: string | null
          updated_at: string | null
          website_url: string | null
          white_label_interest: boolean | null
          why_partner: string | null
        }
        Insert: {
          additional_notes?: string | null
          annual_revenue_range?: string | null
          business_type: string
          company_name: string
          company_size?: string | null
          contact_name: string
          created_at?: string | null
          current_distribution_channels?: string[] | null
          custom_branding_needs?: string | null
          email: string
          expected_monthly_volume?: number | null
          id?: string
          integration_requirements?: string | null
          lead_score?: number | null
          marketing_budget_range?: string | null
          phone?: string | null
          preferred_commission_structure?: string | null
          status?: string | null
          target_market?: string | null
          timeline?: string | null
          updated_at?: string | null
          website_url?: string | null
          white_label_interest?: boolean | null
          why_partner?: string | null
        }
        Update: {
          additional_notes?: string | null
          annual_revenue_range?: string | null
          business_type?: string
          company_name?: string
          company_size?: string | null
          contact_name?: string
          created_at?: string | null
          current_distribution_channels?: string[] | null
          custom_branding_needs?: string | null
          email?: string
          expected_monthly_volume?: number | null
          id?: string
          integration_requirements?: string | null
          lead_score?: number | null
          marketing_budget_range?: string | null
          phone?: string | null
          preferred_commission_structure?: string | null
          status?: string | null
          target_market?: string | null
          timeline?: string | null
          updated_at?: string | null
          website_url?: string | null
          white_label_interest?: boolean | null
          why_partner?: string | null
        }
        Relationships: []
      }
      partner_contacts: {
        Row: {
          contact_type: string
          created_at: string
          email: string
          id: string
          name: string
          partner_org_id: string
          phone: string | null
        }
        Insert: {
          contact_type: string
          created_at?: string
          email: string
          id?: string
          name: string
          partner_org_id: string
          phone?: string | null
        }
        Update: {
          contact_type?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          partner_org_id?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_contacts_partner_org_id_fkey"
            columns: ["partner_org_id"]
            isOneToOne: false
            referencedRelation: "partner_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          partner_org_id: string
          role: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by: string
          partner_org_id: string
          role: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          partner_org_id?: string
          role?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_invitations_partner_org_id_fkey"
            columns: ["partner_org_id"]
            isOneToOne: false
            referencedRelation: "partner_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_logos: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      partner_members: {
        Row: {
          contact_type: string | null
          id: string
          is_active: boolean | null
          joined_at: string
          partner_org_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          contact_type?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string
          partner_org_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          contact_type?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string
          partner_org_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_members_partner_org_id_fkey"
            columns: ["partner_org_id"]
            isOneToOne: false
            referencedRelation: "partner_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_onboarding_progress: {
        Row: {
          completed_steps: Json | null
          created_at: string
          current_step: number | null
          go_live_ready: boolean | null
          id: string
          organization_setup: boolean | null
          partner_org_id: string
          schema_mapping: boolean | null
          security_compliance: boolean | null
          technical_config: boolean | null
          testing_certification: boolean | null
          updated_at: string
        }
        Insert: {
          completed_steps?: Json | null
          created_at?: string
          current_step?: number | null
          go_live_ready?: boolean | null
          id?: string
          organization_setup?: boolean | null
          partner_org_id: string
          schema_mapping?: boolean | null
          security_compliance?: boolean | null
          technical_config?: boolean | null
          testing_certification?: boolean | null
          updated_at?: string
        }
        Update: {
          completed_steps?: Json | null
          created_at?: string
          current_step?: number | null
          go_live_ready?: boolean | null
          id?: string
          organization_setup?: boolean | null
          partner_org_id?: string
          schema_mapping?: boolean | null
          security_compliance?: boolean | null
          technical_config?: boolean | null
          testing_certification?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_onboarding_progress_partner_org_id_fkey"
            columns: ["partner_org_id"]
            isOneToOne: true
            referencedRelation: "partner_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_organizations: {
        Row: {
          abn: string | null
          branding_model: string | null
          company_name: string
          created_at: string
          data_residency: string | null
          data_retention_months: number | null
          id: string
          is_active: boolean | null
          sector: string | null
          updated_at: string
        }
        Insert: {
          abn?: string | null
          branding_model?: string | null
          company_name: string
          created_at?: string
          data_residency?: string | null
          data_retention_months?: number | null
          id?: string
          is_active?: boolean | null
          sector?: string | null
          updated_at?: string
        }
        Update: {
          abn?: string | null
          branding_model?: string | null
          company_name?: string
          created_at?: string
          data_residency?: string | null
          data_retention_months?: number | null
          id?: string
          is_active?: boolean | null
          sector?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      partner_schema_versions: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          notes: string | null
          partner_org_id: string
          schema_definition: Json
          version: number
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          partner_org_id: string
          schema_definition: Json
          version: number
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          partner_org_id?: string
          schema_definition?: Json
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "partner_schema_versions_partner_org_id_fkey"
            columns: ["partner_org_id"]
            isOneToOne: false
            referencedRelation: "partner_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_usage_metrics: {
        Row: {
          avg_response_time_ms: number | null
          created_at: string
          data_transfer_mb: number | null
          date: string
          failed_requests: number | null
          id: string
          partner_org_id: string
          successful_requests: number | null
          total_requests: number | null
          unique_users: number | null
        }
        Insert: {
          avg_response_time_ms?: number | null
          created_at?: string
          data_transfer_mb?: number | null
          date: string
          failed_requests?: number | null
          id?: string
          partner_org_id: string
          successful_requests?: number | null
          total_requests?: number | null
          unique_users?: number | null
        }
        Update: {
          avg_response_time_ms?: number | null
          created_at?: string
          data_transfer_mb?: number | null
          date?: string
          failed_requests?: number | null
          id?: string
          partner_org_id?: string
          successful_requests?: number | null
          total_requests?: number | null
          unique_users?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_usage_metrics_partner_org_id_fkey"
            columns: ["partner_org_id"]
            isOneToOne: false
            referencedRelation: "partner_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          brand_colors: Json | null
          category: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean
          is_featured: boolean | null
          is_hero: boolean
          logo_url: string | null
          name: string
          relationship_type: string | null
          revenue_share_percent: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          brand_colors?: Json | null
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          is_featured?: boolean | null
          is_hero?: boolean
          logo_url?: string | null
          name: string
          relationship_type?: string | null
          revenue_share_percent?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          brand_colors?: Json | null
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          is_featured?: boolean | null
          is_hero?: boolean
          logo_url?: string | null
          name?: string
          relationship_type?: string | null
          revenue_share_percent?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number
          parent_comment_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_items: {
        Row: {
          confidence_level: number | null
          created_at: string
          difficulty_rating: number | null
          id: string
          is_correct: boolean | null
          question_text: string | null
          session_id: string
          story_id: string | null
          time_spent_seconds: number | null
          user_response: string | null
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string
          difficulty_rating?: number | null
          id?: string
          is_correct?: boolean | null
          question_text?: string | null
          session_id: string
          story_id?: string | null
          time_spent_seconds?: number | null
          user_response?: string | null
        }
        Update: {
          confidence_level?: number | null
          created_at?: string
          difficulty_rating?: number | null
          id?: string
          is_correct?: boolean | null
          question_text?: string | null
          session_id?: string
          story_id?: string | null
          time_spent_seconds?: number | null
          user_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "practice_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_items_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "interview_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_sessions: {
        Row: {
          completed_at: string | null
          correct_items: number | null
          created_at: string
          duration_minutes: number | null
          id: string
          metadata: Json | null
          session_type: string
          started_at: string
          total_items: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          correct_items?: number | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          metadata?: Json | null
          session_type: string
          started_at?: string
          total_items?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          correct_items?: number | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          metadata?: Json | null
          session_type?: string
          started_at?: string
          total_items?: number | null
          user_id?: string
        }
        Relationships: []
      }
      predator_encounters: {
        Row: {
          animal_id: string
          created_at: string
          description: string
          encounter_date: string
          id: string
          image_url: string | null
          insurance_claim_filed: boolean
          latitude: number | null
          location: string
          longitude: number | null
          severity: string
          user_id: string | null
          verified: boolean
        }
        Insert: {
          animal_id: string
          created_at?: string
          description: string
          encounter_date: string
          id?: string
          image_url?: string | null
          insurance_claim_filed?: boolean
          latitude?: number | null
          location: string
          longitude?: number | null
          severity: string
          user_id?: string | null
          verified?: boolean
        }
        Update: {
          animal_id?: string
          created_at?: string
          description?: string
          encounter_date?: string
          id?: string
          image_url?: string | null
          insurance_claim_filed?: boolean
          latitude?: number | null
          location?: string
          longitude?: number | null
          severity?: string
          user_id?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "predator_encounters_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_access: {
        Row: {
          access_type: string
          created_at: string
          expires_at: string | null
          id: string
          session_id: string | null
          stripe_payment_intent_id: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          created_at?: string
          expires_at?: string | null
          id?: string
          session_id?: string | null
          stripe_payment_intent_id?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          session_id?: string | null
          stripe_payment_intent_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      prescription_imprints: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          image_data: string | null
          imprint_location: string | null
          imprinted_by_id: string
          imprinted_by_name: string
          imprinted_by_type: string
          prescription_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          image_data?: string | null
          imprint_location?: string | null
          imprinted_by_id: string
          imprinted_by_name: string
          imprinted_by_type: string
          prescription_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          image_data?: string | null
          imprint_location?: string | null
          imprinted_by_id?: string
          imprinted_by_name?: string
          imprinted_by_type?: string
          prescription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescription_imprints_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          doctor: string | null
          dosage: string
          id: string
          last_dispensed_at: string | null
          last_dispensed_by: string | null
          medication: string
          original_pharmacy: string | null
          patient_name: string
          prescriber_id: string
          qr_token: string
          script_id: string
          status: string
          total_repeats: number
          updated_at: string
          used_repeats: number
          valid_until: string
        }
        Insert: {
          created_at?: string
          doctor?: string | null
          dosage: string
          id?: string
          last_dispensed_at?: string | null
          last_dispensed_by?: string | null
          medication: string
          original_pharmacy?: string | null
          patient_name: string
          prescriber_id: string
          qr_token: string
          script_id: string
          status?: string
          total_repeats?: number
          updated_at?: string
          used_repeats?: number
          valid_until: string
        }
        Update: {
          created_at?: string
          doctor?: string | null
          dosage?: string
          id?: string
          last_dispensed_at?: string | null
          last_dispensed_by?: string | null
          medication?: string
          original_pharmacy?: string | null
          patient_name?: string
          prescriber_id?: string
          qr_token?: string
          script_id?: string
          status?: string
          total_repeats?: number
          updated_at?: string
          used_repeats?: number
          valid_until?: string
        }
        Relationships: []
      }
      pricing_plans: {
        Row: {
          billing_interval: string
          created_at: string
          currency: string
          features: Json
          id: string
          is_active: boolean
          name: string
          offering_id: string
          plan_type: string
          price_cents: number
          updated_at: string
        }
        Insert: {
          billing_interval?: string
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          is_active?: boolean
          name: string
          offering_id: string
          plan_type?: string
          price_cents?: number
          updated_at?: string
        }
        Update: {
          billing_interval?: string
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          is_active?: boolean
          name?: string
          offering_id?: string
          plan_type?: string
          price_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_plans_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      printify_orders: {
        Row: {
          created_at: string | null
          estimated_delivery_date: string | null
          id: string
          order_id: string | null
          printify_order_id: string | null
          printify_status: string | null
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estimated_delivery_date?: string | null
          id?: string
          order_id?: string | null
          printify_order_id?: string | null
          printify_status?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estimated_delivery_date?: string | null
          id?: string
          order_id?: string | null
          printify_order_id?: string | null
          printify_status?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "printify_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      printify_settings: {
        Row: {
          api_token_configured: boolean | null
          created_at: string | null
          id: string
          last_sync_at: string | null
          sync_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          api_token_configured?: boolean | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          sync_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          api_token_configured?: boolean | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          sync_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_searches: {
        Row: {
          created_at: string | null
          girlmath_logic: string | null
          id: string
          products_found: Json | null
          search_query: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          girlmath_logic?: string | null
          id?: string
          products_found?: Json | null
          search_query: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          girlmath_logic?: string | null
          id?: string
          products_found?: Json | null
          search_query?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          coming_soon: boolean | null
          created_at: string | null
          danger_level: number | null
          description: string | null
          facts: string[] | null
          featured: boolean | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_printify_product: boolean | null
          locations: string[] | null
          mockup_images: Json | null
          name: string
          price: number
          print_on_demand: boolean | null
          printify_data: Json | null
          printify_product_id: string | null
          printify_variant_id: string | null
          rarity: string | null
          stripe_price_id: string | null
          updated_at: string | null
          variants: Json | null
        }
        Insert: {
          category: string
          coming_soon?: boolean | null
          created_at?: string | null
          danger_level?: number | null
          description?: string | null
          facts?: string[] | null
          featured?: boolean | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_printify_product?: boolean | null
          locations?: string[] | null
          mockup_images?: Json | null
          name: string
          price: number
          print_on_demand?: boolean | null
          printify_data?: Json | null
          printify_product_id?: string | null
          printify_variant_id?: string | null
          rarity?: string | null
          stripe_price_id?: string | null
          updated_at?: string | null
          variants?: Json | null
        }
        Update: {
          category?: string
          coming_soon?: boolean | null
          created_at?: string | null
          danger_level?: number | null
          description?: string | null
          facts?: string[] | null
          featured?: boolean | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_printify_product?: boolean | null
          locations?: string[] | null
          mockup_images?: Json | null
          name?: string
          price?: number
          print_on_demand?: boolean | null
          printify_data?: Json | null
          printify_product_id?: string | null
          printify_variant_id?: string | null
          rarity?: string | null
          stripe_price_id?: string | null
          updated_at?: string | null
          variants?: Json | null
        }
        Relationships: []
      }
      professional_credentials: {
        Row: {
          compliance_requirements: Json | null
          created_at: string
          credential_number: string | null
          credential_type: string
          document_url: string | null
          expiry_date: string | null
          id: string
          issued_date: string
          issuing_authority: string
          metadata: Json | null
          renewal_reminder_sent: boolean | null
          renewal_required: boolean | null
          title: string
          updated_at: string
          user_id: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          compliance_requirements?: Json | null
          created_at?: string
          credential_number?: string | null
          credential_type: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issued_date: string
          issuing_authority: string
          metadata?: Json | null
          renewal_reminder_sent?: boolean | null
          renewal_required?: boolean | null
          title: string
          updated_at?: string
          user_id: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          compliance_requirements?: Json | null
          created_at?: string
          credential_number?: string | null
          credential_type?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issued_date?: string
          issuing_authority?: string
          metadata?: Json | null
          renewal_reminder_sent?: boolean | null
          renewal_required?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean
          privacy_preferences: Json | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean
          privacy_preferences?: Json | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean
          privacy_preferences?: Json | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          age_group: string
          capacity: number | null
          contact_email: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          location: string | null
          program_end: string
          program_start: string
          registration_end: string
          registration_fee: number
          registration_start: string
          requirements: Json | null
          schedule_info: string | null
          season_type: string
          season_year: string
          sport_name: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          age_group: string
          capacity?: number | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          location?: string | null
          program_end: string
          program_start: string
          registration_end: string
          registration_fee?: number
          registration_start: string
          requirements?: Json | null
          schedule_info?: string | null
          season_type?: string
          season_year: string
          sport_name: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          age_group?: string
          capacity?: number | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          location?: string | null
          program_end?: string
          program_start?: string
          registration_end?: string
          registration_fee?: number
          registration_start?: string
          requirements?: Json | null
          schedule_info?: string | null
          season_type?: string
          season_year?: string
          sport_name?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      project_folders: {
        Row: {
          description: string | null
          id: string
          name: string
          path: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          path: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          path?: string
        }
        Relationships: []
      }
      public_figures: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          organization: string
          title: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          organization: string
          title: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          organization?: string
          title?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      question_pools: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          id: string
          is_active: boolean
          question_text: string
          theme: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          is_active?: boolean
          question_text: string
          theme: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          is_active?: boolean
          question_text?: string
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      rate_limit_violations: {
        Row: {
          blocked_until: string | null
          created_at: string | null
          endpoint: string
          first_violation_at: string | null
          id: string
          ip_address: unknown
          is_blocked: boolean | null
          last_violation_at: string | null
          user_id: string | null
          violation_count: number | null
        }
        Insert: {
          blocked_until?: string | null
          created_at?: string | null
          endpoint: string
          first_violation_at?: string | null
          id?: string
          ip_address: unknown
          is_blocked?: boolean | null
          last_violation_at?: string | null
          user_id?: string | null
          violation_count?: number | null
        }
        Update: {
          blocked_until?: string | null
          created_at?: string | null
          endpoint?: string
          first_violation_at?: string | null
          id?: string
          ip_address?: unknown
          is_blocked?: boolean | null
          last_violation_at?: string | null
          user_id?: string | null
          violation_count?: number | null
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          user_id: string
          uses_count: number
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          user_id: string
          uses_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          user_id?: string
          uses_count?: number
        }
        Relationships: []
      }
      referral_tracking: {
        Row: {
          clicked_at: string
          created_at: string
          destination_url: string
          id: string
          ip_address: unknown
          partner_id: string
          referrer_url: string | null
          user_agent: string | null
          user_token: string
        }
        Insert: {
          clicked_at?: string
          created_at?: string
          destination_url: string
          id?: string
          ip_address?: unknown
          partner_id: string
          referrer_url?: string | null
          user_agent?: string | null
          user_token: string
        }
        Update: {
          clicked_at?: string
          created_at?: string
          destination_url?: string
          id?: string
          ip_address?: unknown
          partner_id?: string
          referrer_url?: string | null
          user_agent?: string | null
          user_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_tracking_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          created_at: string
          emergency_contact_name: string
          emergency_contact_phone: string
          id: string
          medical_notes: string | null
          participant_age: number | null
          participant_dob: string | null
          participant_name: string
          payment_status: string
          program_id: string
          registration_date: string
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emergency_contact_name: string
          emergency_contact_phone: string
          id?: string
          medical_notes?: string | null
          participant_age?: number | null
          participant_dob?: string | null
          participant_name: string
          payment_status?: string
          program_id: string
          registration_date?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          id?: string
          medical_notes?: string | null
          participant_age?: number | null
          participant_dob?: string | null
          participant_name?: string
          payment_status?: string
          program_id?: string
          registration_date?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_invitations: {
        Row: {
          created_at: string
          expires_at: string
          family_group_id: string
          id: string
          invited_by: string
          invited_email: string
          invited_role: string
          status: string
          token: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          family_group_id: string
          id?: string
          invited_by: string
          invited_email: string
          invited_role: string
          status?: string
          token: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          family_group_id?: string
          id?: string
          invited_by?: string
          invited_email?: string
          invited_role?: string
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationship_invitations_family_group_id_fkey"
            columns: ["family_group_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          category: string
          content: string
          created_at: string | null
          folder_path: string
          id: string
          owner: string | null
          priority: string | null
          run_date: string
          status: string | null
          tags: string[] | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          folder_path: string
          id?: string
          owner?: string | null
          priority?: string | null
          run_date?: string
          status?: string | null
          tags?: string[] | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          folder_path?: string
          id?: string
          owner?: string | null
          priority?: string | null
          run_date?: string
          status?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      "Reports Archive.csv": {
        Row: {
          category: string | null
          content: string | null
          folder_path: string | null
          priority: string | null
          run_date: string | null
          status: string | null
          tags: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          folder_path?: string | null
          priority?: string | null
          run_date?: string | null
          status?: string | null
          tags?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          folder_path?: string | null
          priority?: string | null
          run_date?: string | null
          status?: string | null
          tags?: string | null
        }
        Relationships: []
      }
      reports_outbox: {
        Row: {
          created_at: string
          id: string
          payload: Json
          report_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload: Json
          report_type: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          report_type?: string
        }
        Relationships: []
      }
      research_reports: {
        Row: {
          created_at: string | null
          executive_summary: Json | null
          id: string
          is_published: boolean | null
          narrative_sections: Json | null
          publication_date: string | null
          report_type: string
          research_period_end: string
          research_period_start: string
          snapshot_data: Json
          subtitle: string | null
          tier_requirement: string | null
          title: string
          topic_slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          executive_summary?: Json | null
          id?: string
          is_published?: boolean | null
          narrative_sections?: Json | null
          publication_date?: string | null
          report_type?: string
          research_period_end: string
          research_period_start: string
          snapshot_data: Json
          subtitle?: string | null
          tier_requirement?: string | null
          title: string
          topic_slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          executive_summary?: Json | null
          id?: string
          is_published?: boolean | null
          narrative_sections?: Json | null
          publication_date?: string | null
          report_type?: string
          research_period_end?: string
          research_period_start?: string
          snapshot_data?: Json
          subtitle?: string | null
          tier_requirement?: string | null
          title?: string
          topic_slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      review_votes: {
        Row: {
          created_at: string
          id: string
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_helpful?: boolean
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "agent_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      scaffold_analytics: {
        Row: {
          avg_clarity: number | null
          avg_control: number | null
          avg_fatigue: number | null
          chatgpt_handoffs: number | null
          copilot_handoffs: number | null
          created_at: string | null
          date: string | null
          id: string
          plans_created: number | null
          scaffold_handoffs: number | null
          steps_completed: number | null
          study_key: string
          total_focus_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          avg_clarity?: number | null
          avg_control?: number | null
          avg_fatigue?: number | null
          chatgpt_handoffs?: number | null
          copilot_handoffs?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          plans_created?: number | null
          scaffold_handoffs?: number | null
          steps_completed?: number | null
          study_key: string
          total_focus_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_clarity?: number | null
          avg_control?: number | null
          avg_fatigue?: number | null
          chatgpt_handoffs?: number | null
          copilot_handoffs?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          plans_created?: number | null
          scaffold_handoffs?: number | null
          steps_completed?: number | null
          study_key?: string
          total_focus_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scaffold_plans: {
        Row: {
          completed_steps: number | null
          created_at: string | null
          goal: string
          id: string
          status: string | null
          steps: Json
          study_key: string | null
          title: string
          total_steps: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_steps?: number | null
          created_at?: string | null
          goal: string
          id?: string
          status?: string | null
          steps?: Json
          study_key?: string | null
          title: string
          total_steps: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_steps?: number | null
          created_at?: string | null
          goal?: string
          id?: string
          status?: string | null
          steps?: Json
          study_key?: string | null
          title?: string
          total_steps?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      scaffold_reflections: {
        Row: {
          clarity_score: number
          control_score: number
          created_at: string | null
          fatigue_score: number
          id: string
          notes: string | null
          plan_id: string
          session_id: string | null
        }
        Insert: {
          clarity_score: number
          control_score: number
          created_at?: string | null
          fatigue_score: number
          id?: string
          notes?: string | null
          plan_id: string
          session_id?: string | null
        }
        Update: {
          clarity_score?: number
          control_score?: number
          created_at?: string | null
          fatigue_score?: number
          id?: string
          notes?: string | null
          plan_id?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scaffold_reflections_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "scaffold_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scaffold_reflections_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "scaffold_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      scaffold_sessions: {
        Row: {
          ai_tool_used: string | null
          duration_seconds: number | null
          ended_at: string | null
          handoff_context: Json | null
          id: string
          metadata: Json | null
          plan_id: string
          session_type: string
          started_at: string | null
        }
        Insert: {
          ai_tool_used?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          handoff_context?: Json | null
          id?: string
          metadata?: Json | null
          plan_id: string
          session_type: string
          started_at?: string | null
        }
        Update: {
          ai_tool_used?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          handoff_context?: Json | null
          id?: string
          metadata?: Json | null
          plan_id?: string
          session_type?: string
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scaffold_sessions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "scaffold_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_tasks: {
        Row: {
          created_at: string | null
          id: string
          is_running: boolean | null
          last_run: string | null
          next_run: string | null
          task_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_running?: boolean | null
          last_run?: string | null
          next_run?: string | null
          task_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_running?: boolean | null
          last_run?: string | null
          next_run?: string | null
          task_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      school_events: {
        Row: {
          created_at: string
          description: string | null
          end_time: string | null
          event_date: string
          event_name: string
          event_type: string
          id: string
          is_completed: boolean | null
          location: string | null
          priority: string | null
          reminder_set: boolean | null
          start_time: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_date: string
          event_name: string
          event_type: string
          id?: string
          is_completed?: boolean | null
          location?: string | null
          priority?: string | null
          reminder_set?: boolean | null
          start_time?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_date?: string
          event_name?: string
          event_type?: string
          id?: string
          is_completed?: boolean | null
          location?: string | null
          priority?: string | null
          reminder_set?: boolean | null
          start_time?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      "seed/file_library_seed.csv": {
        Row: {
          category: string | null
          created_date: string | null
          file_ext: string | null
          file_name: string | null
          id: string | null
          notes: string | null
          source_url: string | null
          tags: string | null
          theme_title: string | null
        }
        Insert: {
          category?: string | null
          created_date?: string | null
          file_ext?: string | null
          file_name?: string | null
          id?: string | null
          notes?: string | null
          source_url?: string | null
          tags?: string | null
          theme_title?: string | null
        }
        Update: {
          category?: string | null
          created_date?: string | null
          file_ext?: string | null
          file_name?: string | null
          id?: string | null
          notes?: string | null
          source_url?: string | null
          tags?: string | null
          theme_title?: string | null
        }
        Relationships: []
      }
      shared_assets: {
        Row: {
          asset_category: string
          asset_key: string
          asset_name: string
          asset_url: string
          created_at: string
          id: string
          is_active: boolean
          is_global: boolean
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          asset_category?: string
          asset_key: string
          asset_name: string
          asset_url: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_global?: boolean
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          asset_category?: string
          asset_key?: string
          asset_name?: string
          asset_url?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_global?: boolean
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_assets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      site_audits: {
        Row: {
          accessibility_score: number | null
          audit_type: string
          average_load_time: number | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          domain: string
          id: string
          performance_score: number | null
          results: Json | null
          seo_score: number | null
          status: string
          summary: Json | null
          total_errors: number | null
          total_pages: number | null
          url: string
        }
        Insert: {
          accessibility_score?: number | null
          audit_type?: string
          average_load_time?: number | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          domain: string
          id?: string
          performance_score?: number | null
          results?: Json | null
          seo_score?: number | null
          status?: string
          summary?: Json | null
          total_errors?: number | null
          total_pages?: number | null
          url: string
        }
        Update: {
          accessibility_score?: number | null
          audit_type?: string
          average_load_time?: number | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          domain?: string
          id?: string
          performance_score?: number | null
          results?: Json | null
          seo_score?: number | null
          status?: string
          summary?: Json | null
          total_errors?: number | null
          total_pages?: number | null
          url?: string
        }
        Relationships: []
      }
      site_config: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      slack_delivery_log: {
        Row: {
          alerted: boolean | null
          channel_id: string | null
          content: string | null
          created: string
          error_msg: string | null
          msg_ts: string | null
          outbox_id: string
          permalink: string | null
          request_id: number | null
          status_code: number | null
        }
        Insert: {
          alerted?: boolean | null
          channel_id?: string | null
          content?: string | null
          created?: string
          error_msg?: string | null
          msg_ts?: string | null
          outbox_id: string
          permalink?: string | null
          request_id?: number | null
          status_code?: number | null
        }
        Update: {
          alerted?: boolean | null
          channel_id?: string | null
          content?: string | null
          created?: string
          error_msg?: string | null
          msg_ts?: string | null
          outbox_id?: string
          permalink?: string | null
          request_id?: number | null
          status_code?: number | null
        }
        Relationships: []
      }
      slack_report_log: {
        Row: {
          created_at: string | null
          id: number
          payload: string
          report_name: string
          report_type: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          payload: string
          report_name: string
          report_type?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          payload?: string
          report_name?: string
          report_type?: string | null
          status?: string | null
        }
        Relationships: []
      }
      sms_logs: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          delivery_status: string | null
          error_message: string | null
          health_document_id: string | null
          id: string
          message_content: string
          phone_number: string
          sent_at: string | null
          twilio_sid: string | null
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          delivery_status?: string | null
          error_message?: string | null
          health_document_id?: string | null
          id?: string
          message_content: string
          phone_number: string
          sent_at?: string | null
          twilio_sid?: string | null
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          delivery_status?: string | null
          error_message?: string | null
          health_document_id?: string | null
          id?: string
          message_content?: string
          phone_number?: string
          sent_at?: string | null
          twilio_sid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_logs_health_document_id_fkey"
            columns: ["health_document_id"]
            isOneToOne: false
            referencedRelation: "health_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_notifications: {
        Row: {
          created_at: string
          guardian_email: string
          id: string
          message_content: string
          message_type: string
          metadata: Json | null
          scheduled_for: string
          sent_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          guardian_email: string
          id?: string
          message_content: string
          message_type: string
          metadata?: Json | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          guardian_email?: string
          id?: string
          message_content?: string
          message_type?: string
          metadata?: Json | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      societies: {
        Row: {
          bylaws: string | null
          created_at: string | null
          discipline_id: string | null
          founded_date: string | null
          governance_structure: Json | null
          id: string
          is_active: boolean | null
          leadership: Json | null
          mission: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          bylaws?: string | null
          created_at?: string | null
          discipline_id?: string | null
          founded_date?: string | null
          governance_structure?: Json | null
          id?: string
          is_active?: boolean | null
          leadership?: Json | null
          mission?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          bylaws?: string | null
          created_at?: string | null
          discipline_id?: string | null
          founded_date?: string | null
          governance_structure?: Json | null
          id?: string
          is_active?: boolean | null
          leadership?: Json | null
          mission?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "societies_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
        ]
      }
      spotto_likes: {
        Row: {
          created_at: string
          id: string
          spotto_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          spotto_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          spotto_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spotto_likes_spotto_id_fkey"
            columns: ["spotto_id"]
            isOneToOne: false
            referencedRelation: "spottos"
            referencedColumns: ["id"]
          },
        ]
      }
      spottos: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          latitude: number | null
          likes_count: number | null
          location_name: string | null
          longitude: number | null
          shares_count: number | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
          views_count: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          likes_count?: number | null
          location_name?: string | null
          longitude?: number | null
          shares_count?: number | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
          views_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          likes_count?: number | null
          location_name?: string | null
          longitude?: number | null
          shares_count?: number | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      stock_video_favorites: {
        Row: {
          created_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: []
      }
      stock_video_library: {
        Row: {
          category: string
          channel_title: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          import_metadata: Json | null
          import_source: string | null
          is_active: boolean | null
          license: string
          notes: string | null
          published_at: string | null
          quality: string | null
          source: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          url: string
          video_id: string | null
          view_count: number | null
        }
        Insert: {
          category: string
          channel_title?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          import_metadata?: Json | null
          import_source?: string | null
          is_active?: boolean | null
          license: string
          notes?: string | null
          published_at?: string | null
          quality?: string | null
          source: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          url: string
          video_id?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string
          channel_title?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          import_metadata?: Json | null
          import_source?: string | null
          is_active?: boolean | null
          license?: string
          notes?: string | null
          published_at?: string | null
          quality?: string | null
          source?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          url?: string
          video_id?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      story_group_items: {
        Row: {
          added_at: string
          group_id: string
          id: string
          story_id: string
        }
        Insert: {
          added_at?: string
          group_id: string
          id?: string
          story_id: string
        }
        Update: {
          added_at?: string
          group_id?: string
          id?: string
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_group_items_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "story_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_group_items_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "interview_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_groups: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      story_suggestion_applications: {
        Row: {
          applied_at: string
          applied_by: string | null
          id: string
          new_content: string | null
          previous_content: string | null
          quality_impact: number | null
          suggestion_id: string
        }
        Insert: {
          applied_at?: string
          applied_by?: string | null
          id?: string
          new_content?: string | null
          previous_content?: string | null
          quality_impact?: number | null
          suggestion_id: string
        }
        Update: {
          applied_at?: string
          applied_by?: string | null
          id?: string
          new_content?: string | null
          previous_content?: string | null
          quality_impact?: number | null
          suggestion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_suggestion_applications_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "story_suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      story_suggestions: {
        Row: {
          confidence: number | null
          created_at: string
          expected_improvement: number | null
          id: string
          impact_level: string
          original_content: string | null
          section: string
          status: string
          story_id: string
          suggested_content: string | null
          suggestion_text: string
          suggestion_type: string
          updated_at: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          expected_improvement?: number | null
          id?: string
          impact_level?: string
          original_content?: string | null
          section: string
          status?: string
          story_id: string
          suggested_content?: string | null
          suggestion_text: string
          suggestion_type: string
          updated_at?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          expected_improvement?: number | null
          id?: string
          impact_level?: string
          original_content?: string | null
          section?: string
          status?: string
          story_id?: string
          suggested_content?: string | null
          suggestion_text?: string
          suggestion_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_suggestions_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "interview_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_tags: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          story_id: string
          tag: string
          tag_type: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          story_id: string
          tag: string
          tag_type?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          story_id?: string
          tag?: string
          tag_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_tags_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "interview_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          agent_limit: number | null
          created_at: string
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          plan_type: Database["public"]["Enums"]["subscription_plan"]
          price_monthly: number | null
          price_yearly: number | null
          updated_at: string
        }
        Insert: {
          agent_limit?: number | null
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          plan_type: Database["public"]["Enums"]["subscription_plan"]
          price_monthly?: number | null
          price_yearly?: number | null
          updated_at?: string
        }
        Update: {
          agent_limit?: number | null
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          plan_type?: Database["public"]["Enums"]["subscription_plan"]
          price_monthly?: number | null
          price_yearly?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      task_logs: {
        Row: {
          action: string
          id: string
          logged_at: string | null
          new_value: string | null
          old_value: string | null
          task_id: string | null
        }
        Insert: {
          action: string
          id?: string
          logged_at?: string | null
          new_value?: string | null
          old_value?: string | null
          task_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          logged_at?: string | null
          new_value?: string | null
          old_value?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "agent_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string
          id: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tenants: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          settings: Json
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          settings?: Json
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          settings?: Json
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          context: string | null
          created_at: string
          display_order: number | null
          id: string
          is_featured: boolean
          public_figure_id: string | null
          quote: string
          updated_at: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_featured?: boolean
          public_figure_id?: string | null
          quote: string
          updated_at?: string
        }
        Update: {
          context?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_featured?: boolean
          public_figure_id?: string | null
          quote?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_public_figure_id_fkey"
            columns: ["public_figure_id"]
            isOneToOne: false
            referencedRelation: "public_figures"
            referencedColumns: ["id"]
          },
        ]
      }
      tfh_activity: {
        Row: {
          id: string
          occurred_at: string | null
          source: string | null
          text: string
        }
        Insert: {
          id?: string
          occurred_at?: string | null
          source?: string | null
          text: string
        }
        Update: {
          id?: string
          occurred_at?: string | null
          source?: string | null
          text?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          external_provider: string | null
          external_reference: string | null
          id: string
          metadata: Json
          offering_id: string | null
          plan_id: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          external_provider?: string | null
          external_reference?: string | null
          id?: string
          metadata?: Json
          offering_id?: string | null
          plan_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          external_provider?: string | null
          external_reference?: string | null
          id?: string
          metadata?: Json
          offering_id?: string | null
          plan_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "pricing_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      trilogy_subcomponents: {
        Row: {
          book: string
          chapter: string
          id: string
          last_updated: string | null
          priority: string | null
          status: number | null
          subcomponent: string
        }
        Insert: {
          book: string
          chapter: string
          id?: string
          last_updated?: string | null
          priority?: string | null
          status?: number | null
          subcomponent: string
        }
        Update: {
          book?: string
          chapter?: string
          id?: string
          last_updated?: string | null
          priority?: string | null
          status?: number | null
          subcomponent?: string
        }
        Relationships: []
      }
      trilogy_tracker: {
        Row: {
          book: string
          chapter: string
          content_source: string | null
          expansion_notes: string | null
          gdrive_link: string | null
          id: string
          last_updated: string | null
          local_path: string | null
          priority: string | null
          ready_flag: boolean | null
          status: number | null
          wordcount_est: number | null
        }
        Insert: {
          book: string
          chapter: string
          content_source?: string | null
          expansion_notes?: string | null
          gdrive_link?: string | null
          id?: string
          last_updated?: string | null
          local_path?: string | null
          priority?: string | null
          ready_flag?: boolean | null
          status?: number | null
          wordcount_est?: number | null
        }
        Update: {
          book?: string
          chapter?: string
          content_source?: string | null
          expansion_notes?: string | null
          gdrive_link?: string | null
          id?: string
          last_updated?: string | null
          local_path?: string | null
          priority?: string | null
          ready_flag?: boolean | null
          status?: number | null
          wordcount_est?: number | null
        }
        Relationships: []
      }
      unified_audit_log: {
        Row: {
          action: string
          endpoint: string | null
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          request_id: string | null
          search_vector: unknown
          severity: string | null
          table_name: string | null
          timestamp: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
          user_role: Database["public"]["Enums"]["app_role"] | null
        }
        Insert: {
          action: string
          endpoint?: string | null
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          request_id?: string | null
          search_vector?: unknown
          severity?: string | null
          table_name?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Update: {
          action?: string
          endpoint?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          request_id?: string | null
          search_vector?: unknown
          severity?: string | null
          table_name?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: []
      }
      unified_audit_log_archive: {
        Row: {
          action: string
          endpoint: string | null
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          request_id: string | null
          search_vector: unknown
          severity: string | null
          table_name: string | null
          timestamp: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
          user_role: Database["public"]["Enums"]["app_role"] | null
        }
        Insert: {
          action: string
          endpoint?: string | null
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          request_id?: string | null
          search_vector?: unknown
          severity?: string | null
          table_name?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Update: {
          action?: string
          endpoint?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          request_id?: string | null
          search_vector?: unknown
          severity?: string | null
          table_name?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: []
      }
      usage_tracking: {
        Row: {
          agent_downloads: number | null
          created_at: string
          hours_saved: number | null
          id: string
          last_activity: string | null
          monthly_downloads: number | null
          reset_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_downloads?: number | null
          created_at?: string
          hours_saved?: number | null
          id?: string
          last_activity?: string | null
          monthly_downloads?: number | null
          reset_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_downloads?: number | null
          created_at?: string
          hours_saved?: number | null
          id?: string
          last_activity?: string | null
          monthly_downloads?: number | null
          reset_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          created_at: string | null
          description: string | null
          id: string
          points: number | null
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          points?: number | null
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          points?: number | null
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          average_confidence: number | null
          created_at: string
          id: string
          last_practice_at: string | null
          readiness_score: number | null
          strong_themes: Json | null
          total_practice_time_minutes: number | null
          total_sessions: number | null
          updated_at: string
          user_id: string
          weak_themes: Json | null
        }
        Insert: {
          average_confidence?: number | null
          created_at?: string
          id?: string
          last_practice_at?: string | null
          readiness_score?: number | null
          strong_themes?: Json | null
          total_practice_time_minutes?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id: string
          weak_themes?: Json | null
        }
        Update: {
          average_confidence?: number | null
          created_at?: string
          id?: string
          last_practice_at?: string | null
          readiness_score?: number | null
          strong_themes?: Json | null
          total_practice_time_minutes?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
          weak_themes?: Json | null
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          created_at: string
          id: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "interview_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_certificates: {
        Row: {
          certificate_data: Json
          certificate_name: string
          certificate_type: string
          created_at: string
          download_count: number | null
          id: string
          last_downloaded_at: string | null
          order_id: string | null
          user_id: string | null
        }
        Insert: {
          certificate_data: Json
          certificate_name: string
          certificate_type: string
          created_at?: string
          download_count?: number | null
          id?: string
          last_downloaded_at?: string | null
          order_id?: string | null
          user_id?: string | null
        }
        Update: {
          certificate_data?: Json
          certificate_name?: string
          certificate_type?: string
          created_at?: string
          download_count?: number | null
          id?: string
          last_downloaded_at?: string | null
          order_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_certificates_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_participations: {
        Row: {
          challenge_id: string | null
          completed: boolean | null
          completion_date: string | null
          created_at: string | null
          id: string
          score: number | null
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          score?: number | null
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_participations_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "community_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string
          completed_at: string | null
          completed_prompts: string[]
          completion_percentage: number
          id: string
          started_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          completed_prompts?: string[]
          completion_percentage?: number
          id?: string
          started_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          completed_prompts?: string[]
          completion_percentage?: number
          id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_compliance_status: {
        Row: {
          completion_date: string | null
          created_at: string
          expiry_date: string | null
          id: string
          notes: string | null
          requirement_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          notes?: string | null
          requirement_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          notes?: string | null
          requirement_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_compliance_status_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "compliance_requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consent_creations: {
        Row: {
          created_at: string
          creator_id: string
          earnings_total: number
          id: string
          is_public: boolean
          template_id: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          creator_id: string
          earnings_total?: number
          id?: string
          is_public?: boolean
          template_id: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          creator_id?: string
          earnings_total?: number
          id?: string
          is_public?: boolean
          template_id?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_consent_creations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "consent_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consents: {
        Row: {
          child_id: string | null
          created_at: string
          custom_conditions: Json | null
          expires_at: string | null
          family_group_id: string | null
          granted_at: string | null
          granted_by: string | null
          guardian_id: string | null
          id: string
          status: string
          template_id: string
          updated_at: string
          withdrawal_reason: string | null
        }
        Insert: {
          child_id?: string | null
          created_at?: string
          custom_conditions?: Json | null
          expires_at?: string | null
          family_group_id?: string | null
          granted_at?: string | null
          granted_by?: string | null
          guardian_id?: string | null
          id?: string
          status?: string
          template_id: string
          updated_at?: string
          withdrawal_reason?: string | null
        }
        Update: {
          child_id?: string | null
          created_at?: string
          custom_conditions?: Json | null
          expires_at?: string | null
          family_group_id?: string | null
          granted_at?: string | null
          granted_by?: string | null
          guardian_id?: string | null
          id?: string
          status?: string
          template_id?: string
          updated_at?: string
          withdrawal_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_consents_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_consents_family_group_id_fkey"
            columns: ["family_group_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_consents_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_consents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "consent_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_email_preferences: {
        Row: {
          created_at: string
          daily_notifications: boolean
          id: string
          last_email_sent: string | null
          updated_at: string
          user_id: string
          weekly_recap: boolean
          welcome_email_sent: boolean
        }
        Insert: {
          created_at?: string
          daily_notifications?: boolean
          id?: string
          last_email_sent?: string | null
          updated_at?: string
          user_id: string
          weekly_recap?: boolean
          welcome_email_sent?: boolean
        }
        Update: {
          created_at?: string
          daily_notifications?: boolean
          id?: string
          last_email_sent?: string | null
          updated_at?: string
          user_id?: string
          weekly_recap?: boolean
          welcome_email_sent?: boolean
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          celebration_message: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          current_progress: number | null
          description: string | null
          goal_type: string
          id: string
          is_shared: boolean | null
          metadata: Json | null
          status: string
          target_date: string | null
          target_value: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          celebration_message?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          current_progress?: number | null
          description?: string | null
          goal_type: string
          id?: string
          is_shared?: boolean | null
          metadata?: Json | null
          status?: string
          target_date?: string | null
          target_value?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          celebration_message?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          current_progress?: number | null
          description?: string | null
          goal_type?: string
          id?: string
          is_shared?: boolean | null
          metadata?: Json | null
          status?: string
          target_date?: string | null
          target_value?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: string
          interaction_weight: number | null
          oopsie_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: string
          interaction_weight?: number | null
          oopsie_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: string
          interaction_weight?: number | null
          oopsie_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_oopsie_id_fkey"
            columns: ["oopsie_id"]
            isOneToOne: false
            referencedRelation: "oopsies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_meal_entries: {
        Row: {
          ate_with: string | null
          companions: string | null
          consumed_at: string
          created_at: string
          custom_meal_name: string | null
          daily_fruit_count: number | null
          eating_context: string | null
          fruits_consumed: Json | null
          fun_facts: Json | null
          hunger_level: string | null
          id: string
          is_new_food: boolean | null
          location: string | null
          meal_category_id: string | null
          meal_id: string | null
          meal_time: string | null
          mood: string | null
          music_vibe: string | null
          notes: string | null
          photo_url: string | null
          portion_size: string | null
          updated_at: string
          user_id: string
          vibe_rating: string | null
          weather: string | null
          will_eat_again: string | null
        }
        Insert: {
          ate_with?: string | null
          companions?: string | null
          consumed_at?: string
          created_at?: string
          custom_meal_name?: string | null
          daily_fruit_count?: number | null
          eating_context?: string | null
          fruits_consumed?: Json | null
          fun_facts?: Json | null
          hunger_level?: string | null
          id?: string
          is_new_food?: boolean | null
          location?: string | null
          meal_category_id?: string | null
          meal_id?: string | null
          meal_time?: string | null
          mood?: string | null
          music_vibe?: string | null
          notes?: string | null
          photo_url?: string | null
          portion_size?: string | null
          updated_at?: string
          user_id: string
          vibe_rating?: string | null
          weather?: string | null
          will_eat_again?: string | null
        }
        Update: {
          ate_with?: string | null
          companions?: string | null
          consumed_at?: string
          created_at?: string
          custom_meal_name?: string | null
          daily_fruit_count?: number | null
          eating_context?: string | null
          fruits_consumed?: Json | null
          fun_facts?: Json | null
          hunger_level?: string | null
          id?: string
          is_new_food?: boolean | null
          location?: string | null
          meal_category_id?: string | null
          meal_id?: string | null
          meal_time?: string | null
          mood?: string | null
          music_vibe?: string | null
          notes?: string | null
          photo_url?: string | null
          portion_size?: string | null
          updated_at?: string
          user_id?: string
          vibe_rating?: string | null
          weather?: string | null
          will_eat_again?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_meal_entries_meal_category_id_fkey"
            columns: ["meal_category_id"]
            isOneToOne: false
            referencedRelation: "meal_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_meal_entries_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_medication_entries: {
        Row: {
          created_at: string
          custom_medication_name: string | null
          dosage: string | null
          id: string
          medication_id: string | null
          notes: string | null
          taken_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_medication_name?: string | null
          dosage?: string | null
          id?: string
          medication_id?: string | null
          notes?: string | null
          taken_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_medication_name?: string | null
          dosage?: string | null
          id?: string
          medication_id?: string | null
          notes?: string | null
          taken_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_medication_entries_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mentions: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          mentioned_user_id: string
          mentioning_user_id: string
          message_id: string | null
          post_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          mentioned_user_id: string
          mentioning_user_id: string
          message_id?: string | null
          post_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          mentioned_user_id?: string
          mentioning_user_id?: string
          message_id?: string | null
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_mentions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mentions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mentions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_presence_extended: {
        Row: {
          activity_status: string | null
          created_at: string
          current_location: string | null
          id: string
          last_seen: string
          metadata: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_status?: string | null
          created_at?: string
          current_location?: string | null
          id?: string
          last_seen?: string
          metadata?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_status?: string | null
          created_at?: string
          current_location?: string | null
          id?: string
          last_seen?: string
          metadata?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_questions: {
        Row: {
          category: string | null
          created_at: string
          id: string
          question_text: string
          question_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          question_text: string
          question_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          question_text?: string
          question_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_relationships: {
        Row: {
          created_at: string
          id: string
          related_user_id: string
          relationship_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          related_user_id: string
          relationship_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          related_user_id?: string
          relationship_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_reputation: {
        Row: {
          comment_karma: number | null
          created_at: string | null
          id: string
          like_karma: number | null
          submission_karma: number | null
          total_karma: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment_karma?: number | null
          created_at?: string | null
          id?: string
          like_karma?: number | null
          submission_karma?: number | null
          total_karma?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment_karma?: number | null
          created_at?: string | null
          id?: string
          like_karma?: number | null
          submission_karma?: number | null
          total_karma?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          created_at: string
          id: string
          last_activity_at: string | null
          points_balance: number
          tier_level: string
          total_points_earned: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_activity_at?: string | null
          points_balance?: number
          tier_level?: string
          total_points_earned?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_activity_at?: string | null
          points_balance?: number
          tier_level?: string
          total_points_earned?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_social_connections: {
        Row: {
          access_token: string | null
          connection_data: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          platform: string
          platform_user_id: string | null
          platform_username: string | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          connection_data?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          platform: string
          platform_user_id?: string | null
          platform_username?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          connection_data?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          platform?: string
          platform_user_id?: string | null
          platform_username?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_story_notes: {
        Row: {
          created_at: string
          id: string
          note: string
          story_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note: string
          story_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          story_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_story_notes_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "interview_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string | null
          status: string
          stripe_subscription_id: string | null
          subscription_type: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: string
          stripe_subscription_id?: string | null
          subscription_type: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: string
          stripe_subscription_id?: string | null
          subscription_type?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_testimonials: {
        Row: {
          agent_id: string | null
          company: string | null
          created_at: string | null
          id: string
          is_featured: boolean | null
          status: string | null
          testimonial_text: string
          updated_at: string | null
          user_id: string
          user_title: string | null
        }
        Insert: {
          agent_id?: string | null
          company?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          status?: string | null
          testimonial_text: string
          updated_at?: string | null
          user_id: string
          user_title?: string | null
        }
        Update: {
          agent_id?: string | null
          company?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          status?: string | null
          testimonial_text?: string
          updated_at?: string | null
          user_id?: string
          user_title?: string | null
        }
        Relationships: []
      }
      user_vaults: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          metadata: Json | null
          provider: string
          tenant_id: string | null
          updated_at: string
          user_id: string
          vault_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          provider?: string
          tenant_id?: string | null
          updated_at?: string
          user_id: string
          vault_url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          provider?: string
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
          vault_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_vaults_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_waste_entries: {
        Row: {
          bristol_type: number
          created_at: string
          id: string
          notes: string | null
          occurred_at: string
          quantity_descriptor: string
          user_id: string
          volume_estimate: string
        }
        Insert: {
          bristol_type: number
          created_at?: string
          id?: string
          notes?: string | null
          occurred_at?: string
          quantity_descriptor: string
          user_id: string
          volume_estimate: string
        }
        Update: {
          bristol_type?: number
          created_at?: string
          id?: string
          notes?: string | null
          occurred_at?: string
          quantity_descriptor?: string
          user_id?: string
          volume_estimate?: string
        }
        Relationships: []
      }
      v2_ai_usage_logs: {
        Row: {
          duration_minutes: number | null
          id: string
          intensity_level: string | null
          logged_at: string | null
          self_rated_effectiveness: number | null
          task_type: string | null
          tool_name: string
          user_id: string | null
        }
        Insert: {
          duration_minutes?: number | null
          id?: string
          intensity_level?: string | null
          logged_at?: string | null
          self_rated_effectiveness?: number | null
          task_type?: string | null
          tool_name: string
          user_id?: string | null
        }
        Update: {
          duration_minutes?: number | null
          id?: string
          intensity_level?: string | null
          logged_at?: string | null
          self_rated_effectiveness?: number | null
          task_type?: string | null
          tool_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      v2_assessment_history: {
        Row: {
          assessment_id: string | null
          created_at: string | null
          id: string
          retest_number: number
          score_change: number | null
          test_number: number
          user_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string | null
          id?: string
          retest_number: number
          score_change?: number | null
          test_number: number
          user_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          created_at?: string | null
          id?: string
          retest_number?: number
          score_change?: number | null
          test_number?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "v2_assessment_history_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "v2_assessment_results"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_assessment_results: {
        Row: {
          completed_at: string | null
          computed_profile: Json | null
          consent_data_sharing: boolean | null
          consent_research: boolean | null
          created_at: string | null
          domain_data: Json | null
          id: string
          is_complete: boolean | null
          payment_status: string | null
          recommendations: Json | null
          session_id: string
          started_at: string | null
          tier_1_data: Json | null
          tier_2_data: Json | null
          tier_3_data: Json | null
          tier_4_data: Json | null
          topic_slug: string | null
          updated_at: string | null
          user_id: string | null
          version: string | null
        }
        Insert: {
          completed_at?: string | null
          computed_profile?: Json | null
          consent_data_sharing?: boolean | null
          consent_research?: boolean | null
          created_at?: string | null
          domain_data?: Json | null
          id?: string
          is_complete?: boolean | null
          payment_status?: string | null
          recommendations?: Json | null
          session_id: string
          started_at?: string | null
          tier_1_data?: Json | null
          tier_2_data?: Json | null
          tier_3_data?: Json | null
          tier_4_data?: Json | null
          topic_slug?: string | null
          updated_at?: string | null
          user_id?: string | null
          version?: string | null
        }
        Update: {
          completed_at?: string | null
          computed_profile?: Json | null
          consent_data_sharing?: boolean | null
          consent_research?: boolean | null
          created_at?: string | null
          domain_data?: Json | null
          id?: string
          is_complete?: boolean | null
          payment_status?: string | null
          recommendations?: Json | null
          session_id?: string
          started_at?: string | null
          tier_1_data?: Json | null
          tier_2_data?: Json | null
          tier_3_data?: Json | null
          tier_4_data?: Json | null
          topic_slug?: string | null
          updated_at?: string | null
          user_id?: string | null
          version?: string | null
        }
        Relationships: []
      }
      v2_test_responses: {
        Row: {
          assessment_id: string | null
          id: string
          is_correct: boolean | null
          item_number: number | null
          metadata: Json | null
          recorded_at: string | null
          response_time_ms: number | null
          response_value: string | null
          test_name: string
          test_number: number
          tier: number
        }
        Insert: {
          assessment_id?: string | null
          id?: string
          is_correct?: boolean | null
          item_number?: number | null
          metadata?: Json | null
          recorded_at?: string | null
          response_time_ms?: number | null
          response_value?: string | null
          test_name: string
          test_number: number
          tier: number
        }
        Update: {
          assessment_id?: string | null
          id?: string
          is_correct?: boolean | null
          item_number?: number | null
          metadata?: Json | null
          recorded_at?: string | null
          response_time_ms?: number | null
          response_value?: string | null
          test_name?: string
          test_number?: number
          tier?: number
        }
        Relationships: [
          {
            foreignKeyName: "v2_test_responses_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "v2_assessment_results"
            referencedColumns: ["id"]
          },
        ]
      }
      validation_logs: {
        Row: {
          health_document_id: string | null
          id: string
          imprinted_by_name: string | null
          imprinted_by_type: string | null
          location_data: Json | null
          prescription_script_id: string | null
          validated_at: string | null
          validation_result: string
          validator_id: string | null
          validator_name: string | null
          validator_type: string
        }
        Insert: {
          health_document_id?: string | null
          id?: string
          imprinted_by_name?: string | null
          imprinted_by_type?: string | null
          location_data?: Json | null
          prescription_script_id?: string | null
          validated_at?: string | null
          validation_result: string
          validator_id?: string | null
          validator_name?: string | null
          validator_type: string
        }
        Update: {
          health_document_id?: string | null
          id?: string
          imprinted_by_name?: string | null
          imprinted_by_type?: string | null
          location_data?: Json | null
          prescription_script_id?: string | null
          validated_at?: string | null
          validation_result?: string
          validator_id?: string | null
          validator_name?: string | null
          validator_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "validation_logs_health_document_id_fkey"
            columns: ["health_document_id"]
            isOneToOne: false
            referencedRelation: "health_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_requests: {
        Row: {
          comments: string | null
          created_at: string
          document_id: string | null
          document_type: string
          id: string
          requested_by: string | null
          reviewed_at: string | null
          status: string
          submitted_at: string
          updated_at: string
          user_id: string
          verification_notes: string | null
          verifier_id: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string
          document_id?: string | null
          document_type: string
          id?: string
          requested_by?: string | null
          reviewed_at?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id: string
          verification_notes?: string | null
          verifier_id?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string
          document_id?: string | null
          document_type?: string
          id?: string
          requested_by?: string | null
          reviewed_at?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id?: string
          verification_notes?: string | null
          verifier_id?: string | null
        }
        Relationships: []
      }
      vertical_groups: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      video_call_rooms: {
        Row: {
          created_at: string
          expires_at: string | null
          host_user_id: string
          id: string
          is_active: boolean | null
          max_participants: number | null
          password: string | null
          room_id: string
          room_name: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          host_user_id: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          password?: string | null
          room_id: string
          room_name?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          host_user_id?: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          password?: string | null
          room_id?: string
          room_name?: string | null
        }
        Relationships: []
      }
      viral_metrics: {
        Row: {
          comments_count: number | null
          created_at: string | null
          engagement_score: number | null
          id: string
          oopsie_id: string | null
          platform: string
          recorded_at: string | null
          shares_count: number | null
          upvotes_count: number | null
          viral_score: number | null
        }
        Insert: {
          comments_count?: number | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          oopsie_id?: string | null
          platform: string
          recorded_at?: string | null
          shares_count?: number | null
          upvotes_count?: number | null
          viral_score?: number | null
        }
        Update: {
          comments_count?: number | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          oopsie_id?: string | null
          platform?: string
          recorded_at?: string | null
          shares_count?: number | null
          upvotes_count?: number | null
          viral_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "viral_metrics_oopsie_id_fkey"
            columns: ["oopsie_id"]
            isOneToOne: false
            referencedRelation: "oopsies"
            referencedColumns: ["id"]
          },
        ]
      }
      vital_signs: {
        Row: {
          created_at: string
          diastolic_pressure: number | null
          heart_rate: number | null
          height_cm: number | null
          id: string
          measured_at: string
          measurement_type: string
          notes: string | null
          systolic_pressure: number | null
          temperature_celsius: number | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          created_at?: string
          diastolic_pressure?: number | null
          heart_rate?: number | null
          height_cm?: number | null
          id?: string
          measured_at?: string
          measurement_type: string
          notes?: string | null
          systolic_pressure?: number | null
          temperature_celsius?: number | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          created_at?: string
          diastolic_pressure?: number | null
          heart_rate?: number | null
          height_cm?: number | null
          id?: string
          measured_at?: string
          measurement_type?: string
          notes?: string | null
          systolic_pressure?: number | null
          temperature_celsius?: number | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      voice_chat_history: {
        Row: {
          conversation: Json | null
          created_at: string | null
          id: string
          session_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          conversation?: Json | null
          created_at?: string | null
          id?: string
          session_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          conversation?: Json | null
          created_at?: string | null
          id?: string
          session_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          class_id: string
          created_at: string
          id: string
          status: string
          updated_at: string
          user_email: string
          user_name: string
          user_phone: string | null
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_email: string
          user_name: string
          user_phone?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_email?: string
          user_name?: string
          user_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_passes: {
        Row: {
          authentication_token: string
          created_at: string | null
          health_document_id: string | null
          id: string
          pass_data: Json
          pass_type_identifier: string
          pass_url: string | null
          serial_number: string
          updated_at: string | null
        }
        Insert: {
          authentication_token: string
          created_at?: string | null
          health_document_id?: string | null
          id?: string
          pass_data?: Json
          pass_type_identifier: string
          pass_url?: string | null
          serial_number: string
          updated_at?: string | null
        }
        Update: {
          authentication_token?: string
          created_at?: string | null
          health_document_id?: string | null
          id?: string
          pass_data?: Json
          pass_type_identifier?: string
          pass_url?: string | null
          serial_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_passes_health_document_id_fkey"
            columns: ["health_document_id"]
            isOneToOne: false
            referencedRelation: "health_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      waste_medication_correlations: {
        Row: {
          created_at: string
          hours_after_medication: number | null
          id: string
          medication_entry_id: string | null
          waste_entry_id: string | null
        }
        Insert: {
          created_at?: string
          hours_after_medication?: number | null
          id?: string
          medication_entry_id?: string | null
          waste_entry_id?: string | null
        }
        Update: {
          created_at?: string
          hours_after_medication?: number | null
          id?: string
          medication_entry_id?: string | null
          waste_entry_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waste_medication_correlations_medication_entry_id_fkey"
            columns: ["medication_entry_id"]
            isOneToOne: false
            referencedRelation: "user_medication_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waste_medication_correlations_waste_entry_id_fkey"
            columns: ["waste_entry_id"]
            isOneToOne: false
            referencedRelation: "user_waste_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      white_label_configs: {
        Row: {
          brand_name: string
          created_at: string | null
          custom_certificate_template: Json | null
          custom_domain: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          partner_id: string | null
          pricing_markup: number | null
          primary_color: string | null
          secondary_color: string | null
          updated_at: string | null
        }
        Insert: {
          brand_name: string
          created_at?: string | null
          custom_certificate_template?: Json | null
          custom_domain?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          partner_id?: string | null
          pricing_markup?: number | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_name?: string
          created_at?: string | null
          custom_certificate_template?: Json | null
          custom_domain?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          partner_id?: string | null
          pricing_markup?: number | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "white_label_configs_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesale_tiers: {
        Row: {
          created_at: string | null
          discount_percentage: number
          features: string[] | null
          id: string
          is_active: boolean | null
          min_quantity: number
          price_per_unit: number
          tier_name: string
        }
        Insert: {
          created_at?: string | null
          discount_percentage: number
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          min_quantity: number
          price_per_unit: number
          tier_name: string
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          min_quantity?: number
          price_per_unit?: number
          tier_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      agent_workload: {
        Row: {
          agent_code: string | null
          domain: string | null
          done: number | null
          in_progress: number | null
          pending: number | null
          persona: string | null
          projected_cost: number | null
        }
        Relationships: []
      }
      agents_by_status: {
        Row: {
          status: string | null
          total: number | null
        }
        Relationships: []
      }
      agents_recent: {
        Row: {
          category: string | null
          created_at: string | null
          creator: string | null
          description: string | null
          difficulty: string | null
          download_count: number | null
          github_url: string | null
          id: string | null
          is_active: boolean | null
          is_featured: boolean | null
          last_updated: string | null
          name: string | null
          platform: string | null
          rating_average: number | null
          rating_count: number | null
          resource_url: string | null
          source_url: string | null
          status: string | null
          tags: string[] | null
          template_url: string | null
          title: string | null
          updated_at: string | null
          uploaded_by: string | null
          use_case: string | null
          view_count: number | null
          youtube_url: string | null
        }
        Relationships: []
      }
      ai_sweet_spots_faqs_most_helpful: {
        Row: {
          category: string | null
          helpful_count: number | null
          id: string | null
          population_tags: string[] | null
          question: string | null
          tools_mentioned: string[] | null
          view_count: number | null
        }
        Relationships: []
      }
      ai_sweet_spots_search_suggestions: {
        Row: {
          avg_results: number | null
          search_count: number | null
          search_query: string | null
        }
        Relationships: []
      }
      article_engine_full: {
        Row: {
          agent_refs: string[] | null
          business_area: string | null
          carousel: string | null
          cluster: string | null
          external_signals: string | null
          headline: string | null
          hook: string | null
          input_id: number | null
          output_created: string | null
          output_id: number | null
          pov_notes: string | null
          section_a: string | null
          section_b: string | null
          section_c: string | null
          section_d: string | null
          section_e: string | null
          section_f: string | null
          section_g: string | null
          sub_component: string | null
          video_prompts: string | null
          visuals: string | null
        }
        Relationships: []
      }
      category_health: {
        Row: {
          category: string | null
          completed: number | null
          completion_rate: number | null
          in_progress: number | null
          pending: number | null
        }
        Relationships: []
      }
      content_entries_public: {
        Row: {
          category_code: string | null
          category_name: string | null
          commercial_use_allowed: boolean | null
          contributor_name: string | null
          contributor_website: string | null
          created_at: string | null
          description: string | null
          download_count: number | null
          duration_seconds: number | null
          id: string | null
          is_featured: boolean | null
          license_code: string | null
          license_name: string | null
          license_url: string | null
          published_at: string | null
          redistribution_allowed: boolean | null
          requires_attribution: boolean | null
          slug: string | null
          source_name: string | null
          source_url: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string | null
          view_count: number | null
        }
        Relationships: []
      }
      dashboard_last7: {
        Row: {
          category: string | null
          entries: number | null
          first_seen: string | null
          last_seen: string | null
        }
        Relationships: []
      }
      exec_portal: {
        Row: {
          briefing_created: string | null
          exec_briefing: string | null
          governance_created: string | null
          governance_report: string | null
          portal_date: string | null
          total_completed_cost: number | null
          total_projected_cost: number | null
          total_reports: number | null
          total_tasks_done: number | null
          total_tasks_pending: number | null
        }
        Relationships: []
      }
      exec_snapshot: {
        Row: {
          snapshot_date: string | null
          total_completed_cost: number | null
          total_projected_cost: number | null
          total_reports: number | null
          total_tasks_done: number | null
          total_tasks_pending: number | null
        }
        Relationships: []
      }
      family_disruption_dashboard: {
        Row: {
          dashboard: Json | null
        }
        Relationships: []
      }
      family_disruption_overall: {
        Row: {
          impact_vector: string | null
          pct_roles: number | null
          role_count: number | null
        }
        Relationships: []
      }
      family_impact_summary: {
        Row: {
          function: string | null
          high_impact_roles: number | null
          low_impact_roles: number | null
          medium_impact_roles: number | null
          pct_high: number | null
          pct_low: number | null
          pct_medium: number | null
          total_roles: number | null
        }
        Relationships: []
      }
      family_reskilling_skill_counts: {
        Row: {
          pct_roles: number | null
          role_count: number | null
          skill: string | null
        }
        Relationships: []
      }
      file_library_monthly: {
        Row: {
          category: string | null
          created_date: string | null
          direction: string | null
          file_ext: string | null
          file_name: string | null
          id: string | null
          notes: string | null
          source_url: string | null
          tags: string | null
          theme_title: string | null
        }
        Insert: {
          category?: string | null
          created_date?: string | null
          direction?: string | null
          file_ext?: string | null
          file_name?: string | null
          id?: string | null
          notes?: string | null
          source_url?: string | null
          tags?: string | null
          theme_title?: string | null
        }
        Update: {
          category?: string | null
          created_date?: string | null
          direction?: string | null
          file_ext?: string | null
          file_name?: string | null
          id?: string | null
          notes?: string | null
          source_url?: string | null
          tags?: string | null
          theme_title?: string | null
        }
        Relationships: []
      }
      file_library_trends: {
        Row: {
          category: string | null
          direction: string | null
          file_count: number | null
          month: string | null
        }
        Relationships: []
      }
      file_library_weekly: {
        Row: {
          category: string | null
          created_date: string | null
          direction: string | null
          file_ext: string | null
          file_name: string | null
          id: string | null
          notes: string | null
          source_url: string | null
          tags: string | null
          theme_title: string | null
        }
        Insert: {
          category?: string | null
          created_date?: string | null
          direction?: string | null
          file_ext?: string | null
          file_name?: string | null
          id?: string | null
          notes?: string | null
          source_url?: string | null
          tags?: string | null
          theme_title?: string | null
        }
        Update: {
          category?: string | null
          created_date?: string | null
          direction?: string | null
          file_ext?: string | null
          file_name?: string | null
          id?: string | null
          notes?: string | null
          source_url?: string | null
          tags?: string | null
          theme_title?: string | null
        }
        Relationships: []
      }
      financial_summary_board: {
        Row: {
          agent_code: string | null
          category: string | null
          completed_cost: number | null
          persona: string | null
          projected_cost: number | null
          tasks_completed: number | null
          tasks_total: number | null
          week: string | null
        }
        Relationships: []
      }
      idea_board: {
        Row: {
          content: string | null
          id: string | null
          owner: string | null
          priority: string | null
          run_date: string | null
          status: string | null
          tags: string[] | null
        }
        Insert: {
          content?: string | null
          id?: string | null
          owner?: string | null
          priority?: string | null
          run_date?: string | null
          status?: string | null
          tags?: string[] | null
        }
        Update: {
          content?: string | null
          id?: string | null
          owner?: string | null
          priority?: string | null
          run_date?: string | null
          status?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      performance_dashboard: {
        Row: {
          agent_code: string | null
          avg_completion_hours: number | null
          persona: string | null
          tasks_completed: number | null
          tasks_pending: number | null
        }
        Relationships: []
      }
      projection_board: {
        Row: {
          category: string | null
          day: string | null
          entries: number | null
        }
        Relationships: []
      }
      slack_report_health: {
        Row: {
          created_at: string | null
          report_name: string | null
          report_type: string | null
          status: string | null
        }
        Relationships: []
      }
      v_book_completion: {
        Row: {
          book: string | null
          book_pct: number | null
          high_priority_subs: number | null
          total_subs: number | null
        }
        Relationships: []
      }
      v_chapter_completion: {
        Row: {
          book: string | null
          chapter: string | null
          chapter_pct: number | null
          high_subs: number | null
          sub_count: number | null
        }
        Relationships: []
      }
      v_chapter_status: {
        Row: {
          book: string | null
          chapter: string | null
          chapter_pct: number | null
          expansion_notes: string | null
          last_updated: string | null
          legacy_chapter_pct: number | null
          priority: string | null
          ready_flag: boolean | null
          wordcount_est: number | null
        }
        Relationships: []
      }
      v_top_gaps: {
        Row: {
          book: string | null
          chapter: string | null
          priority: string | null
          sub_pct: number | null
          subcomponent: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_file_entry:
        | {
            Args: {
              p_category: string
              p_direction: string
              p_file_ext: string
              p_file_name: string
              p_notes?: string
              p_source_url?: string
              p_tags: string
              p_theme_title: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_category: string
              p_file_ext: string
              p_file_name: string
              p_notes?: string
              p_source_url?: string
              p_tags: string
              p_theme_title: string
            }
            Returns: undefined
          }
      add_task: { Args: { task_desc: string }; Returns: number }
      aggregate_daily_partner_metrics: { Args: never; Returns: undefined }
      archive_old_audit_logs: { Args: never; Returns: undefined }
      auto_migrate_all_family_agents_v2: { Args: never; Returns: undefined }
      award_achievement: {
        Args: {
          achievement_name: string
          achievement_type: string
          description: string
          points: number
          target_user_id: string
        }
        Returns: undefined
      }
      calculate_readiness_score: {
        Args: { target_user_id: string }
        Returns: number
      }
      calculate_submission_quality_score: {
        Args: {
          p_description: string
          p_tags: string[]
          p_title: string
          p_tools: string[]
        }
        Returns: number
      }
      calculate_trending_score: {
        Args: {
          downloads: number
          hours_since_creation: number
          rating: number
          rating_count: number
          views: number
        }
        Returns: number
      }
      calculate_viral_score: {
        Args: {
          comments: number
          hours_since_creation: number
          shares: number
          upvotes: number
        }
        Returns: number
      }
      can_manage_family: {
        Args: { _family_group_id: string; _user_id: string }
        Returns: boolean
      }
      can_submit_build_video: { Args: never; Returns: boolean }
      capture_and_notify_snapshot: { Args: never; Returns: undefined }
      check_api_rate_limit: {
        Args: {
          _endpoint: string
          _identifier: string
          _max_requests?: number
          _window_minutes?: number
        }
        Returns: boolean
      }
      check_api_rate_limit_v2: {
        Args: {
          _block_minutes?: number
          _endpoint: string
          _identifier: string
          _max_requests?: number
          _window_minutes?: number
        }
        Returns: boolean
      }
      check_expiring_consents: {
        Args: never
        Returns: {
          consent_id: string
          consent_type: string
          days_until_expiry: number
          expires_at: string
          purpose: string
          tenant_id: string
          user_email: string
          user_id: string
          warning_type: string
        }[]
      }
      check_form_rate_limit: {
        Args: {
          _form_type: string
          _ip: unknown
          _max_submissions?: number
          _window_hours?: number
        }
        Returns: boolean
      }
      check_usage_limit: {
        Args: { _limit_type: string; _user_id: string }
        Returns: boolean
      }
      cleanup_old_sms_logs: { Args: never; Returns: undefined }
      complete_task: { Args: { task_id: number }; Returns: undefined }
      decrement_likes: { Args: { fail_id: string }; Returns: undefined }
      delete_task: { Args: { task_id: number }; Returns: undefined }
      enqueue_slack: {
        Args: { p_blocks?: Json; p_text: string; p_type: string }
        Returns: string
      }
      ensure_rls_on_all_tables: {
        Args: never
        Returns: {
          has_policies: boolean
          rls_enabled: boolean
          table_name: string
        }[]
      }
      file_library_purge: { Args: { p_keep_days?: number }; Returns: undefined }
      file_library_stats: {
        Args: never
        Returns: {
          generated: number
          total: number
          uploaded: number
        }[]
      }
      generate_content_slug: { Args: { title_text: string }; Returns: string }
      generate_daily_challenge: {
        Args: { challenge_date: string }
        Returns: string
      }
      generate_qr_token: { Args: never; Returns: string }
      generate_study_key: { Args: never; Returns: string }
      get_category_analytics: {
        Args: { category_filter?: string }
        Returns: {
          avg_rating: number
          category: string
          total_agents: number
          total_downloads: number
          total_views: number
          trending_agent_id: string
          trending_agent_name: string
        }[]
      }
      get_doc: { Args: { doc_title: string }; Returns: string }
      get_doc_history: {
        Args: { doc_title: string }
        Returns: {
          author: string
          content: string
          created_at: string
          doc_version: number
        }[]
      }
      get_programs_for_domain: {
        Args: { domain_host: string }
        Returns: {
          age_group: string
          capacity: number
          contact_email: string
          description: string
          id: string
          location: string
          program_end: string
          program_start: string
          registration_end: string
          registration_fee: number
          registration_start: string
          requirements: Json
          schedule_info: string
          season_type: string
          season_year: string
          sport_name: string
          tenant_name: string
        }[]
      }
      get_public_assets_for_domain: {
        Args: { domain_host: string }
        Returns: {
          asset_category: string
          asset_key: string
          asset_name: string
          asset_url: string
          tenant_slug: string
        }[]
      }
      get_top_coaches: {
        Args: { limit_count?: number }
        Returns: {
          total_likes: number
          total_views: number
          user_id: string
          videos_count: number
        }[]
      }
      get_top_tools: {
        Args: { limit_count?: number }
        Returns: {
          tool: string
          total_likes: number
          total_views: number
          videos_count: number
        }[]
      }
      get_user_plan: { Args: { _user_id: string }; Returns: string }
      harvest_slack_responses: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_agent_download: {
        Args: { agent_uuid: string }
        Returns: undefined
      }
      increment_coach_video_view: {
        Args: { p_video_id: string }
        Returns: undefined
      }
      increment_likes: { Args: { fail_id: string }; Returns: undefined }
      increment_oopsie_likes: {
        Args: { oopsie_id: string }
        Returns: undefined
      }
      increment_view_count: { Args: { oopsie_id: string }; Returns: undefined }
      is_active_partner_member: {
        Args: { _partner_org_id: string; _user_id: string }
        Returns: boolean
      }
      is_family_member: {
        Args: { _family_group_id: string; _user_id: string }
        Returns: boolean
      }
      is_in_conversation: {
        Args: { _conversation_id: string; _user_id: string }
        Returns: boolean
      }
      is_ip_blocked: { Args: { _ip: unknown }; Returns: boolean }
      list_tasks: {
        Args: { filter_status?: string }
        Returns: {
          created_at: string
          description: string
          id: number
          status: string
          updated_at: string
        }[]
      }
      log_audit_event: {
        Args: {
          _action: string
          _endpoint?: string
          _event_type: string
          _metadata?: Json
          _new_data?: Json
          _old_data?: Json
          _record_id?: string
          _severity?: string
          _table_name?: string
        }
        Returns: undefined
      }
      log_moderation_action: {
        Args: {
          action: string
          new_status?: string
          oopsie_id: string
          previous_status?: string
          reason?: string
        }
        Returns: undefined
      }
      log_partner_audit: {
        Args: {
          p_action: string
          p_details?: Json
          p_partner_org_id: string
          p_resource_id?: string
          p_resource_type?: string
        }
        Returns: undefined
      }
      log_rate_limit_violation: {
        Args: { _endpoint: string; _ip: unknown; _user_id?: string }
        Returns: undefined
      }
      log_user_activity: {
        Args: {
          p_action_type: string
          p_ip_address?: string
          p_metadata?: Json
          p_resource_id?: string
          p_resource_type: string
          p_user_agent?: string
        }
        Returns: undefined
      }
      monthly_demo_refresh: { Args: never; Returns: undefined }
      notify_slack:
        | {
            Args: {
              v_blocks?: Json
              v_channel: string
              v_text: string
              v_token: string
            }
            Returns: undefined
          }
        | { Args: { payload: string }; Returns: undefined }
      pick_best_agent: {
        Args: { report_category: string; report_tags: string[] }
        Returns: string
      }
      prime_exec_portal: { Args: never; Returns: undefined }
      promote_contribution_to_agent: {
        Args: { _contribution_id: string; _moderator_id?: string }
        Returns: string
      }
      remove_task: { Args: { task_id: number }; Returns: undefined }
      reopen_task: { Args: { task_id: number }; Returns: undefined }
      run_audit_check: { Args: never; Returns: undefined }
      run_simulation_test: { Args: never; Returns: undefined }
      run_system_check: { Args: { mode: string }; Returns: undefined }
      search_tasks: {
        Args: { keyword: string }
        Returns: {
          created_at: string
          description: string
          id: number
          status: string
          updated_at: string
        }[]
      }
      security_audit_summary: {
        Args: never
        Returns: {
          category: string
          details: string
          status: string
        }[]
      }
      seed_demo_data: { Args: never; Returns: undefined }
      slack_digest: { Args: never; Returns: undefined }
      slack_enrich_and_alert: { Args: never; Returns: undefined }
      snapshot_exec_briefing: { Args: never; Returns: undefined }
      snapshot_governance_report: { Args: never; Returns: undefined }
      sync_chapter_pct: {
        Args: { p_book: string; p_chapter: string }
        Returns: undefined
      }
      test_rls_policies: {
        Args: never
        Returns: {
          actual_result: string
          expected_result: string
          passed: boolean
          table_tested: string
          test_name: string
        }[]
      }
      update_contributor_reputation: {
        Args: { p_action: string; p_user_id: string }
        Returns: undefined
      }
      update_daily_analytics: { Args: never; Returns: undefined }
      update_link_health: {
        Args: {
          check_url: string
          error_message_param?: string
          response_time_param: number
          status_code_param: number
        }
        Returns: undefined
      }
      update_trending_scores: { Args: never; Returns: undefined }
      update_usage_tracking: {
        Args: { _increment_type: string; _user_id: string }
        Returns: undefined
      }
      update_user_karma: {
        Args: { karma_type: string; points: number; target_user_id: string }
        Returns: undefined
      }
      update_viral_scores: { Args: never; Returns: undefined }
      upsert_doc: {
        Args: {
          p_author?: string
          p_content: string
          p_title: string
          p_type: string
        }
        Returns: {
          author: string
          created_at: string
          doc_type: string
          is_current: boolean
          title: string
          version: number
        }[]
      }
    }
    Enums: {
      app_role:
        | "user"
        | "admin"
        | "moderator"
        | "partner_owner"
        | "partner_tech"
        | "partner_legal"
        | "partner_operator"
        | "consentx_admin"
      subscription_plan: "free" | "pro" | "enterprise"
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
      app_role: [
        "user",
        "admin",
        "moderator",
        "partner_owner",
        "partner_tech",
        "partner_legal",
        "partner_operator",
        "consentx_admin",
      ],
      subscription_plan: ["free", "pro", "enterprise"],
    },
  },
} as const
