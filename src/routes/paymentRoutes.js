import express from "express";
import {
  handleCreatePayment,
  handleUpdatePaymentStatus,
  handleGetPaymentsByOrder,
} from "../controllers/paymentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, handleCreatePayment);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  handleUpdatePaymentStatus
);
router.get(
  "/order/:order_id",
  authMiddleware,
  roleMiddleware("admin"),
  handleGetPaymentsByOrder
);

export default router;
