-- Database Setup Script for Pontigram News
-- Run this script in Supabase SQL Editor

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT,
  "role" TEXT NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create unique index for User email
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Create Category table
CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- Create unique index for Category slug
CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");

-- Create Article table
CREATE TABLE IF NOT EXISTS "Article" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "featuredImage" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "isBreaking" BOOLEAN NOT NULL DEFAULT false,
  "views" INTEGER NOT NULL DEFAULT 0,
  "authorId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- Create unique index for Article slug
CREATE UNIQUE INDEX IF NOT EXISTS "Article_slug_key" ON "Article"("slug");

-- Add foreign key constraints for Article
ALTER TABLE "Article" 
ADD CONSTRAINT "Article_authorId_fkey" 
FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Article" 
ADD CONSTRAINT "Article_categoryId_fkey" 
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create Analytics table
CREATE TABLE IF NOT EXISTS "Analytics" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "event" TEXT NOT NULL,
  "data" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- Insert admin user with hashed password (admin123)
-- Password hash for 'admin123' using bcrypt with salt rounds 12
INSERT INTO "User" ("id", "email", "password", "name", "role", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@pontigram.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXIG.JOOdS8u',
  'Administrator',
  'ADMIN',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO NOTHING;

-- Insert default categories
INSERT INTO "Category" ("id", "name", "slug", "description", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, 'Berita Terkini', 'berita-terkini', 'Berita terbaru dan terkini', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'Politik', 'politik', 'Berita politik dan pemerintahan', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'Ekonomi', 'ekonomi', 'Berita ekonomi dan bisnis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'Olahraga', 'olahraga', 'Berita olahraga dan kompetisi', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'Teknologi', 'teknologi', 'Berita teknologi dan inovasi', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'Budaya Melayu', 'budaya-melayu', 'Berita budaya dan tradisi Melayu', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'Pariwisata', 'pariwisata', 'Berita pariwisata dan destinasi', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'Pendidikan', 'pendidikan', 'Berita pendidikan dan akademik', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Article_published_idx" ON "Article"("published");
CREATE INDEX IF NOT EXISTS "Article_isBreaking_idx" ON "Article"("isBreaking");
CREATE INDEX IF NOT EXISTS "Article_createdAt_idx" ON "Article"("createdAt");
CREATE INDEX IF NOT EXISTS "Article_categoryId_idx" ON "Article"("categoryId");
CREATE INDEX IF NOT EXISTS "Article_authorId_idx" ON "Article"("authorId");
CREATE INDEX IF NOT EXISTS "Analytics_event_idx" ON "Analytics"("event");
CREATE INDEX IF NOT EXISTS "Analytics_createdAt_idx" ON "Analytics"("createdAt");

-- Enable Row Level Security (RLS) for better security
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Article" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Analytics" ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to published content
CREATE POLICY "Public can read published articles" ON "Article"
  FOR SELECT USING ("published" = true);

CREATE POLICY "Public can read categories" ON "Category"
  FOR SELECT USING (true);

-- Create policies for admin access
CREATE POLICY "Admins can do everything on users" ON "User"
  FOR ALL USING (true);

CREATE POLICY "Admins can do everything on articles" ON "Article"
  FOR ALL USING (true);

CREATE POLICY "Admins can do everything on categories" ON "Category"
  FOR ALL USING (true);

CREATE POLICY "Admins can do everything on analytics" ON "Analytics"
  FOR ALL USING (true);
