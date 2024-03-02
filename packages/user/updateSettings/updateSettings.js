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

    const userQuery = { _id: new ObjectId(userId) };
    const newSettings = {
      $set: {
        fontFamily: args.fontFamily,
        fontSize: args.fontSize,
        pageColor: args.pageColor,
        pageTitle: args.pageTitle,
        textColor: args.textColor,
      },
    };

    const result = await database
      .collection("users")
      .updateOne(userQuery, newSettings);

    if (result.modifiedCount === 0) {
      return { body: "User settings not updated", statusCode: 400 };
    }

    return { body: JSON.stringify(true), statusCode: 200 };
  } catch (error) {
    console.error("Error updating user settings:", error);
    return {
      body: `Error updating user settings: ${error.message}`,
      statusCode: 500,
    };
  } finally {
    await client.close();
  }
}

module.exports.main = main;
