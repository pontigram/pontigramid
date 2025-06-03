import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    console.log('Starting database setup...')

    // Create a direct PostgreSQL connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })

    const client = await pool.connect()

    try {
      // Create User table
      await client.query(`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
          "email" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "name" TEXT,
          "role" TEXT NOT NULL DEFAULT 'USER',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        );
      `)

      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
      `)

      // Create Category table
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Category" (
          "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
          "name" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "description" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
        );
      `)

      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");
      `)

      // Create Article table
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Article" (
          "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
          "title" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "excerpt" TEXT,
          "featuredImage" TEXT,
          "published" BOOLEAN NOT NULL DEFAULT false,
          "isBreaking" BOOLEAN NOT NULL DEFAULT false,
          "views" INTEGER NOT NULL DEFAULT 0,
          "authorId" TEXT NOT NULL,
          "categoryId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
        );
      `)

      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Article_slug_key" ON "Article"("slug");
      `)

      // Create Analytics table
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Analytics" (
          "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
          "event" TEXT NOT NULL,
          "data" JSONB,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
        );
      `)

      console.log('Tables created successfully')

      // Check if admin user exists
      const adminCheck = await client.query(
        'SELECT * FROM "User" WHERE "email" = $1',
        ['admin@pontigram.com']
      )

      if (adminCheck.rows.length === 0) {
        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 12)
        
        await client.query(`
          INSERT INTO "User" ("email", "password", "name", "role")
          VALUES ($1, $2, $3, $4)
        `, ['admin@pontigram.com', hashedPassword, 'Administrator', 'ADMIN'])

        console.log('Admin user created')
      } else {
        console.log('Admin user already exists')
      }

      // Insert default categories
      const categories = [
        { name: 'Berita Terkini', slug: 'berita-terkini', description: 'Berita terbaru dan terkini' },
        { name: 'Politik', slug: 'politik', description: 'Berita politik dan pemerintahan' },
        { name: 'Ekonomi', slug: 'ekonomi', description: 'Berita ekonomi dan bisnis' },
        { name: 'Olahraga', slug: 'olahraga', description: 'Berita olahraga dan kompetisi' },
        { name: 'Teknologi', slug: 'teknologi', description: 'Berita teknologi dan inovasi' },
        { name: 'Budaya Melayu', slug: 'budaya-melayu', description: 'Berita budaya dan tradisi Melayu' },
        { name: 'Pariwisata', slug: 'pariwisata', description: 'Berita pariwisata dan destinasi' },
        { name: 'Pendidikan', slug: 'pendidikan', description: 'Berita pendidikan dan akademik' }
      ]

      for (const category of categories) {
        const categoryCheck = await client.query(
          'SELECT * FROM "Category" WHERE "slug" = $1',
          [category.slug]
        )

        if (categoryCheck.rows.length === 0) {
          await client.query(`
            INSERT INTO "Category" ("name", "slug", "description")
            VALUES ($1, $2, $3)
          `, [category.name, category.slug, category.description])
        }
      }

      console.log('Categories created')

      // Get counts
      const userCount = await client.query('SELECT COUNT(*) FROM "User"')
      const categoryCount = await client.query('SELECT COUNT(*) FROM "Category"')
      const articleCount = await client.query('SELECT COUNT(*) FROM "Article"')

      return NextResponse.json({
        success: true,
        message: 'Database setup completed successfully',
        data: {
          users: parseInt(userCount.rows[0].count),
          categories: parseInt(categoryCount.rows[0].count),
          articles: parseInt(articleCount.rows[0].count)
        }
      })

    } finally {
      client.release()
      await pool.end()
    }

  } catch (error) {
    console.error('Database setup failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to setup database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
