import Joi from "joi";

export const createInvitationSchema = Joi.object({
  recipients: Joi.array().items(Joi.string().email()).required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string().min(8).required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().required(),
});

const userSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string().min(8).required(),
  phone: Joi.string().required(),
}).options({ abortEarly: false });

export const createUserSchema = Joi.object({
  user: userSchema,
  inviteToken: Joi.string(),
});
