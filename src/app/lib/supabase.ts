import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

// Singleton browser client — used for auth (sessions persist in localStorage).
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
);

export const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4526812d`;
export { publicAnonKey };
