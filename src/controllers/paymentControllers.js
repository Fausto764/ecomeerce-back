import {
  createPayment,
  updatePaymentStatus,
  getPaymentsByOrder,
} from "../models/paymentModel.js";
import { getOrderById, updateOrderStatus } from "../models/orderModel.js"; // Para actualizar el estado de la orden

// Crear un pago
export async function handleCreatePayment(req, res) {
  try {
    const { order_id, payment_method, amount, transaction_id } = req.body;

    if (!order_id || !payment_method || !amount) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const order = await getOrderById(order_id);
    if (!order) {
      return res.status(404).json({ error: "La orden no existe" });
    }

    const payment = await createPayment({
      order_id,
      payment_method,
      amount,
      transaction_id,
    });
    res.status(201).json({ message: "Pago creado correctamente", payment });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el pago" });
  }
}

// Actualizar estado del pago
export async function handleUpdatePaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    if (!payment_status) {
      return res
        .status(400)
        .json({ error: "El estado del pago es obligatorio" });
    }

    const result = await updatePaymentStatus(id, payment_status);

    // Si el pago fue exitoso, actualizar el estado de la orden
    if (payment_status === "paid") {
      const db = await getDBConnection();
      const order = await db.get(
        `SELECT order_id FROM payments WHERE payment_id = ?`,
        [id]
      );
      if (order) {
        await updateOrderStatus(order.order_id, "paid");
      }
    }

    res.json({ message: "Estado de pago actualizado", result });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el pago" });
  }
}

// Obtener pagos de una orden
export async function handleGetPaymentsByOrder(req, res) {
  try {
    const { order_id } = req.params;
    const payments = await getPaymentsByOrder(order_id);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los pagos" });
  }
}
