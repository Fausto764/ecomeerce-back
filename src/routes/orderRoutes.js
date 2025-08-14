import express from "express";
import {
  handleCheckout,
  handleGetOrderById,
  handleGetOrdersByUser,
  handleUpdateOrder,
  handleDeleteOrder,
} from "../controllers/orderController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* -------------------- CHECKOUT -------------------- */
// Solo usuarios autenticados pueden hacer checkout
router.post("/orders/checkout", authMiddleware, handleCheckout);

/* -------------------- CONSULTA DE ORDENES -------------------- */
// Obtener todas las órdenes de un usuario
router.get("/orders/user/:user_id", authMiddleware, handleGetOrdersByUser);

// Obtener una orden por ID
router.get("/orders/:order_id", authMiddleware, handleGetOrderById);

/* -------------------- ACTUALIZACION Y BORRADO -------------------- */
// Actualizar estado o total de la orden (solo admin o si es tu propia orden, puedes adaptar)
router.put(
  "/orders/:order_id",
  authMiddleware,
  roleMiddleware("admin"),
  handleUpdateOrder
);

// Borrar orden (solo admin)
router.delete(
  "/orders/:order_id",
  authMiddleware,
  roleMiddleware("admin"),
  handleDeleteOrder
);

export default router;
