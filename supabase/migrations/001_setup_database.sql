-- Setup Database for Pontigram News
-- Migration: 001_setup_database.sql

-- Drop existing tables if they exist (cleanup)
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "Article" CASCADE;
DROP TABLE IF EXISTS "Analytics" CASCADE;
DROP TABLE IF EXISTS "articles" CASCADE;
DROP TABLE IF EXISTS "analytics" CASCADE;

-- Create users table (sesuai dengan Prisma @@map("users"))
CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT,
  "role" TEXT NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create unique index for users email
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- Create categories table (sesuai dengan Prisma @@map("categories"))
CREATE TABLE IF NOT EXISTS "categories" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes for categories
CREATE UNIQUE INDEX IF NOT EXISTS "categories_name_key" ON "categories"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_key" ON "categories"("slug");

-- Create articles table (sesuai dengan Prisma @@map("articles"))
CREATE TABLE IF NOT EXISTS "articles" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "featuredImage" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "isBreakingNews" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "authorId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- Create unique index for articles slug
CREATE UNIQUE INDEX IF NOT EXISTS "articles_slug_key" ON "articles"("slug");

-- Create analytics table (sesuai dengan Prisma @@map("analytics"))
CREATE TABLE IF NOT EXISTS "analytics" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "page" TEXT NOT NULL,
  "title" TEXT,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  "referrer" TEXT,
  "sessionId" TEXT,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "articleId" TEXT,
  CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "articles" 
DROP CONSTRAINT IF EXISTS "articles_authorId_fkey";
ALTER TABLE "articles" 
ADD CONSTRAINT "articles_authorId_fkey" 
FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "articles" 
DROP CONSTRAINT IF EXISTS "articles_categoryId_fkey";
ALTER TABLE "articles" 
ADD CONSTRAINT "articles_categoryId_fkey" 
FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "analytics" 
DROP CONSTRAINT IF EXISTS "analytics_articleId_fkey";
ALTER TABLE "analytics" 
ADD CONSTRAINT "analytics_articleId_fkey" 
FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "articles_published_idx" ON "articles"("published");
CREATE INDEX IF NOT EXISTS "articles_isBreakingNews_idx" ON "articles"("isBreakingNews");
CREATE INDEX IF NOT EXISTS "articles_createdAt_idx" ON "articles"("createdAt");
CREATE INDEX IF NOT EXISTS "articles_categoryId_idx" ON "articles"("categoryId");
CREATE INDEX IF NOT EXISTS "articles_authorId_idx" ON "articles"("authorId");
CREATE INDEX IF NOT EXISTS "analytics_page_idx" ON "analytics"("page");
CREATE INDEX IF NOT EXISTS "analytics_timestamp_idx" ON "analytics"("timestamp");
CREATE INDEX IF NOT EXISTS "analytics_articleId_idx" ON "analytics"("articleId");

-- Insert admin user dengan password hash untuk 'admin123'
-- Password hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXIG.JOOdS8u
INSERT INTO "users" ("email", "password", "name", "role")
VALUES (
  'admin@pontigram.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXIG.JOOdS8u',
  'Administrator',
  'ADMIN'
) ON CONFLICT ("email") DO UPDATE SET
  "password" = EXCLUDED."password",
  "name" = EXCLUDED."name",
  "role" = EXCLUDED."role",
  "updatedAt" = CURRENT_TIMESTAMP;

-- Insert default categories
INSERT INTO "categories" ("name", "slug", "description")
VALUES 
  ('Berita Terkini', 'berita-terkini', 'Berita terbaru dan terkini'),
  ('Politik', 'politik', 'Berita politik dan pemerintahan'),
  ('Ekonomi', 'ekonomi', 'Berita ekonomi dan bisnis'),
  ('Olahraga', 'olahraga', 'Berita olahraga dan kompetisi'),
  ('Teknologi', 'teknologi', 'Berita teknologi dan inovasi'),
  ('Budaya Melayu', 'budaya-melayu', 'Berita budaya dan tradisi Melayu'),
  ('Pariwisata', 'pariwisata', 'Berita pariwisata dan destinasi'),
  ('Pendidikan', 'pendidikan', 'Berita pendidikan dan akademik')
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "updatedAt" = CURRENT_TIMESTAMP;
