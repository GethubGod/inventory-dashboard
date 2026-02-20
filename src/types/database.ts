export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type DynamicColumns = {
  [key: string]: Json | undefined;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: DynamicColumns & {
          id: string;
          org_id: string | null;
          full_name: string | null;
          created_at: string | null;
        };
        Insert: DynamicColumns & {
          id: string;
          org_id?: string | null;
          full_name?: string | null;
          created_at?: string | null;
        };
        Update: DynamicColumns & {
          id?: string;
          org_id?: string | null;
          full_name?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      organizations: {
        Row: DynamicColumns & {
          id: string;
          name: string;
          created_at: string | null;
        };
        Insert: DynamicColumns & {
          id?: string;
          name: string;
          created_at?: string | null;
        };
        Update: DynamicColumns & {
          id?: string;
          name?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      org_memberships: {
        Row: DynamicColumns & {
          id: string;
          user_id: string;
          org_id: string;
          role: string | null;
          created_at: string | null;
        };
        Insert: DynamicColumns & {
          id?: string;
          user_id: string;
          org_id: string;
          role?: string | null;
          created_at?: string | null;
        };
        Update: DynamicColumns & {
          id?: string;
          user_id?: string;
          org_id?: string;
          role?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      inventory_items: {
        Row: DynamicColumns & {
          id: string;
          org_id: string;
          name: string | null;
          emoji: string | null;
          category: string | null;
          item_category: string | null;
          supplier_category: string | null;
          base_unit: string | null;
          pack_unit: string | null;
          pack_size: number | null;
          supplier_id: string | null;
          notes: string | null;
          active: boolean | null;
          last_counted_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: DynamicColumns & {
          id?: string;
          org_id: string;
          name?: string | null;
          emoji?: string | null;
          category?: string | null;
          item_category?: string | null;
          supplier_category?: string | null;
          base_unit?: string | null;
          pack_unit?: string | null;
          pack_size?: number | null;
          supplier_id?: string | null;
          notes?: string | null;
          active?: boolean | null;
          last_counted_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: DynamicColumns & {
          id?: string;
          org_id?: string;
          name?: string | null;
          emoji?: string | null;
          category?: string | null;
          item_category?: string | null;
          supplier_category?: string | null;
          base_unit?: string | null;
          pack_unit?: string | null;
          pack_size?: number | null;
          supplier_id?: string | null;
          notes?: string | null;
          active?: boolean | null;
          last_counted_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      suppliers: {
        Row: DynamicColumns & {
          id: string;
          org_id: string;
          name: string | null;
          category: string | null;
          phone: string | null;
          email: string | null;
          notes: string | null;
          active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: DynamicColumns & {
          id?: string;
          org_id: string;
          name?: string | null;
          category?: string | null;
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: DynamicColumns & {
          id?: string;
          org_id?: string;
          name?: string | null;
          category?: string | null;
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      recipes: {
        Row: DynamicColumns & {
          id: string;
          org_id: string;
          square_catalog_item_id: string | null;
          square_item_name: string | null;
          inventory_item_id: string | null;
          confirmed_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: DynamicColumns & {
          id?: string;
          org_id: string;
          square_catalog_item_id?: string | null;
          square_item_name?: string | null;
          inventory_item_id?: string | null;
          confirmed_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: DynamicColumns & {
          id?: string;
          org_id?: string;
          square_catalog_item_id?: string | null;
          square_item_name?: string | null;
          inventory_item_id?: string | null;
          confirmed_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      daily_sales: {
        Row: DynamicColumns & {
          id: string;
          org_id: string;
          square_catalog_item_id: string | null;
          item_name: string | null;
          quantity_sold: number | null;
          sold_at: string | null;
          synced_at: string | null;
        };
        Insert: DynamicColumns & {
          id?: string;
          org_id: string;
          square_catalog_item_id?: string | null;
          item_name?: string | null;
          quantity_sold?: number | null;
          sold_at?: string | null;
          synced_at?: string | null;
        };
        Update: DynamicColumns & {
          id?: string;
          org_id?: string;
          square_catalog_item_id?: string | null;
          item_name?: string | null;
          quantity_sold?: number | null;
          sold_at?: string | null;
          synced_at?: string | null;
        };
        Relationships: [];
      };
      demand_forecasts: {
        Row: DynamicColumns & {
          id: string;
          org_id: string;
          inventory_item_id: string | null;
          forecast_date: string | null;
          confidence: string | null;
          computed_at: string | null;
        };
        Insert: DynamicColumns & {
          id?: string;
          org_id: string;
          inventory_item_id?: string | null;
          forecast_date?: string | null;
          confidence?: string | null;
          computed_at?: string | null;
        };
        Update: DynamicColumns & {
          id?: string;
          org_id?: string;
          inventory_item_id?: string | null;
          forecast_date?: string | null;
          confidence?: string | null;
          computed_at?: string | null;
        };
        Relationships: [];
      };
      square_connections: {
        Row: DynamicColumns & {
          id: string;
          org_id: string;
          sync_status: string | null;
          sync_error_message: string | null;
          last_synced_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: DynamicColumns & {
          id?: string;
          org_id: string;
          sync_status?: string | null;
          sync_error_message?: string | null;
          last_synced_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: DynamicColumns & {
          id?: string;
          org_id?: string;
          sync_status?: string | null;
          sync_error_message?: string | null;
          last_synced_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      import_batches: {
        Row: DynamicColumns & {
          id: string;
          org_id: string;
          file_name: string | null;
          status: string | null;
          uploaded_by: string | null;
          created_at: string | null;
          completed_at: string | null;
        };
        Insert: DynamicColumns & {
          id?: string;
          org_id: string;
          file_name?: string | null;
          status?: string | null;
          uploaded_by?: string | null;
          created_at?: string | null;
          completed_at?: string | null;
        };
        Update: DynamicColumns & {
          id?: string;
          org_id?: string;
          file_name?: string | null;
          status?: string | null;
          uploaded_by?: string | null;
          created_at?: string | null;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      unmapped_menu_items: {
        Row: DynamicColumns & {
          id: string;
          org_id: string;
          status: string | null;
          square_item_name: string | null;
          detected_at: string | null;
        };
        Insert: DynamicColumns & {
          id?: string;
          org_id: string;
          status?: string | null;
          square_item_name?: string | null;
          detected_at?: string | null;
        };
        Update: DynamicColumns & {
          id?: string;
          org_id?: string;
          status?: string | null;
          square_item_name?: string | null;
          detected_at?: string | null;
        };
        Relationships: [];
      };
      orders: {
        Row: DynamicColumns & {
          id: string;
          org_id: string;
          status: string | null;
          order_number: string | null;
          created_at: string | null;
          updated_at: string | null;
          submitted_at: string | null;
          submitted_by: string | null;
          created_by: string | null;
          user_id: string | null;
        };
        Insert: DynamicColumns & {
          id?: string;
          org_id: string;
          status?: string | null;
          order_number?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          submitted_at?: string | null;
          submitted_by?: string | null;
          created_by?: string | null;
          user_id?: string | null;
        };
        Update: DynamicColumns & {
          id?: string;
          org_id?: string;
          status?: string | null;
          order_number?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          submitted_at?: string | null;
          submitted_by?: string | null;
          created_by?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      stock_check_sessions: {
        Row: DynamicColumns & {
          id: string;
          org_id: string;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
          completed_at: string | null;
          completed_by: string | null;
          created_by: string | null;
          user_id: string | null;
        };
        Insert: DynamicColumns & {
          id?: string;
          org_id: string;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          completed_at?: string | null;
          completed_by?: string | null;
          created_by?: string | null;
          user_id?: string | null;
        };
        Update: DynamicColumns & {
          id?: string;
          org_id?: string;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          completed_at?: string | null;
          completed_by?: string | null;
          created_by?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      stock_updates: {
        Row: DynamicColumns & {
          id: string;
          org_id: string;
          inventory_item_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: DynamicColumns & {
          id?: string;
          org_id: string;
          inventory_item_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: DynamicColumns & {
          id?: string;
          org_id?: string;
          inventory_item_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      ItemCategory: string;
    };
    CompositeTypes: Record<string, never>;
  };
};
