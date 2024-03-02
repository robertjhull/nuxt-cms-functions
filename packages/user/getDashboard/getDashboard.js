const { MongoClient, ObjectId } = require("mongodb");

async function main(args) {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_NAME);
    const usersCollection = database.collection("users");
    const postsCollection = database.collection("posts");
    const commentsCollection = database.collection("comments");

    let userId = args.userId;
    if (!userId) {
      return { body: "No user ID provided" };
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return { body: "User not found", statusCode: 404 };
    }

    const posts = await postsCollection
      .find({ user: new ObjectId(userId) })
      .sort({ created: -1 })
      .limit(3)
      .toArray();

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
        comment.author = { name: commentUser ? commentUser.name : "Unknown" };
      }

      post.comments = comments;
    }

    user.posts = posts;

    return { body: user, statusCode: 200 };
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
