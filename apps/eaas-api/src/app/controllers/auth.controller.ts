import { Request, Response } from "express";
import { authService, tokenService, userService } from "../services";
import { catchAsync } from "../utils/catchAsync";
import { envConfig } from "../../../src/config/env.config";

const verifyToken = catchAsync(async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    await tokenService.verifyToken(token, envConfig.jwt.secret);
    res.status(200).json();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "this invitation is invalid" });
  }
});

const register = catchAsync(async (req: Request, res: Response) => {
  try {
    const { user, inviteToken } = req.body;
    const { name, password, passwordConfirm, phone } = user;
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
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await authService.loginWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(user.id);

    res.status(200).json({ user, tokens });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    await authService.logout(refreshToken);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAuth(refreshToken);
    res.status(200).json(tokens);
  } catch (error) {
    if (error.message.includes("invalid signature")) {
      res.status(400).json({ error: error.message });
    } else if (error.message.includes("token not found")) {
      res.status(400).json({ error: error.message });
    } else if (error.message.includes("jwt expired")) {
      res.status(400).json({ error: "refresh token expired" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  try {
    const { password, token } = req.body;
    if (token) {
      await authService.resetPassword(token.toString(), password);
      res.status(204).send();
    } else {
      res.status(400).json({ error: "must include token" });
    }
  } catch (error) {
    if (error.message.toString().includes("token not found")) {
      res.status(400).json({ error: error.message });
    } else if (error.message.toString().includes("jwt expired")) {
      res.status(400).json({ error: "token expired" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// const forgotPassword = catchAsync(
//   async (req: Request, res: Response) => {
//     try {
//       const { email } = req.body;
//       const resetPasswordToken = await tokenService.generateResetPasswordToken(
//         email
//       );
//       emailService.sendResetPasswordEmail(email, resetPasswordToken);
//       res.status(204).send();
//     } catch (error) {
//       if (error.message.includes("no users found with this email")) {
//         res.status(404).send({ error: error.message });
//       } else {
//         res.status(400).send({ error: error.message });
//       }
//     }
//   }
// );

// const sendVerificationEmail = catchAsync(
//   async (req: RequestWithUser, res: Response) => {
//     const user = req.user as User;
//     try {
//       const verifyEmailToken = await tokenService.generateVerifyEmailToken(
//         user.id
//       );
//       await emailService.sendVerificationEmail(user.email, verifyEmailToken);
//       res.status(204).send();
//     } catch (error) {
//       res.status(400).send({ error: error.message });
//     }
//   }
// );

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    if (!token) {
      res.status(400).send();
    }
    await authService.verifyEmail(token);
    res.status(204).send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export const authController = {
  verifyToken,
  register,
  login,
  logout,
  refreshTokens,
  resetPassword,
  // forgotPassword,
  // sendVerificationEmail,
  verifyEmail,
};
