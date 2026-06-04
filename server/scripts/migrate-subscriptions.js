const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');

const migrateSubscriptions = async () => {
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
            currentPeriodStart: new Date(),
            currentPeriodEnd: null
          }
        }
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} users with subscription field`);
    
    // Verify the update
    const users = await User.find({}).select('username email subscription');
    console.log('\nSample users after migration:');
    users.slice(0, 5).forEach(user => {
      console.log(`- ${user.email}: ${user.subscription?.plan} plan (${user.subscription?.status})`);
    });
    
    console.log('\n✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateSubscriptions();
