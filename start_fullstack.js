const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Lil Sunshine Thrift Full Stack Application...\n');

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

// Check if API directory exists
const apiPath = path.join(__dirname, 'api');
const frontendPath = path.join(__dirname, 'lil-shunshine-thrift-frontend');

// Start API server
log('🔧 Starting PHP API Server...', 'cyan');
const apiProcess = spawn('php', ['start_api.php'], {
  cwd: apiPath,
  stdio: 'pipe'
});

apiProcess.stdout.on('data', (data) => {
  log(`[API] ${data.toString().trim()}`, 'blue');
});

apiProcess.stderr.on('data', (data) => {
  log(`[API ERROR] ${data.toString().trim()}`, 'red');
});

// Wait a bit for API to start, then start frontend
setTimeout(() => {
  log('\n🌐 Starting Next.js Frontend...', 'cyan');
  
  const frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: frontendPath,
    stdio: 'pipe',
    shell: true
  });

  frontendProcess.stdout.on('data', (data) => {
    log(`[FRONTEND] ${data.toString().trim()}`, 'green');
  });

  frontendProcess.stderr.on('data', (data) => {
    log(`[FRONTEND ERROR] ${data.toString().trim()}`, 'red');
  });

  // Handle process termination
  process.on('SIGINT', () => {
    log('\n🛑 Shutting down servers...', 'yellow');
    apiProcess.kill();
    frontendProcess.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    log('\n🛑 Shutting down servers...', 'yellow');
    apiProcess.kill();
    frontendProcess.kill();
    process.exit(0);
  });

}, 3000);

// Handle API process termination
apiProcess.on('close', (code) => {
  if (code !== 0) {
    log(`\n❌ API server exited with code ${code}`, 'red');
    log('Please check if PHP is installed and database is configured correctly.', 'yellow');
  }
});

log('\n📋 Application URLs:', 'bright');
log('   Frontend: http://localhost:3000', 'green');
log('   API: http://localhost:8000', 'blue');
log('\n👤 Default Admin Account:', 'bright');
log('   Email: admin@lilshunshine.com', 'yellow');
log('   Password: password', 'yellow');
log('\n⏹️  Press Ctrl+C to stop both servers', 'bright');
