import Joi from 'joi';


export const predictionSchema = Joi.object({
  age: Joi.number()
    .min(1)
    .max(120)
    .required()
    .messages({
      'number.base': 'Age must be a number',
      'number.min': 'Age must be at least 1',
      'number.max': 'Age must be less than 120',
      'any.required': 'Age is required',
    }),

  height: Joi.number()
    .min(50)
    .max(300)
    .required()
    .messages({
      'number.base': 'Height must be a number',
      'number.min': 'Height must be at least 50 cm',
      'number.max': 'Height must be less than 300 cm',
      'any.required': 'Height is required',
    }),

  weight: Joi.number()
    .min(10)
    .max(500)
    .required()
    .messages({
      'number.base': 'Weight must be a number',
      'number.min': 'Weight must be at least 10 kg',
      'number.max': 'Weight must be less than 500 kg',
      'any.required': 'Weight is required',
    }),

  gender: Joi.number()
    .valid(0, 1)
    .required()
    .messages({
      'number.base': 'Gender must be a number',
      'any.only': 'Gender must be 0 (Female) or 1 (Male)',
      'any.required': 'Gender is required',
    }),

  ap_hi: Joi.number()
    .min(70)
    .max(250)
    .required()
    .messages({
      'number.base': 'Systolic blood pressure must be a number',
      'number.min': 'Systolic BP must be at least 70',
      'number.max': 'Systolic BP must be less than 250',
      'any.required': 'Systolic blood pressure is required',
    }),

  ap_lo: Joi.number()
    .min(40)
    .max(200)
    .required()
    .custom((value, helpers) => {
      const ap_hi = helpers.state.ancestors[0].ap_hi;
      if (ap_hi && value >= ap_hi) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .messages({
      'number.base': 'Diastolic blood pressure must be a number',
      'number.min': 'Diastolic BP must be at least 40',
      'number.max': 'Diastolic BP must be less than 200',
      'any.required': 'Diastolic blood pressure is required',
      'any.invalid': 'Diastolic BP must be less than Systolic BP',
    }),

  cholesterol: Joi.number()
    .valid(1, 2, 3)
    .required()
    .messages({
      'number.base': 'Cholesterol must be a number',
      'any.only': 'Cholesterol must be 1 (Normal), 2 (Above Normal), or 3 (Well Above Normal)',
      'any.required': 'Cholesterol level is required',
    }),

  gluc: Joi.number()
    .valid(1, 2, 3)
    .required()
    .messages({
      'number.base': 'Glucose must be a number',
      'any.only': 'Glucose must be 1 (Normal), 2 (Above Normal), or 3 (Well Above Normal)',
      'any.required': 'Glucose level is required',
    }),

  smoke: Joi.number()
    .valid(0, 1)
    .required()
    .messages({
      'number.base': 'Smoking status must be a number',
      'any.only': 'Smoking must be 0 (No) or 1 (Yes)',
      'any.required': 'Smoking status is required',
    }),

  alco: Joi.number()
    .valid(0, 1)
    .required()
    .messages({
      'number.base': 'Alcohol consumption must be a number',
      'any.only': 'Alcohol must be 0 (No) or 1 (Yes)',
      'any.required': 'Alcohol consumption status is required',
    }),

  active: Joi.number()
    .valid(0, 1)
    .required()
    .messages({
      'number.base': 'Physical activity must be a number',
      'any.only': 'Physical activity must be 0 (No) or 1 (Yes)',
      'any.required': 'Physical activity status is required',
    }),
});


export const querySchema = Joi.object({
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).max(100).optional(),
  sortBy: Joi.string()
    .valid('createdAt', 'risk_probability', 'risk_category')
    .optional(),
  order: Joi.string().valid('asc', 'desc').optional(),
  riskCategory: Joi.string()
    .valid('Low Risk', 'Moderate Risk', 'High Risk')
    .optional(),
});


export const idSchema = Joi.object({
  reportId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid report ID format',
      'any.required': 'Report ID is required',
    }),
});
