import Joi from "joi";

const productValidationSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name is required.",
  }),

  publishedDate: Joi.date().required().messages({
    "date.base": "Published date must be a valid date.",
  }),

  writer: Joi.string()
    .trim()
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      "string.pattern.base": "writer name should contain only alphabets.",
      "string.empty": "writer name is required.",
    }),

  Category: Joi.string().required().messages({
    "string.base": "Category must be a valid ObjectId.",
    "any.required": "Category is required.",
  }),

  language: Joi.string()
    .valid("English", "Malayalam", "Hindi", "Tamil")
    .required()
    .messages({
      "string.base": "Language must be a string.",
      "any.only": "Language must be one of English, Malayalam, Hindi, Tamil.",
    }),

  regularPrice: Joi.number().required().min(0).messages({
    "number.base": "Regular price must be a number.",
    "number.min": "Regular price must be greater than or equal to 0.",
    "any.required": "Regular price is required.",
  }),

  productOffer: Joi.number().optional().min(0).messages({
    "number.base": "Product offer must be a number.",
    "number.min": "Product offer must be greater than or equal to 0.",
  }),

  description: Joi.string().required().messages({
    "string.base": "Description must be a string.",
    "string.empty": "Description is required.",
  }),

  availableQuantity: Joi.number().required().min(0).messages({
    "number.base": "Available quantity must be a number.",
    "number.min": "Available quantity must be greater than or equal to 0.",
  }),

  productImages: Joi.array().items(Joi.string().uri()).required().messages({
    "array.base": "Product images must be an array of strings.",
    "array.empty": "At least one product image is required.",
    "string.uri": "Each product image must be a valid URI.",
  }),

  createdAt: Joi.date()
    .required()
    .default(() => new Date()) // Fixed: Removed invalid string argument
    .messages({
      "date.base": "Created date must be a valid date.",
    }),
});

export default productValidationSchema;
