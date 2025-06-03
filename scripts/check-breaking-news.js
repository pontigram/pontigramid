const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkBreakingNews() {
  try {
    // Check articles with isBreakingNews = true
    const breakingNews = await prisma.article.findMany({
      where: { 
        isBreakingNews: true,
        published: true 
      },
      select: {
        id: true,
        title: true,
        isBreakingNews: true,
        published: true,
        publishedAt: true
      }
    })

    console.log('Breaking news articles:', breakingNews.length)
    breakingNews.forEach(article => {
      console.log(`- ${article.title} (Breaking: ${article.isBreakingNews}, Published: ${article.published}, PublishedAt: ${article.publishedAt})`)
    })

    // Check all articles to see isBreakingNews field
    const allArticles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        isBreakingNews: true,
        published: true
      },
      take: 5
    })

    console.log('\nFirst 5 articles:')
    allArticles.forEach(article => {
      console.log(`- ${article.title} (Breaking: ${article.isBreakingNews}, Published: ${article.published})`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkBreakingNews()
