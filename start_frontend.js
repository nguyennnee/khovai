#!/usr/bin/env node
/**
 * Script to start the lil.shunshine.thrift frontend server
 */

const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000';

console.log('🌞 Starting lil.shunshine.thrift Frontend Server...');
console.log('📍 Server will run at: http://localhost:3000');
console.log('🔗 API URL: http://localhost:8000');
console.log('🔄 Development mode: ON');
console.log('-'.repeat(50));

// Start Next.js development server
const nextProcess = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

nextProcess.on('error', (error) => {
  console.error('❌ Error starting frontend:', error);
});

nextProcess.on('close', (code) => {
  console.log(`Frontend process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down frontend server...');
  nextProcess.kill('SIGINT');
  process.exit(0);
});
