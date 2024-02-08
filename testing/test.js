const should = require("chai");

const chaiHttp = require("chai-http");
const app = require("../server");

should();
chai.use(chaiHttp);
// let token="'asdasd"
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI4OGNkY2ZmZTlhY2VkYjQ1YTQ5OTEiLCJlbWFpbCI6InNhbmd3YW5zYWNoaW42MzFAZ21haWwuY29tIiwiaWF0IjoxNzA3MzAwNzI5LCJleHAiOjE3MDc0NzM1Mjl9.eiZujq3hWZOvlYyLJeX-KcZxkHCdWVr-lV41MUeqjvQ";
describe(`get all user test`, () => {
  it(`should verify the token`, (done) => {
    chai
      .request(app)
      .get("/getAllUsers")
    //   .send("send")
    .set("Authorization",`Bearer ${token}`)
      .auth(req.cokkies?.ecom)
      .end((err, res) => {
        console.log(req.cokkies?.ecom);
        res.should.have.status(200);
        done();
      });
  });
});
