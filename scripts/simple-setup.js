#!/usr/bin/env node

/**
 * Simple Database Setup Script for Pontigram News
 * This script sets up the database with minimal data
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting simple database setup...')

  try {
    // Check database connection
    console.log('📡 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Create admin user first
    console.log('👤 Creating admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@pontigram.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN'
      },
      create: {
        email: 'admin@pontigram.com',
        name: 'Administrator',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    console.log('✅ Admin user created:', adminUser.email)

    // Create categories
    console.log('📂 Creating categories...')
    const categories = [
      { name: 'Berita Terkini', slug: 'berita-terkini', description: 'Berita terbaru dan terkini dari Pontianak dan sekitarnya' },
      { name: 'Budaya Melayu', slug: 'budaya-melayu', description: 'Budaya dan tradisi Melayu Pontianak' },
      { name: 'Pariwisata', slug: 'pariwisata', description: 'Destinasi wisata dan pariwisata Pontianak' },
      { name: 'Ekonomi', slug: 'ekonomi', description: 'Berita ekonomi dan bisnis lokal' },
      { name: 'Olahraga', slug: 'olahraga', description: 'Berita olahraga dan prestasi atlet lokal' }
    ]

    const createdCategories = []
    for (const category of categories) {
      const createdCategory = await prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category
      })
      createdCategories.push(createdCategory)
      console.log('✅ Category created:', createdCategory.name)
    }

    // Create sample article
    console.log('📝 Creating sample article...')
    const sampleArticle = {
      title: 'Selamat Datang di Pontigram News',
      slug: 'selamat-datang-pontigram-news',
      content: '<p>Selamat datang di <strong>Pontigram News</strong>, portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.</p><p>Kami berkomitmen untuk menyajikan berita yang akurat, terpercaya, dan up-to-date mengenai berbagai aspek kehidupan di Kalimantan Barat, khususnya Pontianak.</p>',
      excerpt: 'Portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.',
      published: true,
      isBreakingNews: false,
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryId: createdCategories[0].id // Berita Terkini
    }

    const article = await prisma.article.upsert({
      where: { slug: sampleArticle.slug },
      update: sampleArticle,
      create: sampleArticle
    })
    console.log('✅ Sample article created:', article.title)

    console.log('🎉 Database setup completed successfully!')
    
    // Display summary
    const userCount = await prisma.user.count()
    const categoryCount = await prisma.category.count()
    const articleCount = await prisma.article.count()
    
    console.log('\n📊 Database Summary:')
    console.log(`👥 Users: ${userCount}`)
    console.log(`📂 Categories: ${categoryCount}`)
    console.log(`📝 Articles: ${articleCount}`)

    console.log('\n🔑 Admin Login:')
    console.log(`📧 Email: admin@pontigram.com`)
    console.log(`🔒 Password: admin123`)

  } catch (error) {
    console.error('❌ Database setup failed:', error)
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
