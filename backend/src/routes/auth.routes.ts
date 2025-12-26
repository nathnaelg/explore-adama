// src/routes/auth.routes.ts
import { Router } from "express";
import { auth as authMiddleware } from "../middleware/auth.ts"; // ensures req.user exists for revokeAll
import {
  forgotPassword,
  login,
  logout,
  refresh,
  register,
  resetPassword,
  revokeAll,
  socialLogin
} from "../modules/auth/auth.controller.ts";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/social", socialLogin);
router.post("/refresh", refresh);
router.post("/logout", logout);

// revoke all sessions for current user
router.post("/revoke-all", authMiddleware, revokeAll);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
