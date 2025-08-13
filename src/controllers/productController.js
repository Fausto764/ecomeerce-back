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
    const { name, description, price, stock, image_url, category_id } =
      req.body;

    // Validaciones básicas
    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "El nombre es obligatorio y debe ser un texto" });
    }

    if (price === undefined || isNaN(price) || price < 0) {
      return res.status(400).json({
        error: "El precio es obligatorio y debe ser un número positivo",
      });
    }

    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
      return res
        .status(400)
        .json({ error: "El stock debe ser un número mayor o igual a 0" });
    }

    // Validar que la categoría exista
    if (category_id) {
      // const category = await getCategoryById(category_id); // modelo de categorías
      if (!category) {
        return res
          .status(400)
          .json({ error: "La categoría especificada no existe" });
      }
    }

    // Si todo está bien, crear el producto
    const productId = await createProduct({
      name,
      description,
      price,
      stock,
      image_url,
      category_id,
    });

    res.status(201).json({
      message: "Producto creado exitosamente",
      product_id: productId,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al crear producto",
      details: error.message,
    });
  }
}

// Actualizar producto
export async function handleCreateProduct(req, res) {
  try {
    const { name, description, price, stock, image_url, category_id } =
      req.body;

    // Validaciones básicas
    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "El nombre es obligatorio y debe ser un texto" });
    }

    if (price === undefined || isNaN(price) || price < 0) {
      return res.status(400).json({
        error: "El precio es obligatorio y debe ser un número positivo",
      });
    }

    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
      return res
        .status(400)
        .json({ error: "El stock debe ser un número mayor o igual a 0" });
    }

    // Validar que la categoría exista
    if (category_id) {
      const category = await getCategoryById(category_id); // modelo de categorías
      if (!category) {
        return res
          .status(400)
          .json({ error: "La categoría especificada no existe" });
      }
    }

    // Si todo está bien, crear el producto
    const productId = await createProduct({
      name,
      description,
      price,
      stock,
      image_url,
      category_id,
    });

    res.status(201).json({
      message: "Producto creado exitosamente",
      product_id: productId,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al crear producto",
      details: error.message,
    });
  }
}

// Actualizar producto
export async function handleUpdateProduct(req, res) {
  try {
    const product_id = req.params.product_id;
    const { name, description, price, stock, image_url, category_id } =
      req.body;

    // Verificar que el producto exista
    const existingProduct = await getProductById(product_id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Validaciones
    if (name !== undefined && typeof name !== "string") {
      return res.status(400).json({ error: "El nombre debe ser un texto" });
    }

    if (price !== undefined && (isNaN(price) || price < 0)) {
      return res
        .status(400)
        .json({ error: "El precio debe ser un número positivo" });
    }

    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
      return res
        .status(400)
        .json({ error: "El stock debe ser un número mayor o igual a 0" });
    }

    if (category_id !== undefined) {
      const category = await getCategoryById(category_id);
      if (!category) {
        return res
          .status(400)
          .json({ error: "La categoría especificada no existe" });
      }
    }

    // Actualizar producto
    const result = await updateProduct(product_id, {
      name,
      description,
      price,
      stock,
      image_url,
      category_id,
    });

    if (result.changes > 0) {
      res.json({ message: "Producto actualizado" });
    } else {
      res.status(400).json({ error: "No se realizaron cambios" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar producto",
      details: error.message,
    });
  }
}

// Eliminar producto
export async function handleDeleteProduct(req, res) {
  try {
    const product_id = req.params.product_id;

    // Verificar que el producto exista
    const existingProduct = await getProductById(product_id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Borrar producto
    const result = await deleteProduct(product_id);

    if (result.changes > 0) {
      res.json({ message: "Producto eliminado" });
    } else {
      res.status(400).json({ error: "No se pudo eliminar el producto" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar producto",
      details: error.message,
    });
  }
}
