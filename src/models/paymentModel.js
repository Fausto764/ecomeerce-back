import { getDBConnection } from "../db/db.js";

// Crear pago
export async function createPayment({
  order_id,
  payment_method,
  amount,
  transaction_id,
}) {
  const db = await getDBConnection();
  const result = await db.run(
    `
    INSERT INTO payments (order_id, payment_method, amount, transaction_id, payment_status)
    VALUES (?, ?, ?, ?, 'pending')
    `,
    [order_id, payment_method, amount, transaction_id]
  );
  return { payment_id: result.lastID };
}

// Actualizar estado del pago
export async function updatePaymentStatus(payment_id, payment_status) {
  const db = await getDBConnection();
  const result = await db.run(
    `
    UPDATE payments
    SET payment_status = ?, payment_date = datetime('now')
    WHERE payment_id = ?
    `,
    [payment_status, payment_id]
  );
  return { changes: result.changes };
}

// Obtener pagos por orden
export async function getPaymentsByOrder(order_id) {
  const db = await getDBConnection();
  return await db.all(
    `
    SELECT * FROM payments WHERE order_id = ?
    `,
    [order_id]
  );
}
