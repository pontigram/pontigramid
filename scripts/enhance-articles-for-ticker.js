const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function enhanceArticlesForTicker() {
  try {
    // Get all articles
    const articles = await prisma.article.findMany({
      include: {
        category: true
      }
    })

    console.log(`Found ${articles.length} articles to enhance`)

    // Sample excerpts and featured images
    const sampleExcerpts = [
      "Berita terkini yang memberikan informasi penting dan terpercaya untuk masyarakat Indonesia.",
      "Perkembangan terbaru dalam dunia teknologi dan inovasi yang mempengaruhi kehidupan sehari-hari.",
      "Analisis mendalam tentang situasi ekonomi dan bisnis yang sedang berkembang di Indonesia.",
      "Informasi kesehatan dan gaya hidup yang bermanfaat untuk meningkatkan kualitas hidup.",
      "Update terbaru dari dunia olahraga dan prestasi atlet Indonesia di kancah internasional."
    ]

    const sampleImages = [
      "/images/news-1.jpg",
      "/images/news-2.jpg", 
      "/images/news-3.jpg",
      "/images/news-4.jpg",
      "/images/news-5.jpg"
    ]

    // Update articles with excerpts and featured images
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i]
      const excerpt = sampleExcerpts[i % sampleExcerpts.length]
      const featuredImage = sampleImages[i % sampleImages.length]
      
      await prisma.article.update({
        where: { id: article.id },
        data: {
          excerpt: excerpt,
          featuredImage: featuredImage,
          publishedAt: article.published ? (article.publishedAt || new Date()) : null
        }
      })

      console.log(`Enhanced article: ${article.title}`)
    }

    // Set some articles as breaking news with different priorities
    const publishedArticles = articles.filter(a => a.published)
    
    if (publishedArticles.length >= 3) {
      // Set first 2 as breaking news
      await prisma.article.update({
        where: { id: publishedArticles[0].id },
        data: { isBreakingNews: true }
      })
      
      await prisma.article.update({
        where: { id: publishedArticles[1].id },
        data: { isBreakingNews: true }
      })

      console.log('Set 2 articles as breaking news')
    }

    console.log('Articles enhanced successfully for ticker testing!')
  } catch (error) {
    console.error('Error enhancing articles:', error)
  } finally {
    await prisma.$disconnect()
  }
}

enhanceArticlesForTicker()
