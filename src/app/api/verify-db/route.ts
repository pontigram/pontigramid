import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    console.log('🔍 Starting comprehensive database verification...')

    // Test multiple connection strings
    const connectionStrings = [
      process.env.DATABASE_URL,
      process.env.DIRECT_URL,
      "postgresql://postgres.rjqnzmmzpzsvalcwitbc:121213%40PontigramOye@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
    ].filter(Boolean)

    let successfulConnection = null
    let verificationResults = {}

    for (const connectionString of connectionStrings) {
      try {
        console.log(`🔗 Testing connection: ${connectionString?.substring(0, 50)}...`)
        
        const pool = new Pool({
          connectionString: connectionString,
          ssl: {
            rejectUnauthorized: false
          }
        })

        const client = await pool.connect()

        try {
          // Test basic connection
          const timeResult = await client.query('SELECT NOW() as current_time')
          console.log('✅ Connection successful!')

          // Check tables exist
          const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('users', 'categories', 'articles', 'analytics')
            ORDER BY table_name
          `)
          const tables = tablesResult.rows.map(r => r.table_name)

          // Count records
          const counts = {}
          for (const table of tables) {
            try {
              const countResult = await client.query(`SELECT COUNT(*) as count FROM "${table}"`)
              counts[table] = parseInt(countResult.rows[0].count)
            } catch (error) {
              counts[table] = `Error: ${error.message}`
            }
          }

          // Check admin user specifically
          let adminUser = null
          let passwordTest = null
          if (tables.includes('users')) {
            try {
              const adminResult = await client.query(
                'SELECT "id", "email", "name", "role", "password" FROM "users" WHERE "email" = $1',
                ['admin@pontigram.com']
              )
              
              if (adminResult.rows.length > 0) {
                const user = adminResult.rows[0]
                adminUser = {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  role: user.role,
                  passwordLength: user.password.length,
                  passwordPrefix: user.password.substring(0, 10) + '...'
                }

                // Test password hash
                const isPasswordValid = await bcrypt.compare('admin123', user.password)
                passwordTest = {
                  isValid: isPasswordValid,
                  providedPassword: 'admin123',
                  hashInDb: user.password.substring(0, 20) + '...'
                }
              }
            } catch (error) {
              adminUser = `Error: ${error.message}`
            }
          }

          // Check all users
          let allUsers = []
          if (tables.includes('users')) {
            try {
              const usersResult = await client.query('SELECT "email", "name", "role" FROM "users"')
              allUsers = usersResult.rows
            } catch (error) {
              allUsers = [`Error: ${error.message}`]
            }
          }

          successfulConnection = connectionString?.substring(0, 50) + '...'
          verificationResults = {
            connectionString: connectionString?.substring(0, 50) + '...',
            connected: true,
            currentTime: timeResult.rows[0].current_time,
            tablesFound: tables,
            recordCounts: counts,
            adminUser: adminUser,
            passwordTest: passwordTest,
            allUsers: allUsers,
            environment: {
              nodeEnv: process.env.NODE_ENV,
              hasDbUrl: !!process.env.DATABASE_URL,
              hasDirectUrl: !!process.env.DIRECT_URL,
              dbUrlPreview: process.env.DATABASE_URL ? 
                process.env.DATABASE_URL.substring(0, 50) + '...' : 'Not set'
            }
          }

          break // Exit loop on first successful connection

        } finally {
          client.release()
          await pool.end()
        }

      } catch (error) {
        console.error(`❌ Connection failed: ${error.message}`)
        continue
      }
    }

    if (successfulConnection) {
      return NextResponse.json({
        success: true,
        message: 'Database verification completed',
        data: verificationResults
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'All database connections failed',
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasDbUrl: !!process.env.DATABASE_URL,
          hasDirectUrl: !!process.env.DIRECT_URL,
          dbUrlPreview: process.env.DATABASE_URL ? 
            process.env.DATABASE_URL.substring(0, 50) + '...' : 'Not set'
        }
      }, { status: 500 })
    }

  } catch (error) {
    console.error('💥 Verification failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database verification failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    console.log('🔧 Attempting to fix database setup...')

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })

    const client = await pool.connect()

    try {
      // Create admin user if not exists
      const adminPassword = await bcrypt.hash('admin123', 12)
      
      await client.query(`
        INSERT INTO "users" ("email", "password", "name", "role")
        VALUES ($1, $2, $3, $4)
        ON CONFLICT ("email") DO UPDATE SET
          "password" = EXCLUDED."password",
          "name" = EXCLUDED."name",
          "role" = EXCLUDED."role",
          "updatedAt" = CURRENT_TIMESTAMP
      `, ['admin@pontigram.com', adminPassword, 'Administrator', 'ADMIN'])

      // Insert categories if not exist
      const categories = [
        ['Berita Terkini', 'berita-terkini', 'Berita terbaru dan terkini'],
        ['Politik', 'politik', 'Berita politik dan pemerintahan'],
        ['Ekonomi', 'ekonomi', 'Berita ekonomi dan bisnis'],
        ['Olahraga', 'olahraga', 'Berita olahraga dan kompetisi'],
        ['Teknologi', 'teknologi', 'Berita teknologi dan inovasi'],
        ['Budaya Melayu', 'budaya-melayu', 'Berita budaya dan tradisi Melayu'],
        ['Pariwisata', 'pariwisata', 'Berita pariwisata dan destinasi'],
        ['Pendidikan', 'pendidikan', 'Berita pendidikan dan akademik']
      ]

      for (const [name, slug, description] of categories) {
        await client.query(`
          INSERT INTO "categories" ("name", "slug", "description")
          VALUES ($1, $2, $3)
          ON CONFLICT ("slug") DO UPDATE SET
            "name" = EXCLUDED."name",
            "description" = EXCLUDED."description",
            "updatedAt" = CURRENT_TIMESTAMP
        `, [name, slug, description])
      }

      return NextResponse.json({
        success: true,
        message: 'Database setup completed successfully',
        credentials: {
          email: 'admin@pontigram.com',
          password: 'admin123'
        }
      })

    } finally {
      client.release()
      await pool.end()
    }

  } catch (error) {
    console.error('💥 Database setup failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database setup failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
