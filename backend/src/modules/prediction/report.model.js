import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    visitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visit',
      required: [true, 'Visit ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    prediction: {
      risk_probability: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
      },
      risk_category: {
        type: String,
        required: true,
        enum: ['Low Risk', 'Moderate Risk', 'High Risk'],
      },
      confidence_interval: {
        type: [Number],
        required: true,
        validate: {
          validator: function (v) {
            return Array.isArray(v) && v.length === 2;
          },
          message: 'Confidence interval must be an array of 2 numbers',
        },
      },
      top_risk_factors: [
        {
          feature: {
            type: String,
            required: true,
          },
          impact: {
            type: Number,
            required: true,
          },
        },
      ],
      recommendation: {
        type: String,
        required: true,
      },
    },
    mlResponse: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ visitId: 1 });
reportSchema.index({ 'prediction.risk_category': 1 });

// Virtual for risk level numerical value
reportSchema.virtual('riskLevel').get(function () {
  const riskMap = {
    'Low Risk': 1,
    'Moderate Risk': 2,
    'High Risk': 3,
  };
  return riskMap[this.prediction.risk_category] || 0;
});

// Ensure virtuals are included in JSON
reportSchema.set('toJSON', { virtuals: true });
reportSchema.set('toObject', { virtuals: true });

const Report = mongoose.model('Report', reportSchema);

export default Report;
