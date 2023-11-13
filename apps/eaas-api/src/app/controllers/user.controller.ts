import { Request, Response } from "express";
import { userService } from "../../../src/app/services/user.service";
import { EaasUser, RequestWithUser } from "../../../src/types/EaasUser";
import { tokenService } from "../services";
import { tryRunController } from "./tryRunController";

const createUserWithInvite = tryRunController(async (req: Request, res: Response) => {
    const { user, inviteToken } = req.body;
    const { name, password, phone } = user;
    const { user: dbUser } = await userService.createUserWithInvite({
      name,
      password,
      phone,
      inviteToken,
    });

    const tokens = await tokenService.generateAuthTokens(dbUser.id);
    res.status(201).json({
      user: dbUser,
      tokens,
    });
});

const getUser = tryRunController(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUsersByIds([id]);
  res.status(200).json(user);
});

const getCurrentUser = tryRunController(async (req: RequestWithUser, res: Response) => {
  const { id } = req.user;
  const user = await userService.getUsersByIds([id]);
  res.status(200).json(user);
});

const getAllUsers = tryRunController(async (req: RequestWithUser, res: Response) => {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
});

const getUsersByIds = tryRunController(async (req: Request, res: Response) => {
  const { ids } = req.body as { ids: string[] };
  const users = await userService.getUsersByIds(ids);
  res.status(200).json(users);
});

const updateUser = tryRunController(async (req: RequestWithUser, res: Response) => {
  const updateParams = req.body as Partial<EaasUser>;
  const updatedUser = await userService.updateUserById(req.user.id, updateParams);
  res.status(200).json(updatedUser);
});

const deleteUser = tryRunController(async (req: RequestWithUser, res: Response) => {
  const user = req.user as EaasUser;
  await userService.deleteUser(user.id);
  res.send(200);
});

export const userController = {
  createUserWithInvite,
  getUser,
  getCurrentUser,
  getUsersByIds,
  getAllUsers,
  updateUser,
  deleteUser,
};
