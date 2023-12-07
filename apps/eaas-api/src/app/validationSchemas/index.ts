import Joi from "joi";

export const preparedEncryptedPayloadSchema = Joi.object({
  encryptedPayloadMetadata: Joi.object({
    fileName: Joi.string().required(),
    type: Joi.string().required(),
  }),
  recipientPublicKey: Joi.string().required(),
  encryptedPayload: Joi.binary().required(),
  innerEncryptedkeyShares: Joi.array().items(Joi.binary().required()),
});

export const sendEncryptedPayloadSchema = Joi.object({
  preparedEncryptedPayload: preparedEncryptedPayloadSchema,
  resurrectionTime: Joi.number().required(),
  sarcoId: Joi.string().required(),
  encryptedPdfBlob: Joi.binary().required(),
});

export const createInvitationSchema = Joi.object({
  recipients: Joi.array().items(Joi.string().email()).required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  token: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().required(),
});

const userSchema = Joi.object({
  password: Joi.string().min(8).required(),
}).options({ abortEarly: false });

export const createUserWithInviteSchema = Joi.object({
  user: userSchema,
  inviteToken: Joi.string().required(),
});

export const rewrapSarcophagusSchema = Joi.object({
  sarcoId: Joi.string().required(),
  resurrectionTime: Joi.number().required(),
});

export const editSarcophagusSchema = Joi.object({
  sarcoId: Joi.string().required(),
});

export const encryptedPdfSchema = Joi.object({
  sarcoId: Joi.string().required(),
  password: Joi.string().required(),
});
