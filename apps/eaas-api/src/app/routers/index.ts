import dotenv from "dotenv";

import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { userService } from "../services";
import { EaasUser } from "../../../src/types/EaasUser";

dotenv.config();

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: any, done: any) => {
  try {
    if (payload.type !== "access") {
      throw new Error("Invalid token type");
    }
    const user: EaasUser | null = await userService.getUserById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export { authRouter } from "./auth.router";
export { userRouter } from "./user.router";
export { invitationRouter } from "./invitation.router";
