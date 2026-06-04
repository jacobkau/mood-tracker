const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');

const addSubscriptionField = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Update all users without subscription field
    const result = await User.updateMany(
      { subscription: { $exists: false } },
      {
        $set: {
          subscription: {
            plan: 'free',
            status: 'active',
            currentPeriodStart: new Date()
          }
        }
      }
    );
    
    console.log(`Updated ${result.modifiedCount} users`);
    console.log('Migration completed successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

addSubscriptionField();
