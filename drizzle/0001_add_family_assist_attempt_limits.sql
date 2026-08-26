ALTER TABLE public.sp_family_assist_links
  ADD COLUMN IF NOT EXISTS attempt_count integer NOT NULL DEFAULT 0
    CHECK (attempt_count >= 0 AND attempt_count <= 5);

ALTER TABLE public.sp_family_assist_links
  ADD COLUMN IF NOT EXISTS last_attempt_at timestamptz;
