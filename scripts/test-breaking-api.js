const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testBreakingAPI() {
  try {
    // Simulate the API query
    const where = {
      isBreakingNews: true,
      published: true
    }

    console.log('Where clause:', where)

    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: { name: true, email: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 5
    })

    console.log(`Found ${articles.length} breaking news articles`)
    articles.forEach(article => {
      console.log(`- ${article.title}`)
      console.log(`  Category: ${article.category.name}`)
      console.log(`  Published: ${article.publishedAt}`)
      console.log(`  Breaking: ${article.isBreakingNews}`)
      console.log('')
    })

  } catch (error) {
    console.error('Error in test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testBreakingAPI()
