const { MongoClient, ObjectId } = require("mongodb");

async function main(args) {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_NAME);

    let commentId = args.commentId;
    if (!commentId) {
      return { body: "No comment ID provided" };
    }

    const commentQuery = { _id: new ObjectId(commentId) };
    const newStatus = { $set: { status: args.status } };

    const result = await database
      .collection("comments")
      .updateOne(commentQuery, newStatus);

    if (result.modifiedCount === 0) {
      return { body: "Comment not updated", statusCode: 400 };
    }

    return { body: JSON.stringify(true), statusCode: 200 };
  } catch (error) {
    console.error("Error updating comment status:", error);
    return {
      body: `Error updating comment status: ${error.message}`,
      statusCode: 500,
    };
  } finally {
    await client.close();
  }
}

module.exports.main = main;
