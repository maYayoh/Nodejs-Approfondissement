const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.service");
const jwt = require("jsonwebtoken");
const config = require("../config");

describe("tester API articles", () => {
  let token;

  const USER_ID = "fake";

  const MOCK_DATA = [
    {
      title: "Dummy",
      content: "Lorem ipsum.",
      state: "draft",
    },
    {
      title: "Foobar",
      content: "IT'S ME",
      state: "published",
    },
  ];

  const MOCK_DATA_CREATED = {
    title: "Created",
    content: "StuffYepHuhuh",
    state: "draft",
  };


  beforeEach(() => {
    
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);

    
    // mongoose.Query.prototype.find = jest.fn().mockResolvedValue(MOCK_DATA);
    mockingoose(Article).toReturn(MOCK_DATA, "find");
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save");
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
  });

  test("[Articles] Update Article", async () => {
    const data = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);

    const res = await request(app)
      .put(`/api/articles/${data.body._id}`)
      .send({ title: "ThisIsIT" })
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("ThisIsIT");
  });

  test("[Articles] Delete", async () => {
    const data = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);

    const res = await request(app)
      .delete(`/api/articles/${data.body._id}`)
      .set("x-access-token", token);
    expect(res.status).toBe(204);
  });
});
