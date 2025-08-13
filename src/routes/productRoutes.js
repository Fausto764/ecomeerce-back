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

router.get("/products", handleGetAllProducts);
router.get("/products/:id", handleGetProductById);

// Solo admin
router.post(
  "/products",
  authMiddleware,
  roleMiddleware("admin"),
  handleCreateProduct
);
router.put(
  "/products/:id",
  authMiddleware,
  roleMiddleware("admin"),
  handleUpdateProduct
);
router.delete(
  "/products/:id",
  authMiddleware,
  roleMiddleware("admin"),
  handleDeleteProduct
);

export default router;
