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

    user.posts = [];
    user.comments = [];

    const posts = await postsCollection
      .find({ author: new ObjectId(userId) })
      .sort({ created: -1 })
      .limit(3)
      .toArray();

    for (let post of posts) {
      post.authorName = user.name;

      const comments = await commentsCollection
        .find({ post: post._id })
        .sort({ created: -1 })
        .limit(3)
        .toArray();

      for (let comment of comments) {
        const commentUser = await usersCollection.findOne(
          { _id: new ObjectId(comment.author) },
          { projection: { name: 1 } }
        );
        comment.authorName = commentUser ? commentUser.name : "Unknown";
        comment.postTitle = post.title;
        user.comments.push(comment);
      }

      post.comments = comments;
      user.posts.push(post);
    }

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
