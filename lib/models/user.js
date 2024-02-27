const { mongoose, model } = require("mongoose");
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  settings: {
    pageTitle: String,
    pageColor: String,
    textColor: String,
    fontFamily: {
      name: String,
      value: String,
    },
    fontSize: Number,
    headerImage: String,
  },
});

const User = model("user", userSchema);
module.exports = { User };
