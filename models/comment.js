import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

// Comment Schema
const commentSchema = new Schema({
  id: Schema.Types.ObjectId,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  created: String,
  replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  status: {
    type: String,
    enum: ["pending", "approved", "trash"],
    required: true,
  },
});

const Comment = model("Comment", commentSchema);

export default { Comment };
