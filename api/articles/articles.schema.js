const { Schema, model } = require("mongoose");

const articleSchema = Schema({
  title: String,
  content: String,
  state: {
    type: String,
    enum: ["draft", "published"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

let Article;

module.exports = Article = model("Article", articleSchema);
