import { Response } from "express";

export class ApiError {
  msg: string;
  code: number;
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
    code: 404,
  },
  incorrectPassword: {
    msg: "incorrect password",
    code: 400,
  },
  tokenNotFound: {
    msg: "token not found",
    code: 404,
  },
  noUserFoundOnToken: {
    msg: "no user found on token",
    code: 400,
  },
  invalidUserOnToken: {
    msg: "invalid user on token",
    code: 400,
  },
};

export function handleApiError(res: Response, error: any) {
  console.error("API ERROR");
  console.error(error);
  if (error instanceof ApiError) {
    res.status(error.code).json({ error: error.msg });
  } else {
    res.status(500).json({ error: error.message });
  }
}
