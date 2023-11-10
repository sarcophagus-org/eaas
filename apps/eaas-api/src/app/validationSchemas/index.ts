import Joi from "joi";

const preparedEncryptedPayloadSchema = Joi.object({
  encryptedPayloadMetadata: Joi.object({
    fileName: Joi.string().required(),
    type: Joi.string().required(),
  }),
  recipientPublicKey: Joi.string().required(),
  encryptedPayload: Joi.object({
    type: Joi.string().required(),
    data: Joi.string().required(),
  }),
  innerEncryptedkeyShares: Joi.array().items(
    Joi.object({
      type: Joi.string().required(),
      data: Joi.string().required(),
    }),
  ),
});

export const sendEncryptedPayloadSchema = Joi.object({
  preparedEncryptedPayload: preparedEncryptedPayloadSchema,
  chainId: Joi.number().required(),
  threshold: Joi.number().required(),
  resurrectionTime: Joi.number().required(),
  sarcophagusName: Joi.string().required(),
});

export const createInvitationSchema = Joi.object({
  recipients: Joi.array().items(Joi.string().email()).required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().required(),
});

const userSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().required(),
}).options({ abortEarly: false });

export const createUserWithInviteSchema = Joi.object({
  user: userSchema,
  inviteToken: Joi.string(),
});
