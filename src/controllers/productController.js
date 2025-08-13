import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../models/productModel.js";

// Obtener todos los productos
export async function handleGetAllProducts(req, res) {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener productos", details: error.message });
  }
}

// Obtener un producto por ID
export async function handleGetProductById(req, res) {
  try {
    const product_id = req.params.product_id;
    const result = await getProductById(product_id);
    if (!result) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al buscar producto", details: error.message });
  }
}

// Crear producto
export async function handleCreateProduct(req, res) {
  try {
    const { name, description, price, stock, image_url } = req.body;

    if (!name || !description || isNaN(price) || isNaN(stock)) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    const result = await createProduct({
      name,
      description,
      price,
      stock,
      image_url,
    });
    res.status(201).json({ message: "Producto creado", product_id: result });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear producto", details: error.message });
  }
}

// Actualizar producto
export async function handleUpdateProduct(req, res) {
  try {
    const product_id = req.params.product_id;
    const data = req.body;

    const result = await updateProduct(product_id, data);

    if (result.changes > 0) {
      res.json({ message: "Producto actualizado" });
    } else {
      res.status(404).json({ error: "Producto no encontrado o sin cambios" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar producto", details: error.message });
  }
}

// Eliminar producto
export async function handleDeleteProduct(req, res) {
  try {
    const product_id = req.params.product_id;
    const result = await deleteProduct(product_id);

    if (result.changes > 0) {
      res.json({ message: "Producto eliminado" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar producto", details: error.message });
  }
}
