
const mongoose = require('mongoose');

require("dotenv").config();
const connection = async () => {
  try {
    await mongoose.connect(  process.env.MONGODB_URI);
    console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export default connection;





