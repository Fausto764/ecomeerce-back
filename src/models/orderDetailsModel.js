import { getDBConnection } from "../db/db.js";

// Agregar detalle a un pedido
export async function createOrderDetail({
  order_id,
  product_id,
  quantity,
  price,
}) {
  const db = await getDBConnection();
  const result = await db.run(
    `INSERT INTO order_details (order_id, product_id, quantity, price)
     VALUES (?, ?, ?, ?)`,
    [order_id, product_id, quantity, price]
  );
  return { order_detail_id: result.lastID };
}

// Obtener detalles de un pedido
export async function getOrderDetailsByOrder(order_id) {
  const db = await getDBConnection();
  return await db.all(
    `SELECT od.*, p.name AS product_name, p.image_url
     FROM order_details od
     LEFT JOIN products p ON od.product_id = p.product_id
     WHERE od.order_id = ?`,
    [order_id]
  );
}

// Actualizar detalle de pedido
export async function updateOrderDetail(order_detail_id, { quantity, price }) {
  const db = await getDBConnection();
  const result = await db.run(
    `UPDATE order_details
     SET quantity = COALESCE(?, quantity),
         price = COALESCE(?, price)
     WHERE order_detail_id = ?`,
    [quantity, price, order_detail_id]
  );
  return { changes: result.changes };
}

// Borrar detalle de pedido
export async function deleteOrderDetail(order_detail_id) {
  const db = await getDBConnection();
  const result = await db.run(
    `DELETE FROM order_details WHERE order_detail_id = ?`,
    [order_detail_id]
  );
  return { changes: result.changes };
}
