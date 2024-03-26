const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required ",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required ",
  }),
});

const forgotPasswordSchema = Joi.object({
  email : Joi.string().email().required().messages({
    "any.required":"Email is required"
  })
})

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema
};
