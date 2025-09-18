const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Setting up Lil Sunshine Thrift Full Stack Application...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check requirements
log('📋 Checking requirements...', 'cyan');

const requirements = [
  { name: 'Node.js', command: 'node', required: true },
  { name: 'npm', command: 'npm', required: true },
  { name: 'PHP', command: 'php', required: true },
  { name: 'MySQL', command: 'mysql', required: false }
];

let allRequired = true;

requirements.forEach(req => {
  const isInstalled = checkCommand(req.command);
  const status = isInstalled ? '✅' : (req.required ? '❌' : '⚠️');
  const color = isInstalled ? 'green' : (req.required ? 'red' : 'yellow');
  
  log(`   ${status} ${req.name}`, color);
  
  if (!isInstalled && req.required) {
    allRequired = false;
  }
});

if (!allRequired) {
  log('\n❌ Some required dependencies are missing. Please install them first.', 'red');
  process.exit(1);
}

log('\n✅ All required dependencies are installed!', 'green');

// Setup API
log('\n🔧 Setting up API...', 'cyan');

const apiPath = path.join(__dirname, 'api');

// Check if .env exists, if not copy from example
const envPath = path.join(apiPath, '.env');
const envExamplePath = path.join(apiPath, 'env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  log('   📄 Created .env file from template', 'green');
} else if (fs.existsSync(envPath)) {
  log('   📄 .env file already exists', 'yellow');
}

// Create upload directories
const uploadDirs = [
  path.join(apiPath, 'uploads'),
  path.join(apiPath, 'uploads', 'products'),
  path.join(apiPath, 'uploads', 'blog'),
  path.join(apiPath, 'uploads', 'temp')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`   📁 Created directory: ${path.relative(apiPath, dir)}`, 'green');
  }
});

// Setup Frontend
log('\n🌐 Setting up Frontend...', 'cyan');

const frontendPath = path.join(__dirname, 'lil-shunshine-thrift-frontend');

if (fs.existsSync(frontendPath)) {
  // Install dependencies
  try {
    log('   📦 Installing frontend dependencies...', 'blue');
    execSync('npm install', { cwd: frontendPath, stdio: 'inherit' });
    log('   ✅ Frontend dependencies installed', 'green');
  } catch (error) {
    log('   ❌ Failed to install frontend dependencies', 'red');
    log('   Please run "npm install" in the frontend directory manually', 'yellow');
  }
} else {
  log('   ⚠️  Frontend directory not found', 'yellow');
}

// Create environment file for frontend
const frontendEnvPath = path.join(frontendPath, '.env.local');
const frontendEnvContent = `# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Application Configuration
NEXT_PUBLIC_APP_NAME=Lil Sunshine Thrift
NEXT_PUBLIC_APP_DESCRIPTION=Cửa hàng thời trang vintage và thrift
`;

if (!fs.existsSync(frontendEnvPath)) {
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  log('   📄 Created .env.local file for frontend', 'green');
}

// Database setup instructions
log('\n🗄️  Database Setup:', 'cyan');
log('   1. Create a MySQL database named "lilshunshine_thrift"', 'yellow');
log('   2. Update the .env file in the api directory with your database credentials', 'yellow');
log('   3. Run: php api/database/migrate.php', 'yellow');

// Final instructions
log('\n🚀 Setup Complete!', 'green');
log('\n📋 Next Steps:', 'bright');
log('   1. Configure your database in api/.env', 'yellow');
log('   2. Run database migration: php api/database/migrate.php', 'yellow');
log('   3. Start the full stack application: node start_fullstack.js', 'yellow');

log('\n🔗 URLs:', 'bright');
log('   Frontend: http://localhost:3000', 'green');
log('   API: http://localhost:8000', 'blue');

log('\n👤 Default Admin Account:', 'bright');
log('   Email: admin@lilshunshine.com', 'yellow');
log('   Password: password', 'yellow');

log('\n✨ Happy coding!', 'magenta');
