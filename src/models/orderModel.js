import { getDBConnection } from "../db/db.js";

/* -------------------- ORDENES -------------------- */

// Crear una orden (con payment_id opcional)
export async function createOrder({
  user_id,
  total_amount,
  payment_id = null,
  status = "pending",
}) {
  const db = await getDBConnection();
  const result = await db.run(
    `INSERT INTO orders (user_id, total_amount, payment_id, status, created_at) 
     VALUES (?, ?, ?, ?, datetime('now'))`,
    [user_id, total_amount, payment_id, status]
  );
  return { order_id: result.lastID };
}

// Obtener pedido por ID
export async function getOrderById(order_id) {
  const db = await getDBConnection();
  return db.get(`SELECT * FROM orders WHERE order_id = ?`, [order_id]);
}

// Obtener todos los pedidos de un usuario
export async function getOrdersByUser(user_id) {
  const db = await getDBConnection();
  return db.all(
    `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    [user_id]
  );
}

// Actualizar estado o total de una orden
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

/* -------------------- DETALLES DE ORDEN -------------------- */

// Crear detalles de la orden
export async function createOrderDetails(order_id, items) {
  const db = await getDBConnection();
  //db.prepare crea una consulta parametrizada (con ?) que se reutilizará varias veces, es mas rapido y seguro
  const stmt = await db.prepare(
    `INSERT INTO order_details(order_id, product_id, quantity, price)
     VALUES (?, ?, ?, ?)`
  );

  for (const item of items) {
    //recorre la orden, por cada producto se inserta una fila con sus datos
    await stmt.run(order_id, item.product_id, item.quantity, item.price);
  }
  await stmt.finalize();
  //cierra la consulta preparada y libera memoria
}
//---------HACER LUEGO DE QUE SE CONFIRME EL PAGO-------

// Reducir stock del producto
export async function reduceProductStock(product_id, quantity) {
  const db = await getDBConnection();
  await db.run(`UPDATE products SET stock = stock - ? WHERE product_id = ?`, [
    quantity,
    product_id,
  ]);
}

//------------------------------------------------------------

// Obtener items del carrito del usuario
export async function getCartItems(user_id) {
  const db = await getDBConnection();
  //hace un join que muestra la cantidad y producto del carrito junto a su precio y stock disponible por el id del usuario
  return db.all(
    `SELECT c.product_id, c.quantity, p.price, p.stock 
     FROM cart_items c 
     JOIN products p ON c.product_id = p.product_id
     WHERE c.user_id = ?`,
    [user_id]
  );
}

// Vaciar carrito del usuario
export async function clearCart(user_id) {
  const db = await getDBConnection();
  await db.run(`DELETE FROM cart_items WHERE user_id = ?`, [user_id]);
}
