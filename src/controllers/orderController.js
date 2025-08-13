import {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrder,
  deleteOrder,
} from "../models/orderModel.js";

import {
  createOrderDetail,
  getOrderDetailsByOrder,
  updateOrderDetail,
  deleteOrderDetail,
} from "../models/orderDetailsModel.js";

// Crear pedido
export async function handleCreateOrder(req, res) {
  try {
    const { user_id, total_amount, details } = req.body;

    if (!user_id || !Array.isArray(details) || details.length === 0) {
      return res
        .status(400)
        .json({ error: "Usuario y detalles del pedido son obligatorios" });
    }

    if (isNaN(total_amount) || total_amount <= 0) {
      return res.status(400).json({ error: "Total inválido" });
    }

    const order = await createOrder({ user_id, total_amount });

    // Crear detalles
    for (const item of details) {
      const { product_id, quantity, price } = item;
      if (!product_id || !quantity || !price || quantity <= 0 || price <= 0) {
        return res.status(400).json({ error: "Detalle del pedido inválido" });
      }
      await createOrderDetail({
        order_id: order.order_id,
        product_id,
        quantity,
        price,
      });
    }

    res
      .status(201)
      .json({ message: "Pedido creado", order_id: order.order_id });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear pedido", details: error.message });
  }
}

// Obtener pedido por ID
export async function handleGetOrderById(req, res) {
  try {
    const order_id = req.params.order_id;
    const order = await getOrderById(order_id);
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });

    const details = await getOrderDetailsByOrder(order_id);
    res.json({ ...order, details });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener pedido", details: error.message });
  }
}

// Obtener pedidos de un usuario
export async function handleGetOrdersByUser(req, res) {
  try {
    const user_id = req.params.user_id;
    const orders = await getOrdersByUser(user_id);
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener pedidos", details: error.message });
  }
}

// Actualizar pedido
export async function handleUpdateOrder(req, res) {
  try {
    const order_id = req.params.order_id;
    const { status, total_amount } = req.body;

    if (
      status &&
      !["pending", "paid", "shipped", "cancelled"].includes(status)
    ) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const result = await updateOrder(order_id, { status, total_amount });
    if (result.changes > 0) {
      res.json({ message: "Pedido actualizado" });
    } else {
      res.status(404).json({ error: "Pedido no encontrado o sin cambios" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar pedido", details: error.message });
  }
}

// Borrar pedido
export async function handleDeleteOrder(req, res) {
  try {
    const order_id = req.params.order_id;
    const result = await deleteOrder(order_id);
    if (result.changes > 0) {
      res.json({ message: "Pedido eliminado" });
    } else {
      res.status(404).json({ error: "Pedido no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar pedido", details: error.message });
  }
}
