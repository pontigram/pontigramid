#!/usr/bin/env node

/**
 * Create Tables Script for Pontigram News
 * This script creates the database tables using raw SQL
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Creating database tables...')

  try {
    // Check database connection
    console.log('📡 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Enable UUID extension
    console.log('🔧 Enabling UUID extension...')
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

    // Create users table
    console.log('👥 Creating users table...')
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "name" TEXT,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );
    `

    // Create categories table
    console.log('📂 Creating categories table...')
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "categories" (
        "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text,
        "name" TEXT NOT NULL UNIQUE,
        "slug" TEXT NOT NULL UNIQUE,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
      );
    `

    // Create articles table
    console.log('📝 Creating articles table...')
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "articles" (
        "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "content" TEXT NOT NULL,
        "excerpt" TEXT,
        "featuredImage" TEXT,
        "published" BOOLEAN NOT NULL DEFAULT false,
        "isBreakingNews" BOOLEAN NOT NULL DEFAULT false,
        "publishedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "authorId" TEXT NOT NULL,
        "categoryId" TEXT NOT NULL,
        CONSTRAINT "articles_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `

    // Create indexes
    console.log('🔍 Creating indexes...')
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "articles_published_idx" ON "articles"("published");`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "articles_publishedAt_idx" ON "articles"("publishedAt");`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "articles_categoryId_idx" ON "articles"("categoryId");`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "articles_authorId_idx" ON "articles"("authorId");`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "articles_slug_idx" ON "articles"("slug");`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories"("slug");`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");`

    // Create updated_at trigger function
    console.log('⚡ Creating trigger functions...')
    await prisma.$executeRaw`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW."updatedAt" = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `

    // Create triggers
    await prisma.$executeRaw`
      DROP TRIGGER IF EXISTS update_users_updated_at ON "users";
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `
    
    await prisma.$executeRaw`
      DROP TRIGGER IF EXISTS update_categories_updated_at ON "categories";
      CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON "categories" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `
    
    await prisma.$executeRaw`
      DROP TRIGGER IF EXISTS update_articles_updated_at ON "articles";
      CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON "articles" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `

    console.log('🎉 Database tables created successfully!')

  } catch (error) {
    console.error('❌ Table creation failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
