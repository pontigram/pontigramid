const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

async function ensureAdminUser() {
  console.log('🔧 Ensuring admin user exists...')
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : {
      rejectUnauthorized: false
    }
  })

  try {
    const client = await pool.connect()
    
    try {
      // Check if admin user exists
      const checkQuery = 'SELECT * FROM "users" WHERE "email" = $1'
      const checkResult = await client.query(checkQuery, ['admin@pontigram.com'])
      
      if (checkResult.rows.length > 0) {
        console.log('✅ Admin user already exists')
        return
      }
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const insertQuery = `
        INSERT INTO "users" ("id", "email", "password", "name", "role", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `
      
      const userId = 'admin-' + Date.now()
      const now = new Date()
      
      await client.query(insertQuery, [
        userId,
        'admin@pontigram.com',
        hashedPassword,
        'Administrator',
        'ADMIN',
        now,
        now
      ])
      
      console.log('✅ Admin user created successfully')
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('❌ Error ensuring admin user:', error)
  } finally {
    await pool.end()
  }
}

// Run if called directly
if (require.main === module) {
  ensureAdminUser()
}

module.exports = { ensureAdminUser }
