#!/usr/bin/env node

/**
 * Raw SQL Seeding Script
 * This script seeds the database using raw SQL to avoid prepared statement conflicts
 */

const { PrismaClient } = require('@prisma/client')

async function seedDatabase() {
  const prisma = new PrismaClient()
  
  console.log('🌱 Starting raw SQL database seeding...')

  try {
    // Test connection
    console.log('📡 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // 1. Insert categories using raw SQL
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
    console.log('✅ Categories created')

    // 2. Insert admin user using raw SQL
    console.log('👤 Creating admin user...')
    await prisma.$executeRawUnsafe(`
      INSERT INTO "users" ("id", "email", "name", "password", "role") VALUES
        ('user_admin', 'admin@pontigram.com', 'Administrator', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9S2', 'ADMIN')
      ON CONFLICT ("email") DO NOTHING;
    `)
    console.log('✅ Admin user created')

    // 3. Insert sample articles using raw SQL
    console.log('📝 Creating sample articles...')
    await prisma.$executeRawUnsafe(`
      INSERT INTO "articles" ("id", "title", "slug", "content", "excerpt", "published", "isBreakingNews", "publishedAt", "authorId", "categoryId") VALUES
        (
          'article_welcome',
          'Selamat Datang di Pontigram News',
          'selamat-datang-pontigram-news',
          '<p>Selamat datang di <strong>Pontigram News</strong>, portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.</p><p>Kami berkomitmen untuk menyajikan berita yang akurat, terpercaya, dan up-to-date mengenai berbagai aspek kehidupan di Kalimantan Barat, khususnya Pontianak.</p><p>Portal ini menyajikan berita dari berbagai kategori:</p><ul><li><strong>Berita Terkini</strong> - Informasi terbaru dan terkini</li><li><strong>Budaya Melayu</strong> - Tradisi dan budaya lokal</li><li><strong>Pariwisata</strong> - Destinasi wisata menarik</li><li><strong>Ekonomi</strong> - Perkembangan ekonomi dan bisnis</li><li><strong>Olahraga</strong> - Prestasi atlet dan berita olahraga</li></ul><p>Terima kasih telah mengunjungi Pontigram News!</p>',
          'Portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.',
          true,
          false,
          CURRENT_TIMESTAMP,
          'user_admin',
          'cat_berita_terkini'
        ),
        (
          'article_budaya_melayu',
          'Kekayaan Budaya Melayu Pontianak',
          'kekayaan-budaya-melayu-pontianak',
          '<p>Pontianak memiliki kekayaan budaya Melayu yang sangat beragam dan menarik untuk dieksplorasi.</p><p>Dari tradisi kuliner yang khas, seni pertunjukan yang memukau, hingga arsitektur tradisional yang masih lestari, semuanya menjadi bagian tak terpisahkan dari identitas Pontianak.</p><p>Beberapa aspek budaya Melayu yang masih terjaga di Pontianak:</p><ul><li>Kuliner tradisional seperti Bubur Pedas dan Chai Kue</li><li>Seni tari tradisional Melayu</li><li>Arsitektur rumah panggung khas Melayu</li><li>Tradisi pernikahan adat Melayu</li></ul>',
          'Pontianak memiliki kekayaan budaya Melayu yang sangat beragam dan menarik untuk dieksplorasi.',
          true,
          false,
          CURRENT_TIMESTAMP - INTERVAL ''2 hours'',
          'user_admin',
          'cat_budaya_melayu'
        ),
        (
          'article_pariwisata_pontianak',
          'Destinasi Wisata Menarik di Pontianak',
          'destinasi-wisata-menarik-pontianak',
          '<p>Pontianak menawarkan berbagai destinasi wisata yang menarik untuk dikunjungi, mulai dari wisata sejarah hingga wisata alam.</p><p>Kota yang terletak tepat di garis khatulistiwa ini memiliki daya tarik tersendiri bagi wisatawan lokal maupun mancanegara.</p><p>Beberapa destinasi wisata populer di Pontianak:</p><ul><li>Tugu Khatulistiwa - Landmark terkenal Pontianak</li><li>Istana Kadriah - Peninggalan sejarah Kesultanan Pontianak</li><li>Masjid Jami Sultan Syarif Abdurrahman</li><li>Museum Provinsi Kalimantan Barat</li><li>Sungai Kapuas - Wisata sungai terpanjang di Indonesia</li></ul>',
          'Pontianak menawarkan berbagai destinasi wisata yang menarik untuk dikunjungi.',
          true,
          false,
          CURRENT_TIMESTAMP - INTERVAL ''4 hours'',
          'user_admin',
          'cat_pariwisata'
        )
      ON CONFLICT ("slug") DO NOTHING;
    `)
    console.log('✅ Sample articles created')

    // 4. Display summary using raw SQL
    const userCount = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "users";`)
    const categoryCount = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "categories";`)
    const articleCount = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "articles";`)
    
    console.log('\n📊 Database Summary:')
    console.log(`👥 Users: ${userCount[0].count}`)
    console.log(`📂 Categories: ${categoryCount[0].count}`)
    console.log(`📝 Articles: ${articleCount[0].count}`)

    console.log('\n🎉 Database seeding completed!')
    console.log('\n🔑 Admin Login:')
    console.log('📧 Email: admin@pontigram.com')
    console.log('🔒 Password: admin123')

  } catch (error) {
    console.error('❌ Database seeding failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
