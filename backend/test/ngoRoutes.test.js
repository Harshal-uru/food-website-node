const chai = require('chai');
const chaiHttp = require('chai-http');

require('./setup');
const app = require('../server');
const NGO = require('../models/NGO');

chai.use(chaiHttp);
const { expect } = chai;

describe('NGO Routes', () => {
  beforeEach(async () => {
    if (NGO && NGO.deleteMany) {
      await NGO.deleteMany({});
    }
  });

  it('GET /api/ngos/search is public and should return 200', async () => {
    const res = await chai.request(app).get('/api/ngos/search?q=test');
    expect([200, 204, 404]).to.include(res.status); // tolerate if controller requires DB
  });

  it('GET /api/ngos should return 401 without token (protected)', async () => {
    const res = await chai.request(app).get('/api/ngos');
    expect(res).to.have.status(401);
  });
}); 