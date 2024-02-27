const { mongoose, model } = require("mongoose");
const { Schema } = mongoose;

// Comment Schema
const commentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  created: String,
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    required: false,
  },
  replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  status: {
    type: String,
    enum: ["pending", "approved", "trash"],
    required: true,
  },
});

const Comment = model("Comment", commentSchema);

module.exports = { Comment };
