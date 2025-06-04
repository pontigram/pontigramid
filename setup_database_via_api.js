const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  console.log('🚀 Starting database setup via direct connection...');
  
  // Try different connection strings
  const connectionStrings = [
    "postgresql://postgres.rjqnzmmzpzsvalcwitbc:121213%40PontigramOye@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
    "postgresql://postgres:121213%40PontigramOye@db.rjqnzmmzpzsvalcwitbc.supabase.co:5432/postgres"
  ];

  for (const connectionString of connectionStrings) {
    console.log(`\n🔗 Trying connection: ${connectionString.substring(0, 50)}...`);
    
    try {
      const pool = new Pool({
        connectionString: connectionString,
        ssl: {
          rejectUnauthorized: false
        }
      });

      const client = await pool.connect();

      try {
        console.log('✅ Connected successfully!');
        
        // Test connection
        const timeResult = await client.query('SELECT NOW() as current_time');
        console.log('⏰ Current time:', timeResult.rows[0].current_time);

        // Check existing tables
        console.log('\n📋 Checking existing tables...');
        const tablesResult = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          ORDER BY table_name
        `);
        console.log('📊 Existing tables:', tablesResult.rows.map(r => r.table_name));

        // Drop old tables if they exist
        console.log('\n🗑️ Cleaning up old tables...');
        await client.query('DROP TABLE IF EXISTS "User" CASCADE');
        await client.query('DROP TABLE IF EXISTS "Category" CASCADE');
        await client.query('DROP TABLE IF EXISTS "Article" CASCADE');
        await client.query('DROP TABLE IF EXISTS "Analytics" CASCADE');
        await client.query('DROP TABLE IF EXISTS "articles" CASCADE');
        await client.query('DROP TABLE IF EXISTS "analytics" CASCADE');

        // Create users table
        console.log('\n👥 Creating users table...');
        await client.query(`
          CREATE TABLE IF NOT EXISTS "users" (
            "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
            "email" TEXT NOT NULL,
            "password" TEXT NOT NULL,
            "name" TEXT,
            "role" TEXT NOT NULL DEFAULT 'USER',
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "users_pkey" PRIMARY KEY ("id")
          )
        `);
        await client.query('CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")');

        // Create categories table
        console.log('📂 Creating categories table...');
        await client.query(`
          CREATE TABLE IF NOT EXISTS "categories" (
            "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
            "name" TEXT NOT NULL,
            "slug" TEXT NOT NULL,
            "description" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
          )
        `);
        await client.query('CREATE UNIQUE INDEX IF NOT EXISTS "categories_name_key" ON "categories"("name")');
        await client.query('CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_key" ON "categories"("slug")');

        // Create articles table
        console.log('📰 Creating articles table...');
        await client.query(`
          CREATE TABLE IF NOT EXISTS "articles" (
            "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
            "title" TEXT NOT NULL,
            "slug" TEXT NOT NULL,
            "content" TEXT NOT NULL,
            "excerpt" TEXT,
            "featuredImage" TEXT,
            "published" BOOLEAN NOT NULL DEFAULT false,
            "isBreakingNews" BOOLEAN NOT NULL DEFAULT false,
            "publishedAt" TIMESTAMP(3),
            "authorId" TEXT NOT NULL,
            "categoryId" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
          )
        `);
        await client.query('CREATE UNIQUE INDEX IF NOT EXISTS "articles_slug_key" ON "articles"("slug")');

        // Create analytics table
        console.log('📊 Creating analytics table...');
        await client.query(`
          CREATE TABLE IF NOT EXISTS "analytics" (
            "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
            "page" TEXT NOT NULL,
            "title" TEXT,
            "userAgent" TEXT,
            "ipAddress" TEXT,
            "referrer" TEXT,
            "sessionId" TEXT,
            "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "articleId" TEXT,
            CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
          )
        `);

        // Add foreign key constraints
        console.log('🔗 Adding foreign key constraints...');
        try {
          await client.query(`
            ALTER TABLE "articles" 
            ADD CONSTRAINT "articles_authorId_fkey" 
            FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE
          `);
        } catch (e) {
          console.log('⚠️ Foreign key constraint already exists or failed:', e.message);
        }

        try {
          await client.query(`
            ALTER TABLE "articles" 
            ADD CONSTRAINT "articles_categoryId_fkey" 
            FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE
          `);
        } catch (e) {
          console.log('⚠️ Foreign key constraint already exists or failed:', e.message);
        }

        // Insert admin user
        console.log('\n👤 Creating admin user...');
        const adminPassword = await bcrypt.hash('admin123', 12);
        await client.query(`
          INSERT INTO "users" ("email", "password", "name", "role")
          VALUES ($1, $2, $3, $4)
          ON CONFLICT ("email") DO UPDATE SET
            "password" = EXCLUDED."password",
            "name" = EXCLUDED."name",
            "role" = EXCLUDED."role",
            "updatedAt" = CURRENT_TIMESTAMP
        `, ['admin@pontigram.com', adminPassword, 'Administrator', 'ADMIN']);

        // Insert categories
        console.log('📂 Creating categories...');
        const categories = [
          ['Berita Terkini', 'berita-terkini', 'Berita terbaru dan terkini'],
          ['Politik', 'politik', 'Berita politik dan pemerintahan'],
          ['Ekonomi', 'ekonomi', 'Berita ekonomi dan bisnis'],
          ['Olahraga', 'olahraga', 'Berita olahraga dan kompetisi'],
          ['Teknologi', 'teknologi', 'Berita teknologi dan inovasi'],
          ['Budaya Melayu', 'budaya-melayu', 'Berita budaya dan tradisi Melayu'],
          ['Pariwisata', 'pariwisata', 'Berita pariwisata dan destinasi'],
          ['Pendidikan', 'pendidikan', 'Berita pendidikan dan akademik']
        ];

        for (const [name, slug, description] of categories) {
          await client.query(`
            INSERT INTO "categories" ("name", "slug", "description")
            VALUES ($1, $2, $3)
            ON CONFLICT ("slug") DO UPDATE SET
              "name" = EXCLUDED."name",
              "description" = EXCLUDED."description",
              "updatedAt" = CURRENT_TIMESTAMP
          `, [name, slug, description]);
        }

        // Verify data
        console.log('\n✅ Verifying data...');
        const userCount = await client.query('SELECT COUNT(*) as count FROM "users"');
        const categoryCount = await client.query('SELECT COUNT(*) as count FROM "categories"');
        const adminUser = await client.query('SELECT "email", "name", "role" FROM "users" WHERE "role" = $1', ['ADMIN']);

        console.log('📊 Results:');
        console.log(`   Users: ${userCount.rows[0].count}`);
        console.log(`   Categories: ${categoryCount.rows[0].count}`);
        console.log(`   Admin user: ${adminUser.rows[0] ? adminUser.rows[0].email : 'Not found'}`);

        console.log('\n🎉 Database setup completed successfully!');
        console.log('🔐 Admin credentials:');
        console.log('   Email: admin@pontigram.com');
        console.log('   Password: admin123');

        return true;

      } finally {
        client.release();
        await pool.end();
      }

    } catch (error) {
      console.error(`❌ Connection failed: ${error.message}`);
      continue;
    }
  }

  console.error('💥 All connection attempts failed!');
  return false;
}

setupDatabase().catch(console.error);
