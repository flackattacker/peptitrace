const mongoose = require('mongoose');

const peptideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Healing & Recovery',
      'Growth Hormone',
      'Performance & Enhancement',
      'Anti-Aging',
      'Cognitive Enhancement'
    ]
  },
  description: {
    type: String,
    required: true
  },
  detailedDescription: {
    type: String,
    required: true
  },
  mechanism: {
    type: String,
    required: true
  },
  commonDosage: {
    type: String,
    required: true
  },
  commonFrequency: {
    type: String,
    required: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalExperiences: {
    type: Number,
    default: 0,
    min: 0
  },
  commonEffects: [{
    type: String,
    required: true
  }],
  sideEffects: [{
    type: String,
    required: true
  }],
  popularity: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  commonStacks: [{
    type: String
  }],
  dosageRanges: {
    low: {
      type: String,
      required: true
    },
    medium: {
      type: String,
      required: true
    },
    high: {
      type: String,
      required: true
    }
  },
  timeline: {
    onset: {
      type: String,
      required: true
    },
    peak: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
peptideSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Peptide', peptideSchema);