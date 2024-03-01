require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function main(args) {
  try {
    await client.connect();
    const database = client.db("nuxtCMSDemo");
    const usersCollection = database.collection("users");
    const postsCollection = database.collection("posts");
    const commentsCollection = database.collection("comments");

    let userId = args.userId;
    if (!userId) {
      return { body: "No user ID provided" };
    }

    userId = new ObjectId(userId);

    const user = await usersCollection.findOne({ _id: userId });
    if (!user) {
      return { body: `User with ID ${userId} not found` };
    }

    user.posts = await postsCollection.find({ author: userId }).toArray();
    for (let post of user.posts) {
      post.comments = await commentsCollection
        .find({ post: post._id })
        .toArray();
    }

    return { body: user };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { body: `Error fetching user data: ${error.message}` };
  } finally {
    await client.close();
  }
}

module.exports.main = main;
