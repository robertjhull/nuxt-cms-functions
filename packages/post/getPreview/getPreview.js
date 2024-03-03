const { MongoClient, ObjectId } = require("mongodb");

async function main(args) {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_NAME);

    let userId = args.userId;
    if (!userId) {
      return { body: "No user ID provided" };
    }

    let postId = args.postId;

    const postFilter = {
      author: new ObjectId(userId),
      ...(postId && { _id: new ObjectId(postId) }),
    };

    const posts = await database.collection("posts").find(postFilter).toArray();

    for (let post of posts) {
      const comments = await database
        .collection("comments")
        .find({ post: post._id, status: "approved" })
        .sort({ created: -1 })
        .toArray();

      for (let comment of comments) {
        const commentUser = await database
          .collection("users")
          .find(
            { _id: new ObjectId(comment.author) },
            { projection: { name: 1 } }
          );
        comment.author = { name: commentUser ? commentUser.name : "Unknown" };

        comment.replies = await database
          .collection("comments")
          .find({ parentCommentId: comment._id, status: "approved" })
          .sort({ created: -1 })
          .toArray();

        for (let reply of comment.replies) {
          const replyUser = await database
            .collection("users")
            .find(
              { _id: new ObjectId(reply.author) },
              { projection: { name: 1 } }
            );
          comment.author = { name: replyUser ? replyUser.name : "Unknown" };
        }
      }

      post.comments = comments;
    }

    return { body: posts, statusCode: 200 };
  } catch (error) {
    console.error("Error fetching post data:", error);
    return {
      body: `Error fetching post data: ${error.message}`,
      statusCode: 500,
    };
  } finally {
    await client.close();
  }
}

module.exports.main = main;
