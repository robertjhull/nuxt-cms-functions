const { MongoClient } = require("mongodb");

async function main(args) {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_NAME);
    const postsCollection = database.collection("posts");
    const commentsCollection = database.collection("comments");
    const usersCollection = database.collection("users");

    let userId = args.userId;
    if (!userId) {
      return { body: "No user ID provided" };
    }

    // TODO: handle single preview

    const posts = await postsCollection.findMany({
      author: new ObjectId(userId),
    });

    for (let post of posts) {
      const comments = await commentsCollection
        .find({ post: post._id })
        .sort({ created: -1 })
        .limit(3)
        .toArray();

      for (let comment of comments) {
        const commentUser = await usersCollection.findOne(
          { _id: new ObjectId(comment.user) },
          { projection: { name: 1 } }
        );
        comment.userName = commentUser ? commentUser.name : "Unknown";
      }

      post.comments = comments;
    }

    return { body: posts, statusCode: 200 };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      body: `Error fetching user data: ${error.message}`,
      statusCode: 500,
    };
  } finally {
    await client.close();
  }
}

module.exports.main = main;
