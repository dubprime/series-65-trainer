-- Temporarily disable RLS for questions table to allow bulk import
-- This should be re-enabled after import is complete

-- Disable RLS temporarily
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;

-- Note: Remember to re-enable RLS after import with:
-- ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
