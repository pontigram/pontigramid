import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    console.log('Starting database initialization...')

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { email: process.env.ADMIN_EMAIL || 'admin@pontigram.com' }
    })

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Database already initialized',
        data: {
          adminExists: true,
          categoriesCount: await prisma.category.count(),
          articlesCount: await prisma.article.count()
        }
      })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12)
    
    const admin = await prisma.user.create({
      data: {
        email: process.env.ADMIN_EMAIL || 'admin@pontigram.com',
        password: hashedPassword,
        name: 'Administrator',
        role: 'ADMIN'
      }
    })

    // Create default categories
    const categories = [
      { name: 'Berita Terkini', slug: 'berita-terkini', description: 'Berita terbaru dan terkini' },
      { name: 'Budaya Melayu', slug: 'budaya-melayu', description: 'Berita seputar budaya Melayu' },
      { name: 'Pariwisata', slug: 'pariwisata', description: 'Informasi pariwisata dan destinasi' },
      { name: 'Ekonomi & Bisnis', slug: 'ekonomi-bisnis', description: 'Berita ekonomi dan bisnis' },
      { name: 'Olahraga', slug: 'olahraga', description: 'Berita olahraga terkini' }
    ]

    const createdCategories = await Promise.all(
      categories.map(category => 
        prisma.category.create({ data: category })
      )
    )

    // Create sample article
    const sampleArticle = await prisma.article.create({
      data: {
        title: 'Selamat Datang di Portal Berita Pontigram',
        slug: 'selamat-datang-portal-berita-pontigram',
        content: `
          <h2>Portal Berita Pontigram Resmi Diluncurkan</h2>
          
          <p>Kami dengan bangga memperkenalkan Portal Berita Pontigram, platform berita digital yang menyajikan informasi terkini seputar Pontianak dan sekitarnya.</p>
          
          <h3>Fitur Unggulan:</h3>
          <ul>
            <li>Berita terkini dan terpercaya</li>
            <li>Kategori berita yang lengkap</li>
            <li>Interface yang user-friendly</li>
            <li>Optimized untuk mobile dan desktop</li>
          </ul>
          
          <p>Portal ini akan menjadi sumber informasi utama untuk masyarakat Pontianak dalam mengikuti perkembangan berita lokal, budaya, pariwisata, ekonomi, dan olahraga.</p>
          
          <p>Terima kasih atas kunjungan Anda. Selamat menjelajahi Portal Berita Pontigram!</p>
        `,
        excerpt: 'Portal Berita Pontigram resmi diluncurkan sebagai platform berita digital untuk masyarakat Pontianak dan sekitarnya.',
        published: true,
        publishedAt: new Date(),
        authorId: admin.id,
        categoryId: createdCategories[0].id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      data: {
        adminCreated: true,
        categoriesCreated: createdCategories.length,
        sampleArticleCreated: true,
        adminEmail: admin.email
      }
    })

  } catch (error) {
    console.error('Database initialization error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to initialize database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
