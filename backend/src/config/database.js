import mongoose from 'mongoose';
import config from './environment.js';

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.database.url, {
      // Modern Mongoose doesn't need these options anymore
      // but you can add them if you face issues
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);

    // Optional: Log database name
    if (config.nodeEnv === 'development') {
      console.log(`✓ Database: ${conn.connection.name}`);
    }

    return true;
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// MongoDB event listeners
mongoose.connection.on('connected', () => {
  console.log('✓ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('✗ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠ Mongoose disconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to app termination');
  process.exit(0);
});

export default connectDB;
