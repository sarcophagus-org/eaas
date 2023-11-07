import { Request, Response } from "express";
import { userService } from "../../../src/app/services/user.service";
import { EaasUser, RequestWithUser } from "../../../src/types/EaasUser";
import { tokenService } from "../services";

const createUserWithInvite = async (req: Request, res: Response) => {
  try {
    const { user, inviteToken } = req.body;
    const { name, password, phone } = user;
    const { user: dbUser } = await userService.createUserWithInvite({
      name,
      password,
      phone,
      inviteToken,
    });

    if (!dbUser || !dbUser.id) {
      res.status(400).json({ error: "could not create user" });
    } else {
      const tokens = await tokenService.generateAuthTokens(dbUser.id);
      res.status(201).json({
        user: dbUser,
        tokens,
      });
    }
  } catch (error) {
    if (error.message.includes("duplicate key value")) {
      res.status(409).json({ error: "email is already taken" });
    } else {
      res.status(400).json({ error: error.message });
    }
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
  createUserWithInvite,
  getUser,
  getCurrentUser,
  getUsersByIds,
  getAllUsers,
  updateUser,
  deleteUser,
};
