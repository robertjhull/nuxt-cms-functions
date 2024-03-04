const { MongoClient, ObjectId } = require("mongodb");

async function main(args) {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_NAME);

    const comments = await database.collection("comments").find().toArray();
    if (!comments || comments.length === 0) {
      return { body: "Comments not found", statusCode: 404 };
    }

    for (let comment of comments) {
      const commentUser = await database
        .collection("users")
        .findOne(
          { _id: new ObjectId(comment.author) },
          { projection: { name: 1 } }
        );
      comment.authorName = commentUser ? commentUser.name : "Unknown";

      const commentPost = await database
        .collection("posts")
        .findOne(
          { _id: new ObjectId(comment.post) },
          { projection: { title: 1 } }
        );
      comment.postTitle = commentPost ? commentPost.title : "Unknown";
    }

    return { body: comments, statusCode: 200 };
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
