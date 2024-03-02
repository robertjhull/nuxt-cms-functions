const { MongoClient, ObjectId } = require("mongodb");

async function main(args) {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_NAME);
    const usersCollection = database.collection("users");

    let userId = args.userId;
    if (!userId) {
      return { body: "No user ID provided" };
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return { body: "User not found", statusCode: 404 };
    }

    return { body: user.settings, statusCode: 200 };
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
