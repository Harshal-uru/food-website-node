const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');

require('./setup');
const app = require('../server');
const User = require('../models/User');

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Routes', () => {
  const testUser = { name: 'Alice', email: 'alice@example.com', password: 'Password123!' };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('POST /api/auth/register should create a user and return token', async () => {
    const res = await chai.request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('token');
    expect(res.body).to.have.property('email', testUser.email);
  });

  it('POST /api/auth/login should return 401 for invalid credentials', async () => {
    const res = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: 'nouser@example.com', password: 'nope' });

    expect(res).to.have.status(401);
  });

  it('POST /api/auth/login should succeed after registration', async () => {
    await chai.request(app).post('/api/auth/register').send(testUser);

    const res = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('token');
  });

  it('GET /api/auth/profile should fail without token', async () => {
    const res = await chai.request(app)
      .get('/api/auth/profile');

    expect(res).to.have.status(401);
  });

  it('GET /api/auth/profile should succeed with valid token', async () => {
    const registerRes = await chai.request(app).post('/api/auth/register').send(testUser);
    const token = registerRes.body.token;

    const res = await chai.request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('email', testUser.email);
  });

  it('PUT /api/auth/profile should update profile fields', async () => {
    const registerRes = await chai.request(app).post('/api/auth/register').send(testUser);
    const token = registerRes.body.token;

    const update = { name: 'Alice Updated', university: 'Test Uni', address: '123 Street' };

    const res = await chai.request(app)
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .send(update);

    expect(res).to.have.status(200);
    expect(res.body).to.include({ name: 'Alice Updated', university: 'Test Uni', address: '123 Street' });
  });
}); 