import { Request, Response } from "express";
import { handleApiError } from "./errors";
import { RequestWithUser } from "src/types/EaasUser";

/**
 * Returns a controller wrapped a controller in a try/catch block
 */
export const getSafeController = (
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
