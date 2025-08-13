import express from "express";
import {
  handleGetAllProducts,
  handleGetProductById,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
} from "../controllers/productController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", handleGetAllProducts);
router.get("/:id", handleGetProductById);

// Solo admin
router.post("/", authMiddleware, roleMiddleware("admin"), handleCreateProduct);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  handleUpdateProduct
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  handleDeleteProduct
);

export default router;
