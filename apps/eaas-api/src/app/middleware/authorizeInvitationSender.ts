import { NextFunction, Response } from "express";
import { RequestWithUser } from "src/types/EaasUser";
import { userService } from "../services/user.service";
import { apiErrors } from "../utils/errors";

export const authorizeInvitationSender = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const senderId = req.user.id;
  try {
    const user = await userService.getUserById(senderId);
    if (user.is_embalmer) {
      next();
    } else {
      res.status(401).send({ error: apiErrors.unauthorized.msg });
    }
  } catch (error) {
    res.status(400).send({ error: apiErrors.unauthorized.msg });
  }
};
