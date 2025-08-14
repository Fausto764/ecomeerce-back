import {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrder,
  deleteOrder,
  createOrderDetails,
  reduceProductStock,
  getCartItems,
  clearCart,
} from "../models/orderModel.js";

//----CHECKOUT ------

// Checkout: convierte el carrito en una orden real
export async function handleCheckout(req, res) {
  try {
    const user_id = req.user.user_id; // obtenemos el user_id desde el token autenticado
    const { payment_id } = req.body;

    // Obtener items del carrito
    const items = await getCartItems(user_id);
    if (!items.length) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    //  Validar stock
    for (const item of items) {
      if (item.quantity > item.stock) {
        return res.status(400).json({
          error: `Stock insuficiente para el producto ${item.product_id}`,
        });
      }
    }

    //  Calcular total
    const total_amount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    //  Crear la orden
    const { order_id } = await createOrder({
      user_id,
      total_amount,
      payment_id,
    });

    //  Crear detalles de la orden
    await createOrderDetails(order_id, items);

    //  Reducir stock --- HACER LUEGO DE QUE SE CONFIRME EL PAGO
    // for (const item of items) {
    //   await reduceProductStock(item.product_id, item.quantity);
    // }

    //  Vaciar carrito
    await clearCart(user_id);

    res.status(201).json({ message: "Orden creada con éxito", order_id });
  } catch (error) {
    console.error("Error en checkout:", error);
    res.status(500).json({ error: "Error al procesar el checkout" });
  }
}

//--------- ORDENES ----------

// Obtener pedido por ID
export async function handleGetOrderById(req, res) {
  try {
    const order_id = req.params.order_id;
    const order = await getOrderById(order_id);
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });

    // Para incluir detalles, si quieres, se pueden agregar
    res.json(order);
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
