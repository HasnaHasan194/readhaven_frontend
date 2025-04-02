import Joi from 'joi';

// Validation schema for user details
export const userDetailsSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.empty': 'First name is required.',
      'string.pattern.base': 'First name should contain only alphabets.',
    }),
  lastName: Joi.string()
    .trim()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.empty': 'Last name is required.',
      'string.pattern.base': 'Last name should contain only alphabets.',
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required.',
      'string.email': 'Please enter a valid email address.',
    }),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .trim()
    .required()
    .messages({
      'string.empty': 'Phone number is required.',
      'string.pattern.base': 'Phone number must be 10 digits.',
    }),
  
  profileImage: Joi.string().optional(), // Optional for now
}).unknown(true);

// Validation schema for profile image upload
export const profileImageSchema = Joi.object({
  profileImage: Joi.any()
    .required()
    .messages({
      'any.required': 'Profile image is required.',
    })
    .custom((value, helpers) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(value.type)) {
        return helpers.message('Only JPG, PNG, or JPEG images are allowed.');
      }
      if (value.size > 5 * 1024 * 1024) {
        return helpers.message('Image size must be less than 5MB.');
      }
      return value;
    }),
});

// Validation schema for OTP
export const otpSchema = Joi.object({
  otp: Joi.string()
    .length(6)
    .required()
    .messages({
      'string.length': 'OTP must be 6 digits.',
      'string.empty': 'OTP is required.',
    }),
});