-- Add submitted field to user_progress table
ALTER TABLE public.user_progress 
ADD COLUMN submitted BOOLEAN DEFAULT false;

-- Update existing records to mark them as submitted
UPDATE public.user_progress 
SET submitted = true 
WHERE submitted IS NULL;

-- Make submitted field NOT NULL
ALTER TABLE public.user_progress 
ALTER COLUMN submitted SET NOT NULL;

-- Add index for submitted field
CREATE INDEX idx_user_progress_submitted ON public.user_progress(submitted);
