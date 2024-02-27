require("dotenv").config();
const { connect, disconnect } = require("mongoose");
const { User } = require("./models/user");
const { Post } = require("./models/post");
const { Comment } = require("./models/comment");

async function insertUser(userData) {
  const newUser = new User({
    _id: userData._id,
    name: userData.name,
    posts: [],
    comments: [],
    settings: userData.settings,
  });

  await newUser.save();

  console.log("User inserted successfully:", newUser);
}

async function insertPost(postData, userData) {
  const newPost = new Post({
    title: postData.title,
    subtitle: postData.subtitle,
    author: userData._id,
    content: postData.content,
    comments: [],
    created: postData.created,
    published: postData.published,
    status: postData.status,
  });

  await newPost.save();

  console.log("Post inserted successfully:", newPost);
}

async function insertComment(commentData, postData, userData) {
  const newComment = new Comment({
    author: userData._id,
    text: commentData.text,
    parentComment: commentData.parentComment,
    created: commentData.created,
    post: postData._id,
    replies: [],
    status: commentData.status,
  });

  if (commentData._id) {
    newComment._id = commentData._id;
  }

  await newComment.save();

  console.log("Comment inserted successfully:", newComment);
}

const userData = {
  _id: process.env.DEFAULT_USER_ID,
  name: "Demo User",
  settings: {
    pageTitle: "My Site",
    pageColor: "#37474F",
    textColor: "#FAFAFA",
    fontFamily: {
      name: "Arial",
      value: "Arial, sans-serif",
    },
    fontSize: 22,
    headerImage:
      "https://cdn.pixabay.com/photo/2015/11/19/08/52/banner-1050629_960_720.jpg",
  },
};

const postData = {
  _id: process.env.DEFAULT_POST_ID,
  title: "An example post",
  subtitle: "An example subtitle",
  content:
    "A simple content management system demo built with Nuxt.js and Cloud Functions.",
  status: "published",
  created: new Date().toISOString(),
  published: new Date().toISOString(),
};

const commentData1 = {
  text: "This is a comment.",
  parentComment: null,
  status: "approved",
  created: new Date().toISOString(),
};

const commentData2 = {
  _id: process.env.DEFAULT_COMMENT_ID,
  text: "This is another comment.",
  parentComment: null,
  status: "approved",
  created: new Date().toISOString(),
};

const commentData3 = {
  text: "This is a reply to an existing comment.",
  parentComment: process.env.DEFAULT_COMMENT_ID,
  status: "approved",
  created: new Date().toISOString(),
};

const commentData4 = {
  text: "This is a pending reply to the comment that has not been approved yet.",
  parentComment: process.env.DEFAULT_COMMENT_ID,
  status: "pending",
  created: new Date().toISOString(),
};

async function main() {
  await connect(process.env.MONGODB_URI);

  try {
    await insertUser(userData);
    await insertPost(postData, userData);
    await insertComment(commentData1, postData, userData);
    await insertComment(commentData2, postData, userData);
    await insertComment(commentData3, postData, userData);
    await insertComment(commentData4, postData, userData);
  } catch (error) {
    console.error("Error inserting documents:", error);
  } finally {
    await disconnect();
  }
}

main().then(() => console.log("All operations complete."));
