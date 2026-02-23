import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    patientData: {
      age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [1, 'Age must be at least 1'],
        max: [120, 'Age must be less than 120'],
      },
      height: {
        type: Number,
        required: [true, 'Height is required'],
        min: [50, 'Height must be at least 50 cm'],
        max: [300, 'Height must be less than 300 cm'],
      },
      weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [10, 'Weight must be at least 10 kg'],
        max: [500, 'Weight must be less than 500 kg'],
      },
      gender: {
        type: Number,
        required: [true, 'Gender is required'],
        enum: {
          values: [0, 1],
          message: 'Gender must be 0 (Female) or 1 (Male)',
        },
      },
      ap_hi: {
        type: Number,
        required: [true, 'Systolic blood pressure is required'],
        min: [70, 'Systolic BP must be at least 70'],
        max: [250, 'Systolic BP must be less than 250'],
      },
      ap_lo: {
        type: Number,
        required: [true, 'Diastolic blood pressure is required'],
        min: [40, 'Diastolic BP must be at least 40'],
        max: [200, 'Diastolic BP must be less than 200'],
      },
      cholesterol: {
        type: Number,
        required: [true, 'Cholesterol level is required'],
        enum: {
          values: [1, 2, 3],
          message: 'Cholesterol must be 1 (Normal), 2 (Above Normal), or 3 (Well Above Normal)',
        },
      },
      gluc: {
        type: Number,
        required: [true, 'Glucose level is required'],
        enum: {
          values: [1, 2, 3],
          message: 'Glucose must be 1 (Normal), 2 (Above Normal), or 3 (Well Above Normal)',
        },
      },
      smoke: {
        type: Number,
        required: [true, 'Smoking status is required'],
        enum: {
          values: [0, 1],
          message: 'Smoke must be 0 (No) or 1 (Yes)',
        },
      },
      alco: {
        type: Number,
        required: [true, 'Alcohol consumption status is required'],
        enum: {
          values: [0, 1],
          message: 'Alcohol must be 0 (No) or 1 (Yes)',
        },
      },
      active: {
        type: Number,
        required: [true, 'Physical activity status is required'],
        enum: {
          values: [0, 1],
          message: 'Active must be 0 (No) or 1 (Yes)',
        },
      },
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
    },
  },
  {
    timestamps: true,
  }
);

visitSchema.index({ userId: 1, createdAt: -1 });
visitSchema.index({ status: 1 });

const Visit = mongoose.model('Visit', visitSchema);

export default Visit;
