const request = require('supertest');
const app = require("../app");
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const testData = require("../db/data/test-data");

afterAll(() => 
  db.end()
);

beforeEach(() => seed(testData));

describe('API',() => {
  test("404: if no page is found return status 404", () => {
    return request(app)
      .get("/asjdfh")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Page Not Found" });
      });
  });

  describe("3. GET /api/topics", () => {
    test("200, Respond with an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  }); // End of '3. GET /api/topics'

  
})