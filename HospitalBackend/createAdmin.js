 // We will use the built-in fetch if node > 18, but let's stick to standard http for safety
// Actually, let's use standard Node.js http to avoid installing extra packages
const http = require('http');

const data = JSON.stringify({
  name: "Super Admin",
  email: "admin@hospital.com",
  password: "admin123",
  role: "admin"
});

const options = {
  hostname: 'localhost',
  port: 5002,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response Body:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();