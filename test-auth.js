const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function testAuth() {
  const pool = new Pool({
    connectionString: "postgresql://postgres.rjqnzmmzpzsvalcwitbc:121213%40PontigramOye@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
    ssl: {
      rejectUnauthorized: false
    }
  });

  const client = await pool.connect();

  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    const timeResult = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database connected at:', timeResult.rows[0].current_time);

    // Check tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'categories', 'articles', 'analytics')
    `);
    console.log('📋 Tables found:', tablesResult.rows.map(r => r.table_name));

    // Check admin user
    const userResult = await client.query(
      'SELECT "id", "email", "password", "name", "role" FROM "users" WHERE "email" = $1',
      ['admin@pontigram.com']
    );

    if (userResult.rows.length === 0) {
      console.log('❌ Admin user not found!');
      return;
    }

    const user = userResult.rows[0];
    console.log('👤 Admin user found:', {
      email: user.email,
      name: user.name,
      role: user.role,
      passwordLength: user.password.length,
      passwordPrefix: user.password.substring(0, 10) + '...'
    });

    // Test password
    const testPassword = 'admin123';
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);
    
    console.log('🔐 Password test result:', isPasswordValid ? '✅ VALID' : '❌ INVALID');

    if (isPasswordValid) {
      console.log('🎉 AUTHENTICATION TEST PASSED!');
      console.log('📝 Login credentials are working:');
      console.log('   Email: admin@pontigram.com');
      console.log('   Password: admin123');
    } else {
      console.log('💥 AUTHENTICATION TEST FAILED!');
      console.log('🔧 Need to reset password hash...');
      
      // Generate new hash
      const newHash = await bcrypt.hash('admin123', 12);
      console.log('🔑 New password hash:', newHash);
      
      // Update password
      await client.query(
        'UPDATE "users" SET "password" = $1 WHERE "email" = $2',
        [newHash, 'admin@pontigram.com']
      );
      console.log('✅ Password updated successfully!');
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

testAuth().catch(console.error);
