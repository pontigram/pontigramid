const fetch = require('node-fetch');

async function testSupabaseAPI() {
  const SUPABASE_URL = 'https://rjqnzmmzpzsvalcwitbc.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcW56bW16cHpzdmFsY3dpdGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODkyMTUsImV4cCI6MjA2NDU2NTIxNX0.wrpXms4ue3poCtWmwBKK4Q2kDVeYA1tQhSa8Cu3c36M';
  const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcW56bW16cHpzdmFsY3dpdGJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTIxNSwiZXhwIjoyMDY0NTY1MjE1fQ.CLGatFVDBzm80j4RAwO9jQ7iZJ7LepEY9AwjOEugFc0';

  console.log('🔍 Testing Supabase REST API...');

  try {
    // Test 1: Check users table
    console.log('\n👥 Testing users table...');
    const usersResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (usersResponse.ok) {
      const users = await usersResponse.json();
      console.log('✅ Users table accessible');
      console.log(`📊 Found ${users.length} users`);
      
      const adminUser = users.find(u => u.email === 'admin@pontigram.com');
      if (adminUser) {
        console.log('👤 Admin user found:', {
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          passwordLength: adminUser.password?.length || 0
        });
      } else {
        console.log('❌ Admin user not found');
      }
    } else {
      console.log('❌ Users table not accessible:', usersResponse.status, usersResponse.statusText);
    }

    // Test 2: Check categories table
    console.log('\n📂 Testing categories table...');
    const categoriesResponse = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=*`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json();
      console.log('✅ Categories table accessible');
      console.log(`📊 Found ${categories.length} categories`);
      categories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.slug})`);
      });
    } else {
      console.log('❌ Categories table not accessible:', categoriesResponse.status, categoriesResponse.statusText);
    }

    // Test 3: Check articles table
    console.log('\n📰 Testing articles table...');
    const articlesResponse = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=*`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (articlesResponse.ok) {
      const articles = await articlesResponse.json();
      console.log('✅ Articles table accessible');
      console.log(`📊 Found ${articles.length} articles`);
    } else {
      console.log('❌ Articles table not accessible:', articlesResponse.status, articlesResponse.statusText);
    }

    // Test 4: Check analytics table
    console.log('\n📊 Testing analytics table...');
    const analyticsResponse = await fetch(`${SUPABASE_URL}/rest/v1/analytics?select=*`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (analyticsResponse.ok) {
      const analytics = await analyticsResponse.json();
      console.log('✅ Analytics table accessible');
      console.log(`📊 Found ${analytics.length} analytics records`);
    } else {
      console.log('❌ Analytics table not accessible:', analyticsResponse.status, analyticsResponse.statusText);
    }

    console.log('\n🎯 Summary:');
    console.log('- Supabase project: rjqnzmmzpzsvalcwitbc');
    console.log('- URL: https://rjqnzmmzpzsvalcwitbc.supabase.co');
    console.log('- Database connection string should be:');
    console.log('  postgresql://postgres.rjqnzmmzpzsvalcwitbc:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres');

  } catch (error) {
    console.error('💥 API test failed:', error.message);
  }
}

// Install node-fetch if not available
try {
  require('node-fetch');
  testSupabaseAPI();
} catch (error) {
  console.log('Installing node-fetch...');
  const { execSync } = require('child_process');
  execSync('npm install node-fetch@2', { stdio: 'inherit' });
  testSupabaseAPI();
}
