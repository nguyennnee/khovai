const http = require('http');

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

function testFrontend() {
  return new Promise((resolve) => {
    log('🌐 Testing Frontend (http://localhost:3000)...', 'cyan');
    
    const req = http.get('http://localhost:3000', (res) => {
      if (res.statusCode === 200) {
        log('✅ Frontend is running on http://localhost:3000', 'green');
        resolve(true);
      } else {
        log(`❌ Frontend returned status: ${res.statusCode}`, 'red');
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      if (error.code === 'ECONNREFUSED') {
        log('❌ Frontend is not running', 'red');
        log('   Please run: npm run start:frontend', 'yellow');
      } else {
        log(`❌ Frontend error: ${error.message}`, 'red');
      }
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      log('❌ Frontend test timeout', 'red');
      req.destroy();
      resolve(false);
    });
  });
}

function testAPI() {
  return new Promise((resolve) => {
    log('🔧 Testing API (http://localhost:8000)...', 'cyan');
    
    const req = http.get('http://localhost:8000/products/', (res) => {
      if (res.statusCode === 200) {
        log('✅ API is running on http://localhost:8000', 'green');
        resolve(true);
      } else {
        log(`❌ API returned status: ${res.statusCode}`, 'red');
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      if (error.code === 'ECONNREFUSED') {
        log('❌ API is not running', 'red');
        log('   Please run: npm run start:api (requires PHP)', 'yellow');
      } else {
        log(`❌ API error: ${error.message}`, 'red');
      }
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      log('❌ API test timeout', 'red');
      req.destroy();
      resolve(false);
    });
  });
}

async function runTests() {
  log('🧪 Testing Lil Sunshine Thrift Application...\n', 'bright');
  
  const frontendOk = await testFrontend();
  const apiOk = await testAPI();
  
  log('\n📊 Test Results:', 'bright');
  log(`   Frontend: ${frontendOk ? '✅ Running' : '❌ Not running'}`, frontendOk ? 'green' : 'red');
  log(`   API: ${apiOk ? '✅ Running' : '❌ Not running'}`, apiOk ? 'green' : 'red');
  
  if (frontendOk && apiOk) {
    log('\n🎉 Both services are running!', 'green');
    log('   You can now access the application at http://localhost:3000', 'green');
  } else if (frontendOk) {
    log('\n⚠️  Frontend is running but API is not.', 'yellow');
    log('   Install PHP and run: npm run start:api', 'yellow');
  } else if (apiOk) {
    log('\n⚠️  API is running but Frontend is not.', 'yellow');
    log('   Run: npm run start:frontend', 'yellow');
  } else {
    log('\n❌ Neither service is running.', 'red');
    log('   Run: npm start (to start both services)', 'yellow');
  }
  
  log('\n📋 Available Commands:', 'bright');
  log('   npm start - Start both frontend and API', 'blue');
  log('   npm run start:frontend - Start only frontend', 'blue');
  log('   npm run start:api - Start only API (requires PHP)', 'blue');
  log('   npm test - Run connection tests', 'blue');
}

runTests();
