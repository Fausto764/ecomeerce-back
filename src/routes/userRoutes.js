import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
const router = express.Router();
import {
  handleCreateUser,
  handleDeleteUser,
  handleGetAllUsers,
  handleGetUserById,
  handleLoginUser,
  handleUpdateUser,
} from "../controllers/userController.js";

// Rutas públicas
router.post("/", handleCreateUser); // Crear usuario (público)
router.post("/login", handleLoginUser); // Login (público)

// Rutas protegidas
router.get("/", authMiddleware, roleMiddleware("admin"), handleGetAllUsers);
router.delete(
  "/:user_id",
  authMiddleware,
  roleMiddleware("admin"),
  handleDeleteUser
);
router.get(
  "/:user_id",
  authMiddleware,
  roleMiddleware("admin"),
  handleGetUserById
);
router.put(
  "/:user_id",
  authMiddleware,
  roleMiddleware("customer", "distributor", "supervisor", "admin"),
  handleUpdateUser
);

export default router;
