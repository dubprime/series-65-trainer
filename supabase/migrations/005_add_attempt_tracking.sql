-- Add attempt tracking fields to user_progress table
ALTER TABLE public.user_progress 
ADD COLUMN attempts INTEGER DEFAULT 0,
ADD COLUMN correct_attempts INTEGER DEFAULT 0;

-- Update existing records to set default values
UPDATE public.user_progress 
SET attempts = 1, correct_attempts = CASE WHEN is_correct THEN 1 ELSE 0 END
WHERE attempts IS NULL OR correct_attempts IS NULL;

-- Make fields NOT NULL
ALTER TABLE public.user_progress 
ALTER COLUMN attempts SET NOT NULL,
ALTER COLUMN correct_attempts SET NOT NULL;

-- Add indexes for performance (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_progress_attempts') THEN
        CREATE INDEX idx_user_progress_attempts ON public.user_progress(attempts);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_progress_correct_attempts') THEN
        CREATE INDEX idx_user_progress_correct_attempts ON public.user_progress(correct_attempts);
    END IF;
END $$;
