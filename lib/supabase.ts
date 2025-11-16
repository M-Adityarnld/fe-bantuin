const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_BUCKET_PATH = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_PATH;

export function getSupabaseUrl(fileName: string) {
  return `${SUPABASE_URL}${SUPABASE_BUCKET_PATH}/${fileName}`;
}