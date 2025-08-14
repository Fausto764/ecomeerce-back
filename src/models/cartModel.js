import { getDBConnection } from "../db/db.js";

// Crear un carrito
export async function createCart(user_id) {
  const db = await getDBConnection();
  const result = await db.run(`INSERT INTO carts (user_id) VALUES (?)`, [
    user_id,
  ]);
  return { cart_id: result.lastID };
}

// Agregar item al carrito
export async function addItemToCart(cart_id, { product_id, name, quantity }) {
  const db = await getDBConnection();
  const result = await db.run(
    `INSERT INTO cart_items (cart_id, product_id, name, quantity)
     VALUES (?, ?, ?, ?)`,
    [cart_id, product_id, name, quantity]
  );
  return { cart_item_id: result.lastID };
}

// Obtener carrito completo con productos
export async function getCartById(cart_id) {
  const db = await getDBConnection();
  const cart = await db.get(`SELECT * FROM carts WHERE cart_id = ?`, [cart_id]);
  if (!cart) return null;
  const items = await db.all(`SELECT * FROM cart_items WHERE cart_id = ?`, [
    cart_id,
  ]);
  return { ...cart, items };
}

// Vaciar carrito
export async function clearCart(cart_id) {
  const db = await getDBConnection();
  await db.run(`DELETE FROM cart_items WHERE cart_id = ?`, [cart_id]);
  return { message: "Carrito vaciado" };
}

//obtener el producto del carrito
export async function getCartItem(user_id, product_id) {
  const db = await getDBConnection();
  const cartItem = await db.get(
    "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
    [user_id, product_id]
  );
  return cartItem; // { id, user_id, product_id, quantity } o undefined
}
