import { Response } from "express";

export interface ApiError {
  msg: string;
  errorCode: number;
}

export interface ApiErrors {
  userNotFound: ApiError;
  emailAlreadyTaken: ApiError;
  userAlreadyExists: ApiError;
  userAlreadyInvited: ApiError;
  invalidUpdateFields: ApiError;
  incorrectPassword: ApiError;
  invalidToken: ApiError;
  invalidSignature: ApiError;
  tokenNotFound: ApiError;
  tokenExpired: ApiError;
  noUserFoundOnToken: ApiError;
  invalidUserOnToken: ApiError;
  unauthorized: ApiError;
  missingJWTSecret: ApiError;
  invalidInvitationToken: ApiError;
  noInvitationLinked: ApiError;
  invitationNotFound: ApiError;
}

export const apiErrors: ApiErrors = {
  userNotFound: {
    msg: "user not found",
    errorCode: 404,
  },
  emailAlreadyTaken: {
    msg: "email already taken",
    errorCode: 400,
  },
  userAlreadyExists: {
    msg: "user already exists",
    errorCode: 400,
  },
  userAlreadyInvited: {
    msg: "user already invited",
    errorCode: 400,
  },
  invalidUpdateFields: {
    msg: "invalid update fields",
    errorCode: 400,
  },
  incorrectPassword: {
    msg: "incorrect password",
    errorCode: 400,
  },
  invalidToken: {
    msg: "invalid token",
    errorCode: 400,
  },
  invalidSignature: {
    msg: "invalid signature",
    errorCode: 400,
  },
  tokenNotFound: {
    msg: "token not found",
    errorCode: 404,
  },
  tokenExpired: {
    msg: "token expired",
    errorCode: 404,
  },
  noUserFoundOnToken: {
    msg: "no user found on token",
    errorCode: 400,
  },
  invalidUserOnToken: {
    msg: "invalid user on token",
    errorCode: 400,
  },
  noInvitationLinked: {
    msg: "there is no invitation linked to this inviteToken",
    errorCode: 400,
  },
  invalidInvitationToken: {
    msg: "invitation token is invalid",
    errorCode: 400,
  },
  unauthorized: {
    msg: "unauthorized",
    errorCode: 401,
  },
  missingJWTSecret: {
    msg: "Missing env var JWT_SECRET",
    errorCode: 500,
  },
  invitationNotFound: {
    msg: "invitation not found",
    errorCode: 404,
  },
};

export function handleApiError(res: Response, error: any) {
  console.error("Api error:", error);
  if (error.errorCode) {
    const { errorCode, msg } = error as ApiError;
    res.status(errorCode).json({ error: msg });
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
}
