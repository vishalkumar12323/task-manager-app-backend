import mongoose from "mongoose";

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error?.message);
  }
}
