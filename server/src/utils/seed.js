import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

dotenv.config({ path: "./.env" });

const seedAdmin = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await User.findOne({ email: "admin@stickmania.com" });
    if (existing) {
      console.log("⚠️  Admin user already exists. Skipping seed.");
      process.exit(0);
    }

    const admin = await User.create({
      name: "StickMania Admin",
      email: "admin@stickmania.com",
      password: "Admin@123456",
      role: "admin",
    });

    console.log("🎉 Admin user created successfully!");
    console.log("   Email   : admin@stickmania.com");
    console.log("   Password: Admin@123456");
    console.log("   Role    : admin");
    console.log("   ID      :", admin._id.toString());

  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

seedAdmin();
