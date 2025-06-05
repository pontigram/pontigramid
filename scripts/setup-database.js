#!/usr/bin/env node

/**
 * Database Setup Script for Pontigram News
 * This script sets up the database schema and seed data
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting database setup...')

  try {
    // Check database connection
    console.log('📡 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Create admin user
    console.log('👤 Creating admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
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
    console.log('✅ Admin user created:', adminUser.email)

    // Create categories
    console.log('📂 Creating categories...')
    const categories = [
      { id: 'cat_berita_terkini', name: 'Berita Terkini', slug: 'berita-terkini', description: 'Berita terbaru dan terkini dari Pontianak dan sekitarnya' },
      { id: 'cat_budaya_melayu', name: 'Budaya Melayu', slug: 'budaya-melayu', description: 'Budaya dan tradisi Melayu Pontianak' },
      { id: 'cat_pariwisata', name: 'Pariwisata', slug: 'pariwisata', description: 'Destinasi wisata dan pariwisata Pontianak' },
      { id: 'cat_ekonomi', name: 'Ekonomi', slug: 'ekonomi', description: 'Berita ekonomi dan bisnis lokal' },
      { id: 'cat_olahraga', name: 'Olahraga', slug: 'olahraga', description: 'Berita olahraga dan prestasi atlet lokal' },
      { id: 'cat_pendidikan', name: 'Pendidikan', slug: 'pendidikan', description: 'Berita pendidikan dan dunia akademis' },
      { id: 'cat_kesehatan', name: 'Kesehatan', slug: 'kesehatan', description: 'Informasi kesehatan dan medis' },
      { id: 'cat_teknologi', name: 'Teknologi', slug: 'teknologi', description: 'Perkembangan teknologi dan digital' }
    ]

    for (const category of categories) {
      const createdCategory = await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category
      })
      console.log('✅ Category created:', createdCategory.name)
    }

    // Create sample articles
    console.log('📝 Creating sample articles...')
    const articles = [
      {
        id: 'article_welcome',
        title: 'Selamat Datang di Pontigram News',
        slug: 'selamat-datang-pontigram-news',
        content: `<p>Selamat datang di <strong>Pontigram News</strong>, portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.</p>

<p>Kami berkomitmen untuk menyajikan berita yang akurat, terpercaya, dan up-to-date mengenai berbagai aspek kehidupan di Kalimantan Barat, khususnya Pontianak.</p>

<h3>Kategori Berita Kami:</h3>
<ul>
<li><strong>Berita Terkini</strong> - Update terbaru dari berbagai sektor</li>
<li><strong>Budaya Melayu</strong> - Pelestarian dan pengembangan budaya lokal</li>
<li><strong>Pariwisata</strong> - Destinasi wisata menarik di Kalimantan Barat</li>
<li><strong>Ekonomi</strong> - Perkembangan ekonomi dan bisnis lokal</li>
<li><strong>Olahraga</strong> - Prestasi atlet dan event olahraga</li>
</ul>

<p>Terima kasih telah mempercayai Pontigram News sebagai sumber informasi Anda.</p>`,
        excerpt: 'Portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya. Kami menyajikan berita akurat dan up-to-date.',
        published: true,
        isBreakingNews: false,
        publishedAt: new Date(),
        authorId: 'user_admin',
        categoryId: 'cat_berita_terkini'
      },
      {
        id: 'article_budaya_melayu',
        title: 'Kekayaan Budaya Melayu Pontianak yang Perlu Dilestarikan',
        slug: 'kekayaan-budaya-melayu-pontianak',
        content: `<p>Pontianak sebagai ibu kota Kalimantan Barat memiliki <strong>kekayaan budaya Melayu</strong> yang sangat beragam dan perlu dilestarikan untuk generasi mendatang.</p>

<h3>Tradisi yang Masih Lestari:</h3>
<ul>
<li><strong>Tari Zapin</strong> - Tarian tradisional yang menggambarkan keanggunan budaya Melayu</li>
<li><strong>Musik Gambus</strong> - Alat musik tradisional yang masih dimainkan</li>
<li><strong>Kuliner Khas</strong> - Makanan tradisional seperti Bubur Pedas dan Chai Kwe</li>
<li><strong>Arsitektur Rumah Melayu</strong> - Rumah panggung dengan ciri khas tersendiri</li>
</ul>

<p>Pelestarian budaya ini menjadi tanggung jawab bersama untuk mempertahankan identitas lokal di tengah arus modernisasi.</p>`,
        excerpt: 'Pontianak memiliki kekayaan budaya Melayu yang sangat beragam, dari tarian, musik, kuliner, hingga arsitektur tradisional.',
        published: true,
        isBreakingNews: false,
        publishedAt: new Date(Date.now() - 3600000), // 1 hour ago
        authorId: 'user_admin',
        categoryId: 'cat_budaya_melayu'
      },
      {
        id: 'article_pariwisata',
        title: 'Destinasi Wisata Menarik di Pontianak yang Wajib Dikunjungi',
        slug: 'destinasi-wisata-menarik-pontianak',
        content: `<p>Pontianak menawarkan berbagai <strong>destinasi wisata menarik</strong> yang memadukan keindahan alam, sejarah, dan budaya lokal.</p>

<h3>Tempat Wisata Populer:</h3>
<ul>
<li><strong>Tugu Khatulistiwa</strong> - Landmark terkenal yang menandai garis khatulistiwa</li>
<li><strong>Sungai Kapuas</strong> - Sungai terpanjang di Indonesia dengan pemandangan menawan</li>
<li><strong>Masjid Jami Sultan Syarif Abdurrahman</strong> - Masjid bersejarah dengan arsitektur indah</li>
<li><strong>Museum Provinsi Kalimantan Barat</strong> - Koleksi sejarah dan budaya daerah</li>
<li><strong>Kampung Beting</strong> - Wisata kuliner dan budaya tepi sungai</li>
</ul>

<p>Setiap destinasi menawarkan pengalaman unik yang menggambarkan kekayaan alam dan budaya Kalimantan Barat.</p>`,
        excerpt: 'Pontianak menawarkan destinasi wisata menarik yang memadukan keindahan alam, sejarah, dan budaya lokal yang wajib dikunjungi.',
        published: true,
        isBreakingNews: false,
        publishedAt: new Date(Date.now() - 7200000), // 2 hours ago
        authorId: 'user_admin',
        categoryId: 'cat_pariwisata'
      }
    ]

    for (const article of articles) {
      const createdArticle = await prisma.article.upsert({
        where: { slug: article.slug },
        update: {},
        create: article
      })
      console.log('✅ Article created:', createdArticle.title)
    }

    console.log('🎉 Database setup completed successfully!')
    
    // Display summary
    const userCount = await prisma.user.count()
    const categoryCount = await prisma.category.count()
    const articleCount = await prisma.article.count()
    
    console.log('\n📊 Database Summary:')
    console.log(`👥 Users: ${userCount}`)
    console.log(`📂 Categories: ${categoryCount}`)
    console.log(`📝 Articles: ${articleCount}`)

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
