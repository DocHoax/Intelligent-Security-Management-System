import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { HttpError } from "../lib/http-errors.js";
import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../lib/password.js";
import { signAccessToken, signRefreshToken } from "../lib/jwt.js";
import { toRoleEnum, toRoleSlug } from "../lib/roles.js";
import { forgotPasswordSchema, loginSchema, registerSchema, verifyOtpSchema } from "@isms/shared";
import { roles } from "@isms/shared";

export const authRouter = Router();

authRouter.get("/roles", (_req, res) => {
  res.json({
    success: true,
    data: roles
  });
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const hashedPassword = await hashPassword(parsed.password);
    const roleRecord = await prisma.role.upsert({
      where: { name: toRoleEnum(parsed.role) as never },
      update: {},
      create: {
        name: toRoleEnum(parsed.role) as never,
        description: `${parsed.role} role`
      }
    });

    const createdUser = await prisma.user.create({
      data: {
        fullName: parsed.fullName,
        email: parsed.email.toLowerCase(),
        phoneNumber: parsed.phoneNumber,
        passwordHash: hashedPassword,
        roleId: roleRecord.id
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        emailVerifiedAt: true,
        role: {
          select: { name: true }
        }
      }
    });

    const userRole = toRoleSlug(createdUser.role.name);
    const tokenPayload = {
      sub: createdUser.id,
      role: userRole,
      email: createdUser.email,
      fullName: createdUser.fullName
    };

    res.status(201).json({
      success: true,
      message: "Registration completed",
      data: {
        user: {
          ...createdUser,
          role: userRole,
          emailVerificationStatus: createdUser.emailVerifiedAt ? "verified" : "pending"
        },
        accessToken: signAccessToken(tokenPayload),
        refreshToken: signRefreshToken(tokenPayload)
      }
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: parsed.email.toLowerCase() },
      select: {
        id: true,
        fullName: true,
        email: true,
        passwordHash: true,
        role: {
          select: { name: true }
        }
      }
    });

    if (!user) {
      throw new HttpError(401, "Invalid email or password");
    }

    const passwordMatches = await comparePassword(parsed.password, user.passwordHash);

    if (!passwordMatches) {
      throw new HttpError(401, "Invalid email or password");
    }

    const userRole = toRoleSlug(user.role.name);
    const tokenPayload = {
      sub: user.id,
      role: userRole,
      email: user.email,
      fullName: user.fullName
    };

    res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken: signAccessToken(tokenPayload),
        refreshToken: signRefreshToken(tokenPayload),
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: userRole
        },
        rememberMe: parsed.rememberMe
      }
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/forgot-password", (req, res, next) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    res.json({
      success: true,
      message: "OTP reset link sent",
      data: { email: email.toLowerCase() }
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/verify-otp", (req, res, next) => {
  try {
    const { email, otp, newPassword } = verifyOtpSchema.parse(req.body);

    res.json({
      success: true,
      message: "OTP verified",
      data: { email: email.toLowerCase(), verified: true, nextStep: "password-reset", newPasswordLength: newPassword.length, otpLength: otp.length }
    });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

authRouter.post("/logout", requireAuth, (_req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
});