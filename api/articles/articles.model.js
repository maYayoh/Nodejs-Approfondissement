const { Schema, model } = require("mongoose");

const statutArticle = Object.freeze({
  published: "published",
  draft: "draft",
})

const articleSchema = Schema({
  title: String,
  content: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: Object.values(statutArticle),
    default: statutArticle.draft,
  },
});

let Article;

module.exports = Article = model("Article", articleSchema);
