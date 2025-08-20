-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable auth schema (this is typically done by Supabase automatically)
-- But we'll ensure it's available for our triggers
CREATE SCHEMA IF NOT EXISTS auth;
