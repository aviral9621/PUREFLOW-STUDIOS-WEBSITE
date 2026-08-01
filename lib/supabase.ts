import { createClient } from '@supabase/supabase-js';

// Credentials come from the build environment first. The fallbacks below are the
// values that used to be hardcoded — separately, and identically — in all five
// `Get*Page.tsx` lead forms, which is how those forms worked in production
// without any env vars configured. Keeping them here means the forms cannot
// silently break on deploy, while the values live in exactly one place.
//
// This is safe to ship: the anon key is a *publishable* client key. It is meant to
// be sent to browsers, and it only grants what your Row Level Security policies
// allow. It is not a service-role key. Set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// in Vercel to override, and rotate here if the project ever moves.
const FALLBACK_URL = 'https://jnytayxxwaydlmeuvtqr.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpueXRheXh4d2F5ZGxtZXV2dHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3ODQzNjMsImV4cCI6MjA3ODM2MDM2M30.o0ZDUriNTnz9fFkmXaM1_DMnvWydPKu-4j0b8zVfQME';

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || FALLBACK_URL;
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || FALLBACK_ANON_KEY;

/**
 * True when the credentials came from the environment rather than the built-in
 * fallback. Deliberately NOT named `isSupabaseConfigured` — the client is always
 * usable now, so a name implying "can we talk to Supabase?" would invite callers
 * to gate form submission on it and disable working forms.
 */
export const isUsingEnvCredentials = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

if (!isUsingEnvCredentials) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set — using built-in fallback credentials.'
  );
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});
