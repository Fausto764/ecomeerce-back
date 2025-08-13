import { getDBConnection } from "../db/db.js";

// Crear un pedido
export async function createOrder({
  user_id,
  total_amount,
  status = "pending",
}) {
  const db = await getDBConnection();
  const result = await db.run(
    `INSERT INTO orders (user_id, total_amount, status, created_at) 
     VALUES (?, ?, ?, datetime('now'))`,
    [user_id, total_amount, status]
  );
  return { order_id: result.lastID };
}

// Obtener pedido por ID
export async function getOrderById(order_id) {
  const db = await getDBConnection();
  return await db.get(`SELECT * FROM orders WHERE order_id = ?`, [order_id]);
}

// Obtener todos los pedidos de un usuario
export async function getOrdersByUser(user_id) {
  const db = await getDBConnection();
  return await db.all(
    `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    [user_id]
  );
}

// Actualizar estado del pedido
export async function updateOrder(order_id, { status, total_amount }) {
  const db = await getDBConnection();
  const result = await db.run(
    `UPDATE orders 
     SET status = COALESCE(?, status), 
         total_amount = COALESCE(?, total_amount),
         updated_at = datetime('now')
     WHERE order_id = ?`,
    [status, total_amount, order_id]
  );
  return { changes: result.changes };
}

// Borrar pedido
export async function deleteOrder(order_id) {
  const db = await getDBConnection();
  const result = await db.run(`DELETE FROM orders WHERE order_id = ?`, [
    order_id,
  ]);
  return { changes: result.changes };
}
