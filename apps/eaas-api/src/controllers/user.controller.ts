import { Request, Response } from "express";
import { userService } from "src/services/user.service";
import { EaasUser, RequestWithUser } from "src/types/EaasUser";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    const dbUser = await userService.createUser({ name, email, password, phone });
    res.status(200).json(dbUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await userService.getUsersByIds([id]);
    res.status(200).json(user);
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
  createUser,
  getUser,
  getUsersByIds,
  updateUser,
  deleteUser,
};
