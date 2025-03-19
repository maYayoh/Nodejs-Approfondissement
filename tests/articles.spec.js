const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.model");
const articlesService = require("../api/articles/articles.service");
const e = require("express");

describe("tester API articles", () => {
    let token;
    const USER_ID = "fake";
    const ARTICLE_ID = "alsofake";
    const MOCK_ARTICLE = {
        _id: ARTICLE_ID,
        title: "Titre",
        content: "Lorem ipsum",
        user: 'User',
        status: 'draft'
    };

    const MOCK_UPDATED_ARTICLE = {
        title: "Titre2",
        content: "dolor sit amet",
        user: "User",
        status: "published",
    };

    beforeEach(() => {
        token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
        mockingoose(Article).toReturn(MOCK_ARTICLE, "save");
    });

    test("[Articles] Create Article", async () => {
        const res = await request(app)
            .post("/api/articles")
            .send(MOCK_ARTICLE)
            .set("x-access-token", token);
        expect(res.status).toBe(201);
        expect(res.body.title).toBe(MOCK_ARTICLE.title);
    });



    test("[Articles] Update Article", async () => {
        mockingoose(Article).toReturn(MOCK_UPDATED_ARTICLE, "save");
        const res = await request(app)
            .put("/api/articles/${MOCK_ARTICLE._id}")
            .send({ id: MOCK_ARTICLE._id, ...MOCK_UPDATED_ARTICLE })
            .set("x-access-token", token);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe(MOCK_UPDATED_ARTICLE.title);
        expect(res.body.content).toBe(MOCK_UPDATED_ARTICLE.content);
    });

    test("[Articles] Delete Article", async () => {
        const res = await request(app)
            .delete("/api/articles/${MOCK_ARTICLE._id}")
            .set("x-access-token", token);
        expect(res.status).toBe(204);
    });

});
