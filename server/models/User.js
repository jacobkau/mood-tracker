const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define subscription sub-schema
const subscriptionSchema = new mongoose.Schema({
  plan: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'trialing'],
    default: 'active'
  },
  currentPeriodStart: {
    type: Date,
    default: Date.now
  },
  currentPeriodEnd: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  stripeSubscriptionId: String,
  stripeCustomerId: String
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email address"]
  },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  profileImage: {
    type: String,
    default: null
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  },
  emailSubscribed: {
    type: Boolean,
    default: true
  },
  emailVerified: { type: Boolean, default: true },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
  
  // ADD THIS - Subscription field
  subscription: {
    type: subscriptionSchema,
    default: () => ({
      plan: 'free',
      status: 'active',
      currentPeriodStart: new Date()
    })
  }
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);
