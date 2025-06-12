const mongoose = require('mongoose');

const { validatePassword, isPasswordHash } = require('../utils/password.js');
const {randomUUID} = require("crypto");

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    validate: { validator: isPasswordHash, message: 'Invalid password hash' },
  },
  demographics: {
    age: {
      type: Number,
      min: 18,
      max: 120,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    },
    weight: {
      type: Number,
      min: 30,
      max: 500,
    },
    height: {
      type: Number,
      min: 100,
      max: 250,
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active'],
    },
    fitnessGoals: [{
      type: String,
      enum: ['weight-loss', 'muscle-gain', 'strength', 'endurance', 'general-health', 'recovery', 'anti-aging'],
    }],
    medicalConditions: [{
      type: String,
    }],
    allergies: [{
      type: String,
    }],
  },
  preferences: {
    units: {
      weight: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg',
      },
      height: {
        type: String,
        enum: ['cm', 'ft'],
        default: 'cm',
      },
    },
    privacy: {
      shareAge: {
        type: Boolean,
        default: true,
      },
      shareGender: {
        type: Boolean,
        default: true,
      },
      shareWeight: {
        type: Boolean,
        default: false,
      },
      shareHeight: {
        type: Boolean,
        default: false,
      },
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      newExperiences: {
        type: Boolean,
        default: false,
      },
      weeklyDigest: {
        type: Boolean,
        default: true,
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
  profileUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  refreshToken: {
    type: String,
    unique: true,
    index: true,
    default: () => randomUUID(),
  },
}, {
  versionKey: false,
});

schema.set('toJSON', {
  /* eslint-disable */
  transform: (doc, ret, options) => {
    delete ret.password;
    return ret;
  },
  /* eslint-enable */
});

const User = mongoose.model('User', schema);

module.exports = User;