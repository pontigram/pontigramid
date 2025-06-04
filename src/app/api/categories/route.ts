import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'

export async function GET() {
  try {
    // Check if we're in build time or mock environment
    const isBuildTime = process.env.DATABASE_URL?.includes('mock') || !process.env.DATABASE_URL

    if (isBuildTime) {
      console.log('Build time detected, returning fallback categories')
      const fallbackCategories = [
        { id: '1', name: 'Berita Terkini', slug: 'berita-terkini', description: 'Berita terbaru dan terkini', _count: { articles: 0 } },
        { id: '2', name: 'Budaya Melayu', slug: 'budaya-melayu', description: 'Budaya dan tradisi Melayu', _count: { articles: 0 } },
        { id: '3', name: 'Pariwisata', slug: 'pariwisata', description: 'Wisata dan destinasi menarik', _count: { articles: 0 } },
        { id: '4', name: 'Ekonomi', slug: 'ekonomi', description: 'Berita ekonomi dan bisnis', _count: { articles: 0 } },
        { id: '5', name: 'Olahraga', slug: 'olahraga', description: 'Berita olahraga', _count: { articles: 0 } }
      ]
      return NextResponse.json({ categories: fallbackCategories })
    }

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Return fallback categories on error
    const fallbackCategories = [
      { id: '1', name: 'Berita Terkini', slug: 'berita-terkini', description: 'Berita terbaru dan terkini', _count: { articles: 0 } },
      { id: '2', name: 'Budaya Melayu', slug: 'budaya-melayu', description: 'Budaya dan tradisi Melayu', _count: { articles: 0 } },
      { id: '3', name: 'Pariwisata', slug: 'pariwisata', description: 'Wisata dan destinasi menarik', _count: { articles: 0 } },
      { id: '4', name: 'Ekonomi', slug: 'ekonomi', description: 'Berita ekonomi dan bisnis', _count: { articles: 0 } },
      { id: '5', name: 'Olahraga', slug: 'olahraga', description: 'Berita olahraga', _count: { articles: 0 } }
    ]
    return NextResponse.json({ categories: fallbackCategories })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { name, description } = body

    const slug = generateSlug(name)

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
