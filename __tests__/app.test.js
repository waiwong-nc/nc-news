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
        expect(body).toEqual({ msg: "Not Found" });
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

  describe("4. GET /api/articles", () => {
    test("200, Respond with an array of articles objects", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });

    test("Return array is sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSorted({ key: "created_at", descending: true });
        });
    });
  }); // End of '4. GET /api/articles'

  describe("5. GET /api/articles/article_id", () => {
    test("200, Respond with an array of articles objects", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toHaveLength(1);
          expect(article[0]).toEqual({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            topic: "mitch",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
          });
        });
    });

    test("404, Respond with non-existent IDs", () => {
      return request(app)
        .get("/api/articles/100")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("ID Not Exist");
        });
    });
  }); // End of 5. GET /api/articles/article_id

  describe("7. POST /api/articles/:article_id/comments", () => {
    test("200, Respond with an posted comment", () => {
      const comment = {
        username: "butter_bridge",
        body: "Hello! what a hot weather",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toHaveLength(1);
          expect(comment[0]).toEqual({
            comment_id: expect.any(Number),
            body: "Hello! what a hot weather",
            votes: 0,
            author: "butter_bridge",
            article_id: 1,
            created_at: expect.any(String),
          });
        });
    });

    test("400, Respond to missing body and username input", () => {
      // test 1
      const comment = {};
      return request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Input");
        });
    });

    test("400, Respond to empty body and username input", () => {
      // test 1
      const comment = {
        body: "     ",
        username: "     ",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Input");
        });
    });

    test("404, Respond to non-existent IDs", () => {
      const comment = {
        username: "butter_bridge",
        body: "Hello! what a hot weather",
      };
      return request(app)
        .post("/api/articles/100/comments")
        .send(comment)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("ID Not Exist");
        });
    });

    test("404, Respond to non-existent user", () => {
      const comment = {
        username: "Tom",
        body: "Hello! what a hot weather",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Username");
        });
    });
  }); // End of 7. POST /api/articles/:article_id/comments
})