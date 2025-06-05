#!/usr/bin/env node

/**
 * Seed Data Script for Pontigram News
 * This script seeds initial data using raw SQL
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Seeding database data...')

  try {
    // Check database connection
    console.log('📡 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Insert initial categories
    console.log('📂 Creating categories...')
    await prisma.$executeRawUnsafe(`
      INSERT INTO "categories" ("id", "name", "slug", "description") VALUES
        ('cat_berita_terkini', 'Berita Terkini', 'berita-terkini', 'Berita terbaru dan terkini dari Pontianak dan sekitarnya'),
        ('cat_budaya_melayu', 'Budaya Melayu', 'budaya-melayu', 'Budaya dan tradisi Melayu Pontianak'),
        ('cat_pariwisata', 'Pariwisata', 'pariwisata', 'Destinasi wisata dan pariwisata Pontianak'),
        ('cat_ekonomi', 'Ekonomi', 'ekonomi', 'Berita ekonomi dan bisnis lokal'),
        ('cat_olahraga', 'Olahraga', 'olahraga', 'Berita olahraga dan prestasi atlet lokal')
      ON CONFLICT ("slug") DO NOTHING;
    `)

    // Insert admin user (password: admin123)
    console.log('👤 Creating admin user...')
    await prisma.$executeRawUnsafe(`
      INSERT INTO "users" ("id", "email", "name", "password", "role") VALUES
        ('user_admin', 'admin@pontigram.com', 'Administrator', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9S2', 'ADMIN')
      ON CONFLICT ("email") DO NOTHING;
    `)

    // Insert sample article
    console.log('📝 Creating sample article...')
    await prisma.$executeRawUnsafe(`
      INSERT INTO "articles" ("id", "title", "slug", "content", "excerpt", "published", "isBreakingNews", "publishedAt", "authorId", "categoryId") VALUES
        (
          'article_welcome',
          'Selamat Datang di Pontigram News',
          'selamat-datang-pontigram-news',
          '<p>Selamat datang di <strong>Pontigram News</strong>, portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.</p><p>Kami berkomitmen untuk menyajikan berita yang akurat, terpercaya, dan up-to-date mengenai berbagai aspek kehidupan di Kalimantan Barat, khususnya Pontianak.</p>',
          'Portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.',
          true,
          false,
          CURRENT_TIMESTAMP,
          'user_admin',
          'cat_berita_terkini'
        )
      ON CONFLICT ("slug") DO NOTHING;
    `)

    console.log('🎉 Database seeding completed successfully!')
    
    // Display summary using raw SQL
    console.log('\n📊 Database Summary:')
    const userCount = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "users";`)
    const categoryCount = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "categories";`)
    const articleCount = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "articles";`)
    
    console.log(`👥 Users: ${userCount[0].count}`)
    console.log(`📂 Categories: ${categoryCount[0].count}`)
    console.log(`📝 Articles: ${articleCount[0].count}`)

    console.log('\n🔑 Admin Login:')
    console.log(`📧 Email: admin@pontigram.com`)
    console.log(`🔒 Password: admin123`)

  } catch (error) {
    console.error('❌ Database seeding failed:', error)
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
