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

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}: ${filePath}`, 'green');
    return true;
  } else {
    log(`❌ ${description}: ${filePath} - NOT FOUND`, 'red');
    return false;
  }
}

function checkDirectory(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    log(`✅ ${description}: ${dirPath}`, 'green');
    return true;
  } else {
    log(`❌ ${description}: ${dirPath} - NOT FOUND`, 'red');
    return false;
  }
}

function testProjectStructure() {
  log('🧪 Testing Project Structure...\n', 'cyan');
  
  let passed = 0;
  let total = 0;
  
  // Root files
  const rootFiles = [
    { path: 'package.json', desc: 'Root package.json' },
    { path: 'README.md', desc: 'Main README' },
    { path: 'QUICKSTART.md', desc: 'Quick start guide' },
    { path: 'start_fullstack.js', desc: 'Full stack startup script' },
    { path: 'setup_fullstack.js', desc: 'Setup script' },
    { path: 'test_connection.js', desc: 'Connection test script' },
    { path: '.gitignore', desc: 'Git ignore file' }
  ];
  
  log('📁 Root Files:', 'blue');
  rootFiles.forEach(file => {
    total++;
    if (checkFile(file.path, file.desc)) passed++;
  });
  
  // API structure
  log('\n🔧 API Structure:', 'blue');
  const apiFiles = [
    { path: 'api/index.php', desc: 'API entry point' },
    { path: 'api/config/config.php', desc: 'API config' },
    { path: 'api/config/database.php', desc: 'Database config' },
    { path: 'api/database/schema.sql', desc: 'Database schema' },
    { path: 'api/database/migrate.php', desc: 'Migration script' },
    { path: 'api/env.example', desc: 'Environment template' },
    { path: 'api/start_api.php', desc: 'API startup script' },
    { path: 'api/.htaccess', desc: 'Apache config' },
    { path: 'api/composer.json', desc: 'Composer config' }
  ];
  
  apiFiles.forEach(file => {
    total++;
    if (checkFile(file.path, file.desc)) passed++;
  });
  
  // API routes
  log('\n🛣️  API Routes:', 'blue');
  const routeFiles = [
    { path: 'api/routes/auth.php', desc: 'Authentication routes' },
    { path: 'api/routes/products.php', desc: 'Products routes' },
    { path: 'api/routes/cart.php', desc: 'Cart routes' },
    { path: 'api/routes/orders.php', desc: 'Orders routes' },
    { path: 'api/routes/users.php', desc: 'Users routes' },
    { path: 'api/routes/blog.php', desc: 'Blog routes' },
    { path: 'api/routes/notifications.php', desc: 'Notifications routes' },
    { path: 'api/routes/settings.php', desc: 'Settings routes' }
  ];
  
  routeFiles.forEach(file => {
    total++;
    if (checkFile(file.path, file.desc)) passed++;
  });
  
  // API utils
  log('\n🔨 API Utils:', 'blue');
  const utilFiles = [
    { path: 'api/utils/response.php', desc: 'Response utilities' },
    { path: 'api/utils/auth.php', desc: 'Auth utilities' },
    { path: 'api/utils/jwt.php', desc: 'JWT implementation' },
    { path: 'api/utils/validation.php', desc: 'Validation utilities' }
  ];
  
  utilFiles.forEach(file => {
    total++;
    if (checkFile(file.path, file.desc)) passed++;
  });
  
  // Frontend structure
  log('\n🌐 Frontend Structure:', 'blue');
  const frontendFiles = [
    { path: 'lil-shunshine-thrift-frontend/package.json', desc: 'Frontend package.json' },
    { path: 'lil-shunshine-thrift-frontend/next.config.ts', desc: 'Next.js config' },
    { path: 'lil-shunshine-thrift-frontend/tailwind.config.ts', desc: 'Tailwind config' },
    { path: 'lil-shunshine-thrift-frontend/tsconfig.json', desc: 'TypeScript config' },
    { path: 'lil-shunshine-thrift-frontend/env.local.example', desc: 'Frontend env template' }
  ];
  
  frontendFiles.forEach(file => {
    total++;
    if (checkFile(file.path, file.desc)) passed++;
  });
  
  // Frontend source
  log('\n📱 Frontend Source:', 'blue');
  const sourceFiles = [
    { path: 'lil-shunshine-thrift-frontend/src/app/layout.tsx', desc: 'App layout' },
    { path: 'lil-shunshine-thrift-frontend/src/app/page.tsx', desc: 'Home page' },
    { path: 'lil-shunshine-thrift-frontend/src/lib/services/api.ts', desc: 'API service' },
    { path: 'lil-shunshine-thrift-frontend/src/types/index.ts', desc: 'TypeScript types' },
    { path: 'lil-shunshine-thrift-frontend/src/contexts/AuthContext.tsx', desc: 'Auth context' }
  ];
  
  sourceFiles.forEach(file => {
    total++;
    if (checkFile(file.path, file.desc)) passed++;
  });
  
  // Directories
  log('\n📂 Directories:', 'blue');
  const directories = [
    { path: 'api/uploads', desc: 'Uploads directory' },
    { path: 'lil-shunshine-thrift-frontend/src/app', desc: 'App pages' },
    { path: 'lil-shunshine-thrift-frontend/src/components', desc: 'Components' },
    { path: 'lil-shunshine-thrift-frontend/src/contexts', desc: 'Contexts' },
    { path: 'lil-shunshine-thrift-frontend/node_modules', desc: 'Frontend dependencies' }
  ];
  
  directories.forEach(dir => {
    total++;
    if (checkDirectory(dir.path, dir.desc)) passed++;
  });
  
  // Results
  log(`\n📊 Test Results:`, 'bright');
  log(`   ✅ Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  log(`   ❌ Failed: ${total - passed}/${total}`, total - passed > 0 ? 'red' : 'green');
  
  if (passed === total) {
    log('\n🎉 All structure tests passed!', 'green');
    log('   Project structure is complete and ready to run.', 'green');
  } else {
    log('\n⚠️  Some files are missing.', 'yellow');
    log('   Please check the failed items above.', 'yellow');
  }
  
  return passed === total;
}

