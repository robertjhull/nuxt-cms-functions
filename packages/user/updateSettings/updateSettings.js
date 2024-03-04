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

    const newSettings = {
      $set: {
        "settings.fontFamily": args.fontFamily,
        "settings.fontSize": args.fontSize,
        "settings.pageColor": args.pageColor,
        "settings.pageTitle": args.pageTitle,
        "settings.textColor": args.textColor,
      },
    };

    await database
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, newSettings);

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
