import express from "express";
import {
  createUser,
  loginHandler,
  logout,
  getUser,
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get("/token", refreshToken);
router.post("/login", loginHandler);
router.delete("/logout", logout);

router.get("/users", getUser);
router.post("/users", verifyToken,createUser);

export default router; 