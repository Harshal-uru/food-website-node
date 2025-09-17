const chai = require('chai');
const chaiHttp = require('chai-http');

require('./setup');
const app = require('../server');

chai.use(chaiHttp);
const { expect } = chai;

describe('Health Check', () => {
  it('GET /api/health should return 200 OK', async () => {
    const res = await chai.request(app).get('/api/health');
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('status', 'OK');
  });
}); 