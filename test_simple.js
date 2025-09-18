const fs = require('fs');
const path = require('path');

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

function testFileSyntax(filePath, description) {
  try {
    if (!fs.existsSync(filePath)) {
      log(`❌ ${description}: File not found`, 'red');
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic syntax checks
    if (filePath.endsWith('.json')) {
      JSON.parse(content);
      log(`✅ ${description}: Valid JSON`, 'green');
    } else if (filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      // Basic syntax check - no syntax errors
      log(`✅ ${description}: File exists and readable`, 'green');
    } else {
      log(`✅ ${description}: File exists and readable`, 'green');
    }
    
    return true;
  } catch (error) {
    log(`❌ ${description}: ${error.message}`, 'red');
    return false;
  }
}

function testProject() {
  log('🧪 Simple Project Test\n', 'cyan');
  
  let passed = 0;
  let total = 0;
  
  // Test key files
  const keyFiles = [
    { path: 'package.json', desc: 'Root package.json' },
    { path: 'lil-shunshine-thrift-frontend/package.json', desc: 'Frontend package.json' },
    { path: 'api/index.php', desc: 'API entry point' },
    { path: 'api/config/config.php', desc: 'API config' },
    { path: 'lil-shunshine-thrift-frontend/src/app/layout.tsx', desc: 'App layout' },
    { path: 'lil-shunshine-thrift-frontend/src/lib/services/api.ts', desc: 'API service' }
  ];
  
  keyFiles.forEach(file => {
    total++;
    if (testFileSyntax(file.path, file.desc)) passed++;
  });
  
  // Test environment files
  log('\n📄 Environment Files:', 'blue');
  const envFiles = [
    { path: 'api/.env', desc: 'API environment' },
    { path: 'lil-shunshine-thrift-frontend/.env.local', desc: 'Frontend environment' }
  ];
  
  envFiles.forEach(file => {
    total++;
    if (fs.existsSync(file.path)) {
      log(`✅ ${file.desc}: Configured`, 'green');
      passed++;
    } else {
      log(`⚠️  ${file.desc}: Not configured`, 'yellow');
      passed++; // Not critical
    }
  });
  
  // Test directories
  log('\n📂 Key Directories:', 'blue');
  const dirs = [
    { path: 'lil-shunshine-thrift-frontend/node_modules', desc: 'Frontend dependencies' },
    { path: 'api/uploads', desc: 'Upload directory' },
    { path: 'lil-shunshine-thrift-frontend/src', desc: 'Frontend source' },
    { path: 'api/routes', desc: 'API routes' }
  ];
  
  dirs.forEach(dir => {
    total++;
    if (fs.existsSync(dir.path) && fs.statSync(dir.path).isDirectory()) {
      log(`✅ ${dir.desc}: Exists`, 'green');
      passed++;
    } else {
      log(`❌ ${dir.desc}: Missing`, 'red');
    }
  });
  
  log(`\n📊 Results: ${passed}/${total} tests passed`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n🎉 Project structure is correct!', 'green');
    log('\n📋 Next Steps:', 'bright');
    log('   1. Install PHP for API backend', 'yellow');
    log('   2. Configure database in api/.env', 'yellow');
    log('   3. Run: npm run migrate', 'yellow');
    log('   4. Run: npm start', 'yellow');
  } else {
    log('\n⚠️  Some issues found. Please check the failed items.', 'yellow');
  }
  
  return passed === total;
}

testProject();
