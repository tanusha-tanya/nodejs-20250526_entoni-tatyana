const fetch = require('node-fetch').default;

async function testLogin() {
  try {
    // Логин
    console.log('Testing login...');
    const loginResponse = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'john',
        password: 'passw0rd'
      })
    });

    if (!loginResponse.ok) {
      console.error('Login failed:', loginResponse.status, loginResponse.statusText);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('Login successful, token received');

    // Проверка профиля
    console.log('Testing profile access...');
    const profileResponse = await fetch('http://localhost:3000/auth/profile', {
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`
      }
    });

    if (!profileResponse.ok) {
      console.error('Profile access failed:', profileResponse.status, profileResponse.statusText);
      return;
    }

    const profileData = await profileResponse.json();
    console.log('Profile access successful:', profileData);

  } catch (error) {
    console.error('Error:', error);
  }
}

testLogin(); 