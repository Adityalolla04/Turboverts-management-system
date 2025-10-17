// Simple test script to verify API endpoints
const http = require('http');

console.log('🧪 Testing TurboVets API...\n');

// Test 1: Health Check
function testHealthCheck() {
  return new Promise((resolve) => {
    console.log('1️⃣ Testing GET /api (Health Check)...');
    http.get('http://localhost:3000/api', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Response: ${data}\n`);
        resolve();
      });
    }).on('error', (err) => {
      console.log(`   ❌ Error: ${err.message}\n`);
      resolve();
    });
  });
}

// Test 2: Login Endpoint
function testLogin() {
  return new Promise((resolve) => {
    console.log('2️⃣ Testing POST /api/auth/login...');
    
    const postData = JSON.stringify({
      email: 'owner@turbovets.com',
      password: 'password123'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        try {
          const json = JSON.parse(data);
          if (json.access_token) {
            console.log(`   ✅ Login successful!`);
            console.log(`   Token: ${json.access_token.substring(0, 20)}...`);
            resolve(json.access_token);
          } else {
            console.log(`   Response: ${data}`);
            resolve(null);
          }
        } catch (e) {
          console.log(`   Response: ${data}`);
          resolve(null);
        }
        console.log();
      });
    });

    req.on('error', (err) => {
      console.log(`   ❌ Error: ${err.message}\n`);
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}

// Run tests
(async () => {
  await testHealthCheck();
  const token = await testLogin();
  
  if (token) {
    console.log('✅ API is working! You can now:');
    console.log('   1. Use the token to call other endpoints');
    console.log('   2. Check TEST-GUIDE.md for more examples');
  } else {
    console.log('⚠️  Login failed. You need to create users first.');
    console.log('   Run the seed script or insert users manually.');
  }
})();
