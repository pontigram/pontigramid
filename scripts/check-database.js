const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Checking database status...')
    
    // Check articles
    const articleCount = await prisma.article.count()
    console.log(`📰 Articles: ${articleCount}`)
    
    if (articleCount > 0) {
      const articles = await prisma.article.findMany({
        take: 3,
        select: {
          id: true,
          title: true,
          published: true,
          publishedAt: true
        }
      })
      console.log('Sample articles:')
      articles.forEach(article => {
        console.log(`- ${article.title} (Published: ${article.published})`)
      })
    }
    
    // Check categories
    const categoryCount = await prisma.category.count()
    console.log(`📂 Categories: ${categoryCount}`)
    
    if (categoryCount > 0) {
      const categories = await prisma.category.findMany({
        select: {
          name: true,
          slug: true
        }
      })
      console.log('Categories:')
      categories.forEach(cat => {
        console.log(`- ${cat.name} (${cat.slug})`)
      })
    }
    
    // Check users
    const userCount = await prisma.user.count()
    console.log(`👤 Users: ${userCount}`)
    
    if (articleCount === 0) {
      console.log('\n⚠️  Database is empty! You need to:')
      console.log('1. Create categories')
      console.log('2. Create articles')
      console.log('3. Or run the seed script')
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
