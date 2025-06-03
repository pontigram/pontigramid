const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateBreakingNews() {
  try {
    // Get first 3 published articles
    const articles = await prisma.article.findMany({
      where: { published: true },
      take: 3,
      orderBy: { publishedAt: 'desc' }
    })

    console.log(`Found ${articles.length} articles to update`)

    // Update them to be breaking news
    for (const article of articles) {
      await prisma.article.update({
        where: { id: article.id },
        data: { isBreakingNews: true }
      })
      console.log(`Updated article: ${article.title}`)
    }

    console.log('Breaking news articles updated successfully!')
  } catch (error) {
    console.error('Error updating breaking news:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateBreakingNews()
