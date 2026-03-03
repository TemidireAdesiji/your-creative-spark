
-- Add server-side input validation via CHECK constraints
ALTER TABLE public.feedback ADD CONSTRAINT user_name_length 
  CHECK (length(user_name) > 0 AND length(user_name) <= 100);

ALTER TABLE public.feedback ADD CONSTRAINT comments_length 
  CHECK (comments IS NULL OR length(comments) <= 1000);

ALTER TABLE public.feedback ADD CONSTRAINT rating_range 
  CHECK (rating >= 1 AND rating <= 5);
