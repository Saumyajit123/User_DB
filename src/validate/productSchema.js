const Joi = require("joi");

class ProductSchemaValidation {
  static createProduct = Joi.object({
    name: Joi.string().trim().required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),

    description: Joi.string().trim().required().messages({
      "string.empty": "Description is required",
      "any.required": "Description is required",
    }),

    price: Joi.number().positive().required().messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
      "any.required": "Price is required",
    }),

    color: Joi.string().trim().required().messages({
      "string.empty": "Color is required",
      "any.required": "Color is required",
    }),

    size: Joi.string()
      .valid("s", "m", "l", "xl", "xxl", "free")
      .required()
      .messages({
        "any.only": "Size must be one of s, m, l, xl, xxl, free",
        "any.required": "Size is required",
      }),

    isDeleted: Joi.boolean().required().messages({
      "boolean.base": "isDeleted must be true or false",
      "any.required": "isDeleted is required",
    }),
  });

  static updateProduct = Joi.object({
    price: Joi.number().positive().required().messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
      "any.required": "Price is required",
    }),

    color: Joi.string().trim().required().messages({
      "string.empty": "Color is required",
      "any.required": "Color is required",
    }),

    size: Joi.string()
      .valid("s", "m", "l", "xl", "xxl", "free")
      .required()
      .messages({
        "any.only": "Size must be one of s, m, l, xl, xxl, free",
        "any.required": "Size is required",
      }),

    isDeleted: Joi.boolean().required().messages({
      "boolean.base": "isDeleted must be true or false",
      "any.required": "isDeleted is required",
    }),
  });
}

module.exports = ProductSchemaValidation;
