const Joi = require("joi");

class UserSchemaValidation {
  static signup = Joi.object({
    name: Joi.string().trim().required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),

    email: Joi.string().trim().email().required().messages({
      "string.email": "Please provide a valid mail address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

    phone: Joi.string().trim().required().messages({
      "string.empty": "Phone is required",
      "any.required": "Phone is required",
    }),

    password: Joi.string().trim().min(6).max(15).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at 6 characters",
      "string.max": "Password cannot exceed 15 characters",
      "any.required": "Password is required",
    }),
  });

  static login = Joi.object({
    email: Joi.string().trim().email().required().messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

    password: Joi.string().trim().required().messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  });

  static changePassword = Joi.object({
    oldPassword: Joi.string().required().messages({
      "string.empty": "Old password is required",
      "any.required": "Old password is required",
    }),

    newPassword: Joi.string().min(6).required().messages({
      "string.empty": "New password is required",
      "string.min": "Password must be at least 6 characters",
      "any.required": "New password is required",
    }),

    confirmPassword: Joi.string()
      .required()
      .valid(Joi.ref("newPassword"))
      .messages({
        "any.only": "Confirm password must match new password",
        "string.empty": "Confirm password is required",
        "any.required": "Confirm password is required",
      }),
  });
}

module.exports = UserSchemaValidation;
