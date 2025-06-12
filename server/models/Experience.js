const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  peptideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Peptide',
    required: true,
    index: true
  },
  peptideName: {
    type: String,
    required: true
  },
  trackingId: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true,
    enum: ['daily', 'every-other-day', 'twice-weekly', 'weekly', 'as-needed']
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  routeOfAdministration: {
    type: String,
    required: true,
    enum: ['subcutaneous', 'intramuscular', 'oral', 'nasal']
  },
  primaryPurpose: [{
    type: String,
    required: true
  }],
  demographics: {
    ageRange: {
      type: String,
      enum: ['18-25', '25-30', '30-35', '35-40', '40-45', '45-50', '50+']
    },
    biologicalSex: {
      type: String,
      enum: ['male', 'female', 'prefer-not-to-say']
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'moderate', 'active', 'athletic']
    }
  },
  outcomes: {
    energy: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    sleep: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    mood: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    performance: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    recovery: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    sideEffects: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    }
  },
  effects: [{
    type: String,
    required: true
  }],
  timeline: {
    type: String,
    required: true,
    enum: ['immediately', '1-3-days', '1-week', '2-weeks', '3-4-weeks', '1-2-months', 'no-effects']
  },
  story: {
    type: String,
    maxlength: 1000
  },
  stack: [{
    type: String
  }],
  sourcing: {
    vendorUrl: String,
    batchId: String,
    purityPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    volumeMl: {
      type: Number,
      min: 0
    }
  },
  helpfulVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  totalVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false,
  timestamps: { updatedAt: 'updatedAt' }
});

// Indexes for performance
experienceSchema.index({ peptideId: 1, createdAt: -1 });
experienceSchema.index({ userId: 1, createdAt: -1 });
experienceSchema.index({ createdAt: -1 });
experienceSchema.index({ trackingId: 1 });

// Transform output to match frontend expectations
experienceSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.submittedAt = ret.createdAt;
    return ret;
  }
});

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;