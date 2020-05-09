import { User } from "../controllers/v0/users/models/User";
import * as jwt from "jsonwebtoken";
import { config } from "../config/config";

export function generateJWT(user: User): string {
  console.log("generateJWT");
  return jwt.sign(user.short(), config.jwt.secret);
}
