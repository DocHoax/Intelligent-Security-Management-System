import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { HttpError } from "../lib/http-errors.js";

export const authRouter = Router();

authRouter.get("/roles", (_req, res) => {
  res.json({
    success: true,
    data: ["admin", "security-personnel", "staff", "visitor"]
  });
});

authRouter.post("/register", (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, role, password } = req.body as Record<string, string>;

    if (!fullName || !email || !role || !password) {
      throw new HttpError(400, "Missing registration fields");
    }

    res.status(201).json({
      success: true,
      message: "Registration accepted",
      data: {
        user: {
          id: "usr_demo_001",
          fullName,
          email,
          phoneNumber: phoneNumber ?? "",
          role,
          emailVerificationStatus: "pending"
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", (req, res, next) => {
  try {
    const { email, password } = req.body as Record<string, string>;

    if (!email || !password) {
      throw new HttpError(400, "Email and password are required");
    }

    res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken: "demo-admin:user-001",
        refreshToken: "demo-refresh-token",
        user: {
          id: "user-001",
          fullName: "Demo Admin",
          email,
          role: "admin"
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/forgot-password", (req, res, next) => {
  try {
    const { email } = req.body as Record<string, string>;

    if (!email) {
      throw new HttpError(400, "Email is required");
    }

    res.json({
      success: true,
      message: "OTP reset link sent",
      data: { email }
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/verify-otp", (req, res, next) => {
  try {
    const { email, otp } = req.body as Record<string, string>;

    if (!email || !otp) {
      throw new HttpError(400, "Email and OTP are required");
    }

    res.json({
      success: true,
      message: "OTP verified",
      data: { email, verified: true }
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