#!/usr/bin/env node

/**
 * Simple Seed Data Script for Pontigram News
 * This script seeds initial data using Prisma ORM methods
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function main() {
  const prisma = new PrismaClient()
  
  console.log('🚀 Seeding database data...')

  try {
    // Create categories
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
        await prisma.category.create({
          data: category
        })
        console.log(`✅ Category created: ${category.name}`)
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️ Category already exists: ${category.name}`)
        } else {
          throw error
        }
      }
    }

    // Create admin user
    console.log('👤 Creating admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    try {
      await prisma.user.create({
        data: {
          id: 'user_admin',
          email: 'admin@pontigram.com',
          name: 'Administrator',
          password: hashedPassword,
          role: 'ADMIN'
        }
      })
      console.log('✅ Admin user created')
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('⚠️ Admin user already exists')
      } else {
        throw error
      }
    }

    // Create sample article
    console.log('📝 Creating sample article...')
    try {
      await prisma.article.create({
        data: {
          id: 'article_welcome',
          title: 'Selamat Datang di Pontigram News',
          slug: 'selamat-datang-pontigram-news',
          content: '<p>Selamat datang di <strong>Pontigram News</strong>, portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.</p><p>Kami berkomitmen untuk menyajikan berita yang akurat, terpercaya, dan up-to-date mengenai berbagai aspek kehidupan di Kalimantan Barat, khususnya Pontianak.</p>',
          excerpt: 'Portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.',
          published: true,
          isBreakingNews: false,
          publishedAt: new Date(),
          authorId: 'user_admin',
          categoryId: 'cat_berita_terkini'
        }
      })
      console.log('✅ Sample article created')
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('⚠️ Sample article already exists')
      } else {
        throw error
      }
    }

    console.log('🎉 Database seeding completed successfully!')
    
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
