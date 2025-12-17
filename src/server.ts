import mongoose from "mongoose";
import app from "./app";
import config from "./config";


async function main() {
try {

    await mongoose.connect(config.db_url as string);
    console.log("✅ Database is running");

    app.listen(config.port, () => {
      console.log(`🚀 App is listening on port: ${config.port}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect database", err);
  }
}

main();
