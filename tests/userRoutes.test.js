const request = require('supertest');
const app = require('../index.js');

let authToken;
let userId;
const uniqueEmail = `test${Date.now()}@example.com`; // Dynamic email for registration

// User Registration
it('should register a new user', async () => {
  const res = await request(app)
    .post('/users/register')
    .send({
      fullName: 'John Doe',
      dob: '1990-01-01',
      email: uniqueEmail,
      address: '123 Street',
      password: 'password123',
    });

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('user');
  userId = res.body.user.userId;
});

// Login
it('should log in a user and return a token', async () => {
  const res = await request(app)
    .post('/users/login')
    .send({
      email: uniqueEmail,
      password: 'password123',
    });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('token');
  authToken = res.body.token;
});

it('should get user profile', async () => {
  const res = await request(app)
    .get('/users/profile')
    .set('Authorization', `Bearer ${authToken}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('fullName'); 
  expect(res.body.fullName).toBe('John Doe');
});

it('should return unauthorized for protected routes without token', async () => {
  const res = await request(app).get('/users/profile');

  expect([401, 403]).toContain(res.status);
  expect(res.body.message).toMatch(/unauthorized|access denied/i); 
});

afterAll(async () => {
  if (userId) {
    await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);
  }
});
