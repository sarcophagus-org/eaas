import { Response } from "express";

export interface ApiError {
  msg: string;
  errorCode: number;
}

export interface ApiErrors {
  userNotFound: ApiError;
  incorrectPassword: ApiError;
  tokenNotFound: ApiError;
  noUserFoundOnToken: ApiError;
  invalidUserOnToken: ApiError;
}

export const apiErrors: ApiErrors = {
  userNotFound: {
    msg: "user not found",
    errorCode: 404,
  },
  incorrectPassword: {
    msg: "incorrect password",
    errorCode: 400,
  },
  tokenNotFound: {
    msg: "token not found",
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
};

export function handleApiError(res: Response, error: any) {
  console.error(error);
  if (error.errorCode) {
    const { errorCode, msg } = error as ApiError;
    res.status(errorCode).json({ error: msg });
  } else {
    res.status(500).json({ error: error.message });
  }
}
