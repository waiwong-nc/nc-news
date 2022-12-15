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

  describe("6. GET /api/articles/:article_id/comments", () => {
    test("200, Respond with an array of articles objects", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toHaveLength(11);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });

    test("comments should be served with the most recent comments first", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeSorted({ key: "created_at", descending: true });
        });
    });

    test('404, Respond with "ID Not Exist" if article id is not exist', () => {
      return request(app)
        .get("/api/articles/100/comments")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("ID Not Exist");
        });
    });

    test('400, Respond with "Invalid ID" if article id is not valid', () => {
      return request(app)
        .get("/api/articles/hellow/comments")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid ID");
        });
    });

    test("200, Respond with empty array if article ID valid but no comment for that article", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toEqual([]);
        });
    });
  }); // End of 6. GET /api/articles/:article_id/comments

  describe("7. POST /api/articles/:article_id/comments", () => {
    test("201, Respond with an posted comment", () => {
      const comment = {
        username: "butter_bridge",
        body: "Hello! what a hot weather",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(201)
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

    test("400, Respond to missing body and username property", () => {
      const comment = {};
      return request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Missing Property");
        });
    });

    test("400, Respond to empty body and username input", () => {
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

  describe("8. PATCH /api/articles/:article_id", () => {
    test("200, Respond with an update articles objects (in array)", () => {
      const article = {
        inc_votes: 100,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(article)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toHaveLength(1);
          expect(article[0]).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 200,
          });
        });
    });

    test("404, non-existent article id", () => {
      const article = {
        inc_votes: 100,
      };
      return request(app)
        .patch("/api/articles/100")
        .send(article)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Non Existent ID");
        });
    });

    test("400, 'inc_votes' is not exist in req.body", () => {
      const article = {};
      return request(app)
        .patch("/api/articles/1")
        .send(article)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Missing Property");
        });
    });

    test("400, value in 'inc_votes' is not valid", () => {
      const article = {
        inc_votes: "1i23",
      };
      return request(app)
        .patch("/api/articles/1")
        .send(article)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Input");
        });
    });

    test("400, invalid article_id", () => {
      const article = {
        inc_vote: 100,
      };
      return request(app)
        .patch("/api/articles/3.12")
        .send(article)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid ID");
        });
    });
  }); // End of 8. PATCH /api/articles/:article_id

  describe("9. GET /api/users", () => {
    test("200, Respond with an array of users objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  }); // End of '9. GET /api/users'

  describe("10. GET /api/articles (queries)", () => {
    test("200, Respond with an array of articles objects when no query is attached", () => {
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

    test("200, Respond with an array of articles objects that topic equals to 'mitch'", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(11);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: "mitch",
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });

    test("200, Respond with an array of articles objects defaultly sorted by date descendingly", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSorted({ key: "created_at", descending: true });
        });
    });

    test("200, Respond with an array of articles objects that defaultly sort by title ascendingly", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=title&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(11);
          expect(articles).toBeSorted({ key: "title", descending: false });
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: "mitch",
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });

    test("400, when value of query (sort_by) is invalid", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=user_id")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("'Sort_by' Invalid");
        });
    });

    test("400, when value of query (order) is invalid", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=title&order=xyz")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("'Order' Invalid");
        });
    });

    test("400, when queries'keys is invalid", () => {
      // test 1
      return request(app)
        .get("/api/articles?topippc=mitch&so-rt_by=title&or__der=xyz")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Query Key Invalid");
        });
    });

    test("200, Return empty array if topic exists but no articles are attached to it ", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toEqual([]);
        });
    });

    test("404, Return topic not exist if no such topic ", () => {
      return request(app)
        .get("/api/articles?topic=asdf")
        .expect(404)
        .then(({ body }) => {
          console.log(body)
          const { msg } = body;
          expect(msg).toBe('Topic Not Found')
        });
    });


  }); // End of 10. GET /api/articles (queries)
})