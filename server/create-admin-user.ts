import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/user.model';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function createAdminUser() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const username = 'admin';
    const password = 'Atharv@1136';

    // Check if admin user already exists
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      console.log('⚠️  Admin user already exists!');
      console.log('🔄 Updating password...');
      
      // Update password
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
      await existingUser.save();
      
      console.log('✅ Admin user password updated successfully!');
      console.log(`   Username: ${username}`);
      console.log(`   Password: ${password}`);
      console.log(`   User ID: ${existingUser._id}`);
    } else {
      console.log('🆕 Creating new admin user...');
      
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      const adminUser = new User({
        username,
        password: hashedPassword,
      });
      
      await adminUser.save();
      
      console.log('✅ Admin user created successfully!');
      console.log(`   Username: ${username}`);
      console.log(`   Password: ${password}`);
      console.log(`   User ID: ${adminUser._id}`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdminUser();

