import { Response } from "express";
import { ApiError } from "../utils/errors";

export const apiErrorHandler = async (error: any, _: any, res: Response, next) => {
  console.error("Api error:", error);
  if (error.errorCode) {
    const { errorCode, msg } = error as ApiError;
    res.status(errorCode).json({ error: msg });
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
};
