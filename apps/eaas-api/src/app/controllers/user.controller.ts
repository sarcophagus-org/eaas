import { Request, Response } from "express";
import { userService } from "../../../src/app/services/user.service";
import { EaasUser, RequestWithUser } from "../../../src/types/EaasUser";

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await userService.getUsersByIds([id]);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCurrentUser = async (req: RequestWithUser, res: Response) => {
  const { id } = req.user;
  try {
    const user = await userService.getUsersByIds([id]);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req: RequestWithUser, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUsersByIds = async (req: Request, res: Response) => {
  const { ids } = req.body as { ids: string[] };
  try {
    const users = await userService.getUsersByIds(ids);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req: RequestWithUser, res: Response) => {
  try {
    const updateParams = req.body as Partial<EaasUser>;
    const updatedUser = await userService.updateUserById(req.user.id, updateParams);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req: RequestWithUser, res: Response) => {
  try {
    const user = req.user as EaasUser;
    await userService.deleteUser(user.id);
    res.send(200);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const userController = {
  getUser,
  getCurrentUser,
  getUsersByIds,
  getAllUsers,
  updateUser,
  deleteUser,
};
