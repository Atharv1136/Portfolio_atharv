import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

let cachedConnection: mongoose.Connection | null = null;

export async function connectToDatabase(): Promise<mongoose.Connection> {
  const uri = process.env.MONGODB_URI;
  // If already connected, return existing connection
  if (mongoose.connection.readyState === 1) {
    console.log("✅ MongoDB already connected");
    cachedConnection = mongoose.connection;
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    if (!uri) {
      throw new Error('MONGODB_URI is not defined');
    }

    console.log("🔄 Attempting to connect to MongoDB...");
    console.log(`📍 Connection URI: ${uri.substring(0, 30)}...`);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Keep at least 5 connections open
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip IPv6
    });

    cachedConnection = mongoose.connection;

    console.log("✅ MongoDB Connected Successfully!");
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'connected'}`);
    console.log(`🔗 Host: ${mongoose.connection.host || 'unknown'}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log("⚠️ MongoDB disconnected");
      cachedConnection = null;
    });

    mongoose.connection.on('reconnected', () => {
      console.log("✅ MongoDB reconnected");
    });

    cachedConnection = mongoose.connection;
    return mongoose.connection;
  } catch (error: any) {
    console.error("❌ MongoDB Connection Error:");
    console.error("   Error:", error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error("   💡 This usually means:");
      console.error("      - MongoDB Atlas cluster is not running");
      console.error("      - IP address is not whitelisted");
      console.error("      - Connection string is incorrect");
      console.error("      - Network/firewall issues");
    }
    throw error;
  }
}

export function disconnectFromDatabase() {
  if (cachedConnection || mongoose.connection.readyState === 1) {
    return mongoose.disconnect();
  }
}


