const http = require('http');
function api(path, method, body) {
  const data = body ? JSON.stringify(body) : null;
  return new Promise((resolve, reject) => {
    const req = http.request({hostname: 'localhost', port: 3000, path, method, headers: {'Content-Type': 'application/json', 'Content-Length': data ? Buffer.byteLength(data) : 0}}, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({status: res.statusCode, body: body}));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}
(async () => {
  // Test registration
  const reg = await api('/api/auth/register', 'POST', {
    email: 'finaltest@example.com',
    password: 'Pass123!@#$',
    role: 'client',
    fullName: 'Final Test'
  });
  console.log('Register:', reg.status, reg.body);

  // Test login
  const login = await api('/api/auth/login', 'POST', {
    email: 'finaltest@example.com',
    password: 'Pass123!@$'
  });
  console.log('Login:', login.status, login.body.slice(0, 100));
})();