function testDependencies() {
  log('\n📦 Testing Dependencies...\n', 'cyan');
  
  // Check Node.js
  try {
    const nodeVersion = process.version;
    log(`✅ Node.js: ${nodeVersion}`, 'green');
  } catch (error) {
    log('❌ Node.js: Not available', 'red');
    return false;
  }
  
  // Check npm
  try {
    const { execSync } = require('child_process');
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    log(`✅ npm: ${npmVersion}`, 'green');
  } catch (error) {
    log('❌ npm: Not available', 'red');
    return false;
  }
  
  // Check frontend dependencies
  const frontendPackagePath = 'lil-shunshine-thrift-frontend/package.json';
  if (fs.existsSync(frontendPackagePath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(frontendPackagePath, 'utf8'));
      const dependencies = Object.keys(packageJson.dependencies || {});
      log(`✅ Frontend dependencies: ${dependencies.length} packages`, 'green');
      
      // Check if node_modules exists
      if (fs.existsSync('lil-shunshine-thrift-frontend/node_modules')) {
        log('✅ Frontend node_modules: Installed', 'green');
      } else {
        log('⚠️  Frontend node_modules: Not installed', 'yellow');
        log('   Run: npm run install:frontend', 'yellow');
      }
    } catch (error) {
      log('❌ Frontend package.json: Invalid', 'red');
    }
  }
  
  return true;
}

function testConfiguration() {
  log('\n⚙️  Testing Configuration...\n', 'cyan');
  
  // Check environment templates
  const envFiles = [
    { path: 'api/env.example', desc: 'API environment template' },
    { path: 'lil-shunshine-thrift-frontend/env.local.example', desc: 'Frontend environment template' }
  ];
  
  envFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      log(`✅ ${file.desc}: Available`, 'green');
    } else {
      log(`❌ ${file.desc}: Missing`, 'red');
    }
  });
  
  // Check if .env files exist (they shouldn't be in git)
  if (fs.existsSync('api/.env')) {
    log('✅ API .env: Configured', 'green');
  } else {
    log('⚠️  API .env: Not configured', 'yellow');
    log('   Copy api/env.example to api/.env and configure', 'yellow');
  }
  
  if (fs.existsSync('lil-shunshine-thrift-frontend/.env.local')) {
    log('✅ Frontend .env.local: Configured', 'green');
  } else {
    log('⚠️  Frontend .env.local: Not configured', 'yellow');
    log('   Copy lil-shunshine-thrift-frontend/env.local.example to .env.local', 'yellow');
  }
  
  return true;
}

// Run all tests
function runAllTests() {
  log('🚀 Lil Sunshine Thrift - Structure Test\n', 'bright');
  
  const structureOk = testProjectStructure();
  const depsOk = testDependencies();
  const configOk = testConfiguration();
  
  log('\n📋 Summary:', 'bright');
  log('   Structure: ' + (structureOk ? '✅ OK' : '❌ Issues'), structureOk ? 'green' : 'red');
  log('   Dependencies: ' + (depsOk ? '✅ OK' : '❌ Issues'), depsOk ? 'green' : 'red');
  log('   Configuration: ' + (configOk ? '✅ OK' : '❌ Issues'), configOk ? 'green' : 'red');
  
  if (structureOk && depsOk && configOk) {
    log('\n🎉 All tests passed! Project is ready to run.', 'green');
    log('\n📋 Next Steps:', 'bright');
    log('   1. Configure database in api/.env', 'yellow');
    log('   2. Run: npm run migrate', 'yellow');
    log('   3. Run: npm start', 'yellow');
  } else {
    log('\n⚠️  Some issues found. Please fix them before running the application.', 'yellow');
  }
  
  log('\n✨ Test completed!', 'cyan');
}

runAllTests();
