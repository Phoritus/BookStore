const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@test.com',
      phone: '0812345678',
      password: '123456'
    });
    
    console.log('Login successful:', loginResponse.data);
    const token = loginResponse.data.accessToken;
    
    console.log('\nTesting my-bookings...');
    const bookingsResponse = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Bookings response:', bookingsResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAPI();
