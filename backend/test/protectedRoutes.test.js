const chai = require('chai');
const chaiHttp = require('chai-http');

require('./setup');
const app = require('../server');

chai.use(chaiHttp);
const { expect } = chai;

describe('Protected Routes Enforcement', () => {
  it('GET /api/food-donations should return 401 without token', async () => {
    const res = await chai.request(app).get('/api/food-donations');
    expect(res).to.have.status(401);
  });

  it('POST /api/food-donations should return 401 without token', async () => {
    const res = await chai.request(app).post('/api/food-donations').send({});
    expect(res).to.have.status(401);
  });

  it('GET /api/tasks should return 401 without token', async () => {
    const res = await chai.request(app).get('/api/tasks');
    expect(res).to.have.status(401);
  });
}); 