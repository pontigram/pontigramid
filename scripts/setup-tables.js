#!/usr/bin/env node

/**
 * Setup Tables Script for Pontigram News
 * This script creates tables using raw SQL via Prisma
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up database tables...')

  try {
    // Check database connection
    console.log('📡 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Enable UUID extension
    console.log('🔧 Enabling UUID extension...')
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)

    // Drop existing tables if they exist (for clean setup)
    console.log('🗑️ Dropping existing tables...')
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "articles" CASCADE;`)
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "categories" CASCADE;`)
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "users" CASCADE;`)

    // Create users table
    console.log('👥 Creating users table...')
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "users" (
        "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "name" TEXT,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );
    `)

    // Create categories table
    console.log('📂 Creating categories table...')
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "categories" (
        "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text,
        "name" TEXT NOT NULL UNIQUE,
        "slug" TEXT NOT NULL UNIQUE,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
      );
    `)

    // Create articles table
    console.log('📝 Creating articles table...')
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "articles" (
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
    `)

    // Create indexes
    console.log('🔍 Creating indexes...')
    await prisma.$executeRawUnsafe(`CREATE INDEX "articles_published_idx" ON "articles"("published");`)
    await prisma.$executeRawUnsafe(`CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");`)
    await prisma.$executeRawUnsafe(`CREATE INDEX "articles_categoryId_idx" ON "articles"("categoryId");`)
    await prisma.$executeRawUnsafe(`CREATE INDEX "articles_authorId_idx" ON "articles"("authorId");`)
    await prisma.$executeRawUnsafe(`CREATE INDEX "articles_slug_idx" ON "articles"("slug");`)
    await prisma.$executeRawUnsafe(`CREATE INDEX "categories_slug_idx" ON "categories"("slug");`)
    await prisma.$executeRawUnsafe(`CREATE INDEX "users_email_idx" ON "users"("email");`)

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
