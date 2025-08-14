import {
  createCart,
  clearCart,
  addItemToCart,
  getCartById,
  getCartItem,
} from "../models/cartModel";
import { getProductStock } from "../models/productModel";
// Crear carrito para usuario
export async function handleCreateCart(req, res) {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id requerido" });
  }
  try {
    const cart = await createCart(user_id);
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: "error al crear carrito" });
  }
}

// Agregar producto al carrito
export async function handleAddItem(req, res) {
  const { cart_id } = req.params;
  const { product_id, name, quantity } = req.body;

  if (!product_id || !name || !quantity) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }
  if (quantity <= 0) {
    return res.status(400).json({ error: "Cantidad inválida" });
  }

  try {
    //controlar stock validacion
    const productStockData = await getProductStock(product_id);
    if (!productStockData) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    if (quantity > productStockData.stock) {
      return res.status(400).json({
        error: `Stock insuficiente. Solo hay ${productStockData.stock} unidades disponibles.`,
      });
    }
    //validation 2
    const existingItem = await getCartItem(user_id, product_id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          error: `Stock insuficiente. Ya tienes ${existingItem.quantity} en el carrito.`,
        });
      }
      await updateCartItem(user_id, product_id, newQuantity);
      return res.json({ message: "Cantidad actualizada en el carrito" });
    }
    // try catch
    const item = await addItemToCart(cart_id, { product_id, name, quantity });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
}

// Ver carrito
export async function handleGetCart(req, res) {
  const { cart_id } = req.params;
  try {
    const cart = await getCartById(cart_id);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
}

// Vaciar carrito
export async function handleClearCart(req, res) {
  const { cart_id } = req.params;
  try {
    const result = await clearCart(cart_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
}
