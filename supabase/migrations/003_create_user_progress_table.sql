-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
	question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
	selected_answer TEXT,
	is_correct BOOLEAN,
	time_spent_seconds INTEGER,
	attempts_count INTEGER DEFAULT 1,
	last_attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	
	-- Ensure one progress record per user per question
	UNIQUE(user_id, question_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - users can only see their own progress
CREATE POLICY "Users can view own progress" ON public.user_progress
	FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
	FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
	FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_question_id ON public.user_progress(question_id);
CREATE INDEX idx_user_progress_is_correct ON public.user_progress(is_correct);
CREATE INDEX idx_user_progress_last_attempted ON public.user_progress(last_attempted_at);
