import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/albarr_db';
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ [Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [Database] Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;