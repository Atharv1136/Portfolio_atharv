import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI not found in environment variables");
  console.log("💡 Make sure your .env file contains: MONGODB_URI=your_connection_string");
  throw new Error('MONGODB_URI environment variable is required');
}

let cachedConnection: mongoose.Connection | null = null;

export async function connectToDatabase(): Promise<mongoose.Connection> {
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
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      // Optimize for serverless
      maxPoolSize: 1, // Limit connections for serverless
      minPoolSize: 0, // Allow connection pool to close when idle
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10s
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


