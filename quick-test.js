// Quick diagnostic test
const http = require('http');

console.log('Testing if server is responding...\n');

// Test 1: Simple GET to health endpoint
http.get('http://localhost:3000/api', (res) => {
  console.log(`✅ Server is running! Status: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Response: ${data}\n`);
    
    // Test 2: Try login
    const loginData = JSON.stringify({
      email: 'owner1@turbovets.com',
      password: 'password123'
    });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      },
      timeout: 5000
    };
    
    console.log('Attempting login...');
    const req = http.request(options, (res) => {
      console.log(`Login response status: ${res.statusCode}`);
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        console.log(`Login response: ${responseData}`);
        process.exit(0);
      });
    });
    
    req.on('error', (e) => {
      console.error(`Login error: ${e.message}`);
      process.exit(1);
    });
    
    req.on('timeout', () => {
      console.error('Login request timed out');
      req.destroy();
      process.exit(1);
    });
    
    req.write(loginData);
    req.end();
  });
}).on('error', (e) => {
  console.error(`❌ Server error: ${e.message}`);
  console.log('\nIs the server running? Try: npx nx serve api');
  process.exit(1);
});
