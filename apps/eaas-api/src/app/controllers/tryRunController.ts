import { Request, Response } from "express";
import { handleApiError } from "../utils/errors";
import { RequestWithUser } from "src/types/EaasUser";

export const tryRunController = (
  controller: (req: Request | RequestWithUser, res: Response) => Promise<void>,
) => {
  return async (req: Request | RequestWithUser, res: Response) => {
    try {
      return await controller(req, res);
    } catch (error) {
      handleApiError(res, error);
    }
  };
};
