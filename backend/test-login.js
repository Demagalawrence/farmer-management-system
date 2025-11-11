// Quick test of login endpoint
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with manager@test.com...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'manager@test.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful!');
    console.log('Token:', response.data.token.substring(0, 20) + '...');
    console.log('User:', response.data.user.name, '(' + response.data.user.role + ')');
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Login failed:', error.response.status, error.response.statusText);
      console.log('Message:', error.response.data.message || error.response.data);
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testLogin();
