// Complete API test - Login and test all endpoints
const http = require('http');

let authToken = '';

console.log('🧪 Testing TurboVets API - Complete Flow\n');

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Run tests
(async () => {
  try {
    // Test 1: Login
    console.log('1️⃣ Testing POST /api/auth/login...');
    const loginResult = await makeRequest('POST', '/api/auth/login', {
      email: 'owner1@turbovets.com',
      password: 'password123'
    });
    
    console.log(`   Status: ${loginResult.status}`);
    
    if (loginResult.status === 200 || loginResult.status === 201) {
      authToken = loginResult.data.access_token;
      console.log(`   ✅ Login successful!`);
      console.log(`   Token: ${authToken.substring(0, 30)}...`);
    } else {
      console.log(`   ❌ Login failed!`);
      console.log(`   Response:`, loginResult.data);
      return;
    }
    
    console.log('');

    // Test 2: Get all tasks (with authentication)
    console.log('2️⃣ Testing GET /api/tasks (with token)...');
    const tasksResult = await makeRequest('GET', '/api/tasks', null, authToken);
    console.log(`   Status: ${tasksResult.status}`);
    
    if (tasksResult.status === 200) {
      console.log(`   ✅ Success! Found ${tasksResult.data.length} tasks`);
      if (tasksResult.data.length > 0) {
        console.log(`   First task: ${tasksResult.data[0].title}`);
      }
    } else {
      console.log(`   ❌ Failed!`);
      console.log(`   Response:`, tasksResult.data);
    }
    
    console.log('');

    // Test 3: Create a new task
    console.log('3️⃣ Testing POST /api/tasks (create task)...');
    const createResult = await makeRequest('POST', '/api/tasks', {
      title: 'Test Task from Script',
      description: 'This is a test task created via API',
      category: 'Testing'
    }, authToken);
    
    console.log(`   Status: ${createResult.status}`);
    
    if (createResult.status === 200 || createResult.status === 201) {
      console.log(`   ✅ Task created! ID: ${createResult.data.id}`);
    } else {
      console.log(`   ❌ Failed!`);
      console.log(`   Response:`, createResult.data);
    }
    
    console.log('');

    // Test 4: Get single task
    console.log('4️⃣ Testing GET /api/tasks/1 (get single task)...');
    const singleTaskResult = await makeRequest('GET', '/api/tasks/1', null, authToken);
    console.log(`   Status: ${singleTaskResult.status}`);
    
    if (singleTaskResult.status === 200) {
      console.log(`   ✅ Success! Task: ${singleTaskResult.data.title}`);
    } else {
      console.log(`   ❌ Failed!`);
      console.log(`   Response:`, singleTaskResult.data);
    }
    
    console.log('');

    // Test 5: Update task
    console.log('5️⃣ Testing PUT /api/tasks/1 (update task)...');
    const updateResult = await makeRequest('PUT', '/api/tasks/1', {
      status: 'InProgress'
    }, authToken);
    
    console.log(`   Status: ${updateResult.status}`);
    
    if (updateResult.status === 200) {
      console.log(`   ✅ Task updated! Status: ${updateResult.data.status}`);
    } else {
      console.log(`   ❌ Failed!`);
      console.log(`   Response:`, updateResult.data);
    }
    
    console.log('');
    console.log('✅ All tests completed!\n');
    console.log('💡 To use in Swagger:');
    console.log('   1. Go to http://localhost:3000/api-docs');
    console.log('   2. Click Authorize button');
    console.log(`   3. Paste this token: ${authToken}`);
    console.log('   4. Click Authorize, then test any endpoint!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
