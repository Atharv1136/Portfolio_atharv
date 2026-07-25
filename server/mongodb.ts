import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cachedConnection: mongoose.Connection | null = null;

export async function connectToDatabase(): Promise<mongoose.Connection> {
  const uri = process.env.MONGODB_URI;

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnection && cachedConnection.readyState === 1) {
    return cachedConnection;
  }

  if (!uri) {
    console.error("❌ MONGODB_URI not found in environment variables");
    throw new Error('MONGODB_URI environment variable is required');
  }

  try {
    console.log("🔄 Connecting to MongoDB Atlas...");

    await mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    cachedConnection = mongoose.connection;
    console.log("✅ MongoDB Connected Successfully!");
    return mongoose.connection;
  } catch (error: any) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw error;
  }
}

export function disconnectFromDatabase() {
  if (cachedConnection || mongoose.connection.readyState === 1) {
    return mongoose.disconnect();
  }
}
