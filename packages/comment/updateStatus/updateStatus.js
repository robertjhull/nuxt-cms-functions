const { MongoClient } = require("mongodb");

async function main(args) {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_NAME);
    const commentsCollection = database.collection("comments");

    let userId = args.userId;
    if (!userId) {
      return { body: "No user ID provided" };
    }

    const comment = await commentsCollection.findOne({
      _id: new ObjectId(userId),
    });
    if (!comment) {
      return { body: "Comment not found", statusCode: 404 };
    }

    comment.status = args.status;
    // save

    return { body: true, statusCode: 200 };
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
