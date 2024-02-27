const { mongoose, model } = require("mongoose");
const { Schema } = mongoose;

// Post Schema
const postSchema = new Schema({
  title: { type: String, required: true },
  subtitle: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  created: String,
  published: String,
  status: {
    type: String,
    enum: ["draft", "published"],
    required: true,
  },
});

const Post = model("Post", postSchema);

module.exports = { Post };
