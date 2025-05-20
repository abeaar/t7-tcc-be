import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  loginHandler,
  logout,
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();
router.get("/token", refreshToken);
router.post("/login", loginHandler);
router.delete("/logout", logout);

router.get("/users",getUsers);
router.get("/users-auth", verifyToken, getUsers);
router.get("/users:id", verifyToken, getUsers);
router.post("/register-user", verifyToken, createUser);
router.put("/update-user/:id", verifyToken, updateUser);
router.delete("/delete-user/:id", verifyToken, deleteUser);

export default router; 