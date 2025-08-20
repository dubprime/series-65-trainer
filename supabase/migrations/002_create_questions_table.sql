-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	question_text TEXT NOT NULL,
	question_type TEXT DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false')),
	choices JSONB NOT NULL, -- Array of choice objects: [{"text": "choice text", "is_correct": true}, ...]
	correct_answer TEXT NOT NULL,
	explanation TEXT,
	category TEXT,
	subcategory TEXT,
	difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
	tags TEXT[],
	source TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - questions are readable by all authenticated users
CREATE POLICY "Questions are viewable by authenticated users" ON public.questions
	FOR SELECT USING (auth.role() = 'authenticated');

-- Create index for better performance
CREATE INDEX idx_questions_category ON public.questions(category);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty_level);
CREATE INDEX idx_questions_tags ON public.questions USING GIN(tags);
