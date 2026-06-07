ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_lat   float8,
  ADD COLUMN IF NOT EXISTS last_lng   float8,
  ADD COLUMN IF NOT EXISTS last_seen  timestamptz;
