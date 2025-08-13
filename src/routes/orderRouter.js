import express from "express";
import {
  handleCreateOrder,
  handleGetOrderById,
  handleGetOrdersByUser,
  handleUpdateOrder,
  handleDeleteOrder,
} from "../controllers/orderController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Solo usuarios autenticados pueden crear/ver sus pedidos
router.post("/orders", authMiddleware, handleCreateOrder);
router.get("/orders/user/:user_id", authMiddleware, handleGetOrdersByUser);
router.get("/orders/:order_id", authMiddleware, handleGetOrderById);

// Solo admin puede actualizar o eliminar pedidos
router.put(
  "/orders/:order_id",
  authMiddleware,
  roleMiddleware("admin"),
  handleUpdateOrder
);
router.delete(
  "/orders/:order_id",
  authMiddleware,
  roleMiddleware("admin"),
  handleDeleteOrder
);

export default router;
