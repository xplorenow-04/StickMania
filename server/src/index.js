import connectDB from "./db/db.js";
import { httpServer } from "./server.js";

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`✅ StickMania server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err.message);
  process.exit(1);
});
