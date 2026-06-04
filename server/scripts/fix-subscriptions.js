const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');

const fixSubscriptions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    let updatedCount = 0;
    
    for (const user of users) {
      let needsUpdate = false;
      
      // Ensure subscription exists
      if (!user.subscription) {
        user.subscription = {};
        needsUpdate = true;
      }
      
      // Ensure plan is valid
      if (!['free', 'pro', 'premium'].includes(user.subscription.plan)) {
        user.subscription.plan = 'free';
        needsUpdate = true;
      }
      
      // Ensure status is valid
      if (!['active', 'cancelled', 'expired'].includes(user.subscription.status)) {
        user.subscription.status = 'active';
        needsUpdate = true;
      }
      
      // Ensure dates exist
      if (!user.subscription.currentPeriodStart) {
        user.subscription.currentPeriodStart = new Date();
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await user.save();
        updatedCount++;
        console.log(`Updated user: ${user.email} - Plan: ${user.subscription.plan}`);
      }
    }
    
    console.log(`\n✅ Updated ${updatedCount} users`);
    
    // Show summary
    const summary = await User.aggregate([
      {
        $group: {
          _id: '$subscription.plan',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\nSubscription summary:');
    summary.forEach(item => {
      console.log(`- ${item._id || 'unknown'}: ${item.count} users`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Fix failed:', error);
    process.exit(1);
  }
};

fixSubscriptions();
