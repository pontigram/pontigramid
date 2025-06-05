#!/usr/bin/env node

/**
 * Seed Database via API Endpoints
 * This script seeds the database using the deployed API endpoints
 */

const BASE_URL = 'https://pontigram-news-inwwfcrs4-andiks-projects.vercel.app'

async function seedDatabase() {
  console.log('🌱 Starting database seeding via API...')

  try {
    // 1. Create categories via API
    console.log('📂 Creating categories...')
    const categories = [
      { name: 'Berita Terkini', description: 'Berita terbaru dan terkini dari Pontianak dan sekitarnya' },
      { name: 'Budaya Melayu', description: 'Budaya dan tradisi Melayu Pontianak' },
      { name: 'Pariwisata', description: 'Destinasi wisata dan pariwisata Pontianak' },
      { name: 'Ekonomi', description: 'Berita ekonomi dan bisnis lokal' },
      { name: 'Olahraga', description: 'Berita olahraga dan prestasi atlet lokal' }
    ]

    const createdCategories = []
    for (const category of categories) {
      try {
        const response = await fetch(`${BASE_URL}/api/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer admin-localStorage-auth'
          },
          body: JSON.stringify(category)
        })

        if (response.ok) {
          const created = await response.json()
          createdCategories.push(created)
          console.log(`✅ Category created: ${created.name}`)
        } else {
          const error = await response.text()
          console.log(`⚠️ Category creation failed: ${category.name} - ${error}`)
        }
      } catch (error) {
        console.log(`❌ Error creating category ${category.name}:`, error.message)
      }
    }

    // 2. Get categories to find IDs
    console.log('\n📋 Fetching created categories...')
    const categoriesResponse = await fetch(`${BASE_URL}/api/categories`)
    const categoriesData = await categoriesResponse.json()
    const availableCategories = categoriesData.categories || []
    
    console.log(`Found ${availableCategories.length} categories`)
    availableCategories.forEach(cat => console.log(`- ${cat.name} (${cat.id})`))

    if (availableCategories.length === 0) {
      console.log('❌ No categories found. Cannot create articles.')
      return
    }

    // 3. Create sample articles
    console.log('\n📝 Creating sample articles...')
    const articles = [
      {
        title: 'Selamat Datang di Pontigram News',
        content: '<p>Selamat datang di <strong>Pontigram News</strong>, portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.</p><p>Kami berkomitmen untuk menyajikan berita yang akurat, terpercaya, dan up-to-date mengenai berbagai aspek kehidupan di Kalimantan Barat, khususnya Pontianak.</p>',
        excerpt: 'Portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.',
        published: true,
        isBreakingNews: false,
        categoryId: availableCategories.find(c => c.slug === 'berita-terkini')?.id || availableCategories[0].id
      },
      {
        title: 'Kekayaan Budaya Melayu Pontianak',
        content: '<p>Pontianak memiliki kekayaan budaya Melayu yang sangat beragam dan menarik untuk dieksplorasi.</p><p>Dari tradisi kuliner yang khas, seni pertunjukan yang memukau, hingga arsitektur tradisional yang masih lestari, semuanya menjadi bagian tak terpisahkan dari identitas Pontianak.</p>',
        excerpt: 'Pontianak memiliki kekayaan budaya Melayu yang sangat beragam dan menarik untuk dieksplorasi.',
        published: true,
        isBreakingNews: false,
        categoryId: availableCategories.find(c => c.slug === 'budaya-melayu')?.id || availableCategories[1]?.id || availableCategories[0].id
      },
      {
        title: 'Destinasi Wisata Menarik di Pontianak',
        content: '<p>Pontianak menawarkan berbagai destinasi wisata yang menarik untuk dikunjungi, mulai dari wisata sejarah hingga wisata alam.</p><p>Kota yang terletak tepat di garis khatulistiwa ini memiliki daya tarik tersendiri bagi wisatawan lokal maupun mancanegara.</p>',
        excerpt: 'Pontianak menawarkan berbagai destinasi wisata yang menarik untuk dikunjungi.',
        published: true,
        isBreakingNews: false,
        categoryId: availableCategories.find(c => c.slug === 'pariwisata')?.id || availableCategories[2]?.id || availableCategories[0].id
      }
    ]

    for (const article of articles) {
      try {
        const response = await fetch(`${BASE_URL}/api/articles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer admin-localStorage-auth'
          },
          body: JSON.stringify(article)
        })

        if (response.ok) {
          const created = await response.json()
          console.log(`✅ Article created: ${created.title}`)
        } else {
          const error = await response.text()
          console.log(`⚠️ Article creation failed: ${article.title} - ${error}`)
        }
      } catch (error) {
        console.log(`❌ Error creating article ${article.title}:`, error.message)
      }
    }

    // 4. Final verification
    console.log('\n🔍 Final verification...')
    const finalCategoriesResponse = await fetch(`${BASE_URL}/api/categories`)
    const finalCategoriesData = await finalCategoriesResponse.json()
    
    const finalArticlesResponse = await fetch(`${BASE_URL}/api/articles`)
    const finalArticlesData = await finalArticlesResponse.json()

    console.log('\n📊 Database Summary:')
    console.log(`👥 Categories: ${finalCategoriesData.categories?.length || 0}`)
    console.log(`📝 Articles: ${finalArticlesData.articles?.length || 0}`)

    console.log('\n🎉 Database seeding completed!')
    console.log('\n🔑 Admin Login:')
    console.log('📧 Email: admin@pontigram.com')
    console.log('🔒 Password: admin123')

  } catch (error) {
    console.error('❌ Database seeding failed:', error)
  }
}

seedDatabase()
