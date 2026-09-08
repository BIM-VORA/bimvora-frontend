export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company: string | null;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company?: string | null;
          role?: "customer" | "admin";
        };
        Update: {
          full_name?: string | null;
          company?: string | null;
        };
      };
    };
    Enums: {
      user_role: "customer" | "admin";
      discipline:
        | "hvac"
        | "plumbing"
        | "electrical"
        | "fire_protection"
        | "architectural"
        | "structural"
        | "clean_room"
        | "other";
    };
  };
};
