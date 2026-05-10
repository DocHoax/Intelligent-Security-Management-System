import jwt from "jsonwebtoken";
import { env } from "./env.js";

export type JwtUserPayload = {
  sub: string;
  role: string;
  email: string;
  fullName: string;
};

export function signAccessToken(payload: JwtUserPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(payload: JwtUserPayload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;
}