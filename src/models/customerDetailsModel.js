import { getDBConnection } from "../db/db.js";

// Crear detalles de un usuario
export async function createCustomerDetails({
  user_id,
  full_name,
  phone,
  address,
  city,
  province,
  country,
}) {
  const db = await getDBConnection();
  const result = await db.run(
    `
    INSERT INTO customer_details (
      user_id, full_name, phone, address, city, province, country
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [user_id, full_name, phone, address, city, province, country]
  );
  return { customer_details_id: result.lastID };
}

// Obtener todos los detalles
export async function getAllCustomerDetails() {
  const db = await getDBConnection();
  return await db.all(`SELECT * FROM customer_details`);
}

// Obtener detalles por ID del detalle
export async function getCustomerDetailsById(customer_details_id) {
  const db = await getDBConnection();
  return await db.get(
    `SELECT * FROM customer_details WHERE customer_details_id = ?`,
    [customer_details_id]
  );
}

// Obtener detalles por ID de usuario
export async function getCustomerDetailsByUserId(user_id) {
  const db = await getDBConnection();
  return await db.get(`SELECT * FROM customer_details WHERE user_id = ?`, [
    user_id,
  ]);
}

// Actualizar detalles
export async function updateCustomerDetails(
  customer_details_id,
  { full_name, phone, address, city, province, country }
) {
  const db = await getDBConnection();
  const result = await db.run(
    `
    UPDATE customer_details SET
      full_name = COALESCE(?, full_name),
      phone = COALESCE(?, phone),
      address = COALESCE(?, address),
      city = COALESCE(?, city),
      province = COALESCE(?, province),
      country = COALESCE(?, country)
    WHERE customer_details_id = ?
    `,
    [full_name, phone, address, city, province, country, customer_details_id]
  );
  return { changes: result.changes };
}

// Eliminar detalles
export async function deleteCustomerDetails(customer_details_id) {
  const db = await getDBConnection();
  const result = await db.run(
    `DELETE FROM customer_details WHERE customer_details_id = ?`,
    [customer_details_id]
  );
  return { changes: result.changes };
}
