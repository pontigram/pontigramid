const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function testAuthenticationFinal() {
  console.log('🔐 FINAL AUTHENTICATION TEST');
  console.log('============================');

  const pool = new Pool({
    connectionString: "postgresql://postgres:121213%40PontigramOye@db.rjqnzmmzpzsvalcwitbc.supabase.co:5432/postgres",
    ssl: {
      rejectUnauthorized: false
    }
  });

  const client = await pool.connect();

  try {
    console.log('✅ Database connected successfully');

    // Test admin user authentication
    const email = 'admin@pontigram.com';
    const password = 'admin123';

    console.log(`\n🔍 Testing authentication for: ${email}`);

    // Get user from database
    const userResult = await client.query(
      'SELECT "id", "email", "password", "name", "role" FROM "users" WHERE "email" = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log('❌ FAILED: User not found');
      return false;
    }

    const user = userResult.rows[0];
    console.log('👤 User found:', {
      email: user.email,
      name: user.name,
      role: user.role,
      passwordLength: user.password.length
    });

    // Test password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`🔐 Password test: ${isPasswordValid ? '✅ VALID' : '❌ INVALID'}`);

    if (!isPasswordValid) {
      console.log('❌ AUTHENTICATION FAILED: Invalid password');
      return false;
    }

    if (user.role !== 'ADMIN') {
      console.log('❌ AUTHENTICATION FAILED: User is not admin');
      return false;
    }

    console.log('\n🎉 AUTHENTICATION SUCCESSFUL!');
    console.log('✅ Database connection: Working');
    console.log('✅ Admin user exists: Yes');
    console.log('✅ Password hash: Valid');
    console.log('✅ Admin role: Confirmed');
    
    console.log('\n📋 LOGIN CREDENTIALS VERIFIED:');
    console.log('   Email: admin@pontigram.com');
    console.log('   Password: admin123');
    console.log('   Role: ADMIN');

    return true;

  } catch (error) {
    console.error('💥 Authentication test failed:', error.message);
    return false;
  } finally {
    client.release();
    await pool.end();
  }
}

testAuthenticationFinal().then(success => {
  if (success) {
    console.log('\n🚀 READY FOR LOGIN TEST!');
    console.log('Database is properly configured and admin credentials are working.');
    console.log('The issue is with the application deployment, not the database.');
  } else {
    console.log('\n💥 AUTHENTICATION FAILED!');
    console.log('There is an issue with the database setup or credentials.');
  }
}).catch(console.error);
