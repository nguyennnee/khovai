const axios = require('axios');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAPI() {
  const API_URL = 'http://localhost:8000';
  
  log('🧪 Testing API Connection...\n', 'cyan');
  
  const tests = [
    {
      name: 'API Health Check',
      url: `${API_URL}/products/`,
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Featured Products',
      url: `${API_URL}/products/featured`,
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Categories',
      url: `${API_URL}/products/categories`,
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Settings',
      url: `${API_URL}/settings/`,
      method: 'GET',
      expectedStatus: 200
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      log(`Testing: ${test.name}...`, 'blue');
      
      const response = await axios({
        method: test.method,
        url: test.url,
        timeout: 5000
      });
      
      if (response.status === test.expectedStatus) {
        log(`✅ ${test.name}: PASSED (${response.status})`, 'green');
        passed++;
      } else {
        log(`❌ ${test.name}: FAILED (Expected ${test.expectedStatus}, got ${response.status})`, 'red');
        failed++;
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        log(`❌ ${test.name}: FAILED (API server not running)`, 'red');
      } else if (error.response) {
        log(`❌ ${test.name}: FAILED (${error.response.status})`, 'red');
      } else {
        log(`❌ ${test.name}: FAILED (${error.message})`, 'red');
      }
      failed++;
    }
  }
  
  log(`\n📊 Test Results:`, 'bright');
  log(`   ✅ Passed: ${passed}`, 'green');
  log(`   ❌ Failed: ${failed}`, 'red');
  
  if (failed === 0) {
    log('\n🎉 All tests passed! API is working correctly.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Please check your API server.', 'yellow');
    log('   Make sure to run: npm run start:api', 'yellow');
  }
}

async function testFrontend() {
  log('\n🌐 Testing Frontend Connection...\n', 'cyan');
  
  try {
    const response = await axios.get('http://localhost:3000', { timeout: 5000 });
    log('✅ Frontend is running on http://localhost:3000', 'green');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log('❌ Frontend is not running', 'red');
      log('   Please run: npm run start:frontend', 'yellow');
    } else {
      log(`❌ Frontend error: ${error.message}`, 'red');
    }
  }
}

async function testDatabase() {
  log('\n🗄️  Testing Database Connection...\n', 'cyan');
  
  try {
    const response = await axios.get('http://localhost:8000/settings/', { timeout: 5000 });
    log('✅ Database connection is working', 'green');
  } catch (error) {
    if (error.response && error.response.status === 500) {
      log('❌ Database connection failed', 'red');
      log('   Please check your database configuration in api/.env', 'yellow');
      log('   Run: npm run migrate', 'yellow');
    } else {
      log(`❌ Database test error: ${error.message}`, 'red');
    }
  }
}

async function runAllTests() {
  log('🚀 Lil Sunshine Thrift - Connection Test\n', 'bright');
  
  await testAPI();
  await testFrontend();
  await testDatabase();
  
  log('\n📋 Summary:', 'bright');
  log('   Frontend: http://localhost:3000', 'green');
  log('   API: http://localhost:8000', 'blue');
  log('   Admin: admin@lilshunshine.com / password', 'yellow');
  
  log('\n✨ Test completed!', 'cyan');
}

// Run tests
runAllTests().catch(console.error);
