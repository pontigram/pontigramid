#!/usr/bin/env node

/**
 * Direct Database Seeding Script
 * This script seeds the database using direct Prisma connection
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function seedDatabase() {
  const prisma = new PrismaClient()
  
  console.log('🌱 Starting direct database seeding...')

  try {
    // Test connection
    console.log('📡 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // 1. Create categories
    console.log('📂 Creating categories...')
    const categories = [
      { id: 'cat_berita_terkini', name: 'Berita Terkini', slug: 'berita-terkini', description: 'Berita terbaru dan terkini dari Pontianak dan sekitarnya' },
      { id: 'cat_budaya_melayu', name: 'Budaya Melayu', slug: 'budaya-melayu', description: 'Budaya dan tradisi Melayu Pontianak' },
      { id: 'cat_pariwisata', name: 'Pariwisata', slug: 'pariwisata', description: 'Destinasi wisata dan pariwisata Pontianak' },
      { id: 'cat_ekonomi', name: 'Ekonomi', slug: 'ekonomi', description: 'Berita ekonomi dan bisnis lokal' },
      { id: 'cat_olahraga', name: 'Olahraga', slug: 'olahraga', description: 'Berita olahraga dan prestasi atlet lokal' }
    ]

    for (const category of categories) {
      try {
        const created = await prisma.category.upsert({
          where: { slug: category.slug },
          update: {},
          create: category
        })
        console.log(`✅ Category: ${created.name}`)
      } catch (error) {
        console.log(`⚠️ Category ${category.name}:`, error.message)
      }
    }

    // 2. Create admin user
    console.log('👤 Creating admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    try {
      const adminUser = await prisma.user.upsert({
        where: { email: 'admin@pontigram.com' },
        update: {},
        create: {
          id: 'user_admin',
          email: 'admin@pontigram.com',
          name: 'Administrator',
          password: hashedPassword,
          role: 'ADMIN'
        }
      })
      console.log(`✅ Admin user: ${adminUser.email}`)
    } catch (error) {
      console.log(`⚠️ Admin user:`, error.message)
    }

    // 3. Create sample articles
    console.log('📝 Creating sample articles...')
    const articles = [
      {
        id: 'article_welcome',
        title: 'Selamat Datang di Pontigram News',
        slug: 'selamat-datang-pontigram-news',
        content: '<p>Selamat datang di <strong>Pontigram News</strong>, portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.</p><p>Kami berkomitmen untuk menyajikan berita yang akurat, terpercaya, dan up-to-date mengenai berbagai aspek kehidupan di Kalimantan Barat, khususnya Pontianak.</p><p>Portal ini menyajikan berita dari berbagai kategori:</p><ul><li><strong>Berita Terkini</strong> - Informasi terbaru dan terkini</li><li><strong>Budaya Melayu</strong> - Tradisi dan budaya lokal</li><li><strong>Pariwisata</strong> - Destinasi wisata menarik</li><li><strong>Ekonomi</strong> - Perkembangan ekonomi dan bisnis</li><li><strong>Olahraga</strong> - Prestasi atlet dan berita olahraga</li></ul><p>Terima kasih telah mengunjungi Pontigram News!</p>',
        excerpt: 'Portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.',
        published: true,
        isBreakingNews: false,
        publishedAt: new Date(),
        authorId: 'user_admin',
        categoryId: 'cat_berita_terkini'
      },
      {
        id: 'article_budaya_melayu',
        title: 'Kekayaan Budaya Melayu Pontianak',
        slug: 'kekayaan-budaya-melayu-pontianak',
        content: '<p>Pontianak memiliki kekayaan budaya Melayu yang sangat beragam dan menarik untuk dieksplorasi.</p><p>Dari tradisi kuliner yang khas, seni pertunjukan yang memukau, hingga arsitektur tradisional yang masih lestari, semuanya menjadi bagian tak terpisahkan dari identitas Pontianak.</p><p>Beberapa aspek budaya Melayu yang masih terjaga di Pontianak:</p><ul><li>Kuliner tradisional seperti Bubur Pedas dan Chai Kue</li><li>Seni tari tradisional Melayu</li><li>Arsitektur rumah panggung khas Melayu</li><li>Tradisi pernikahan adat Melayu</li></ul>',
        excerpt: 'Pontianak memiliki kekayaan budaya Melayu yang sangat beragam dan menarik untuk dieksplorasi.',
        published: true,
        isBreakingNews: false,
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        authorId: 'user_admin',
        categoryId: 'cat_budaya_melayu'
      },
      {
        id: 'article_pariwisata_pontianak',
        title: 'Destinasi Wisata Menarik di Pontianak',
        slug: 'destinasi-wisata-menarik-pontianak',
        content: '<p>Pontianak menawarkan berbagai destinasi wisata yang menarik untuk dikunjungi, mulai dari wisata sejarah hingga wisata alam.</p><p>Kota yang terletak tepat di garis khatulistiwa ini memiliki daya tarik tersendiri bagi wisatawan lokal maupun mancanegara.</p><p>Beberapa destinasi wisata populer di Pontianak:</p><ul><li>Tugu Khatulistiwa - Landmark terkenal Pontianak</li><li>Istana Kadriah - Peninggalan sejarah Kesultanan Pontianak</li><li>Masjid Jami Sultan Syarif Abdurrahman</li><li>Museum Provinsi Kalimantan Barat</li><li>Sungai Kapuas - Wisata sungai terpanjang di Indonesia</li></ul>',
        excerpt: 'Pontianak menawarkan berbagai destinasi wisata yang menarik untuk dikunjungi.',
        published: true,
        isBreakingNews: false,
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        authorId: 'user_admin',
        categoryId: 'cat_pariwisata'
      }
    ]

    for (const article of articles) {
      try {
        const created = await prisma.article.upsert({
          where: { slug: article.slug },
          update: {},
          create: article
        })
        console.log(`✅ Article: ${created.title}`)
      } catch (error) {
        console.log(`⚠️ Article ${article.title}:`, error.message)
      }
    }

    // 4. Display summary
    const userCount = await prisma.user.count()
    const categoryCount = await prisma.category.count()
    const articleCount = await prisma.article.count()
    
    console.log('\n📊 Database Summary:')
    console.log(`👥 Users: ${userCount}`)
    console.log(`📂 Categories: ${categoryCount}`)
    console.log(`📝 Articles: ${articleCount}`)

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
