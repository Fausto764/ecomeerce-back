import express from "express";

import {
  handleCreateCategory,
  handleDeleteCategory,
  handleGetAllCategories,
  handleGetCategoryById,
  handleUpdateCategory,
} from "../controllers/categoryController";

import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/", handleGetAllCategories);
router.get("/:category_id", handleGetCategoryById);

// Solo admin
router.post("/", authMiddleware, roleMiddleware("admin"), handleCreateCategory);
router.put(
  "/:category_id",
  authMiddleware,
  roleMiddleware("admin"),
  handleUpdateCategory
);
router.delete(
  "/:category_id",
  authMiddleware,
  roleMiddleware("admin"),
  handleDeleteCategory
);

export default router;
