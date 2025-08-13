import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../models/categoryModel.js";

// Obtener todas las categorías
export async function handleGetAllCategories(req, res) {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener categorías", details: error.message });
  }
}

// Obtener categoría por ID
export async function handleGetCategoryById(req, res) {
  try {
    const category_id = req.params.category_id;
    const category = await getCategoryById(category_id);
    if (!category)
      return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(category);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener categoría", details: error.message });
  }
}

// Crear categoría
export async function handleCreateCategory(req, res) {
  try {
    const { name, description } = req.body;
    if (!name)
      return res.status(400).json({ error: "El nombre es obligatorio" });

    const result = await createCategory({ name, description });
    res
      .status(201)
      .json({ message: "Categoría creada", category_id: result.category_id });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear categoría", details: error.message });
  }
}

// Actualizar categoría
export async function handleUpdateCategory(req, res) {
  try {
    const category_id = req.params.category_id;
    const { name, description } = req.body;

    const result = await updateCategory(category_id, { name, description });
    if (result.changes > 0) {
      res.json({ message: "Categoría actualizada" });
    } else {
      res.status(404).json({ error: "Categoría no encontrada o sin cambios" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar categoría", details: error.message });
  }
}

// Borrar categoría
export async function handleDeleteCategory(req, res) {
  try {
    const category_id = req.params.category_id;

    const result = await deleteCategory(category_id);
    if (result.changes > 0) {
      res.json({ message: "Categoría eliminada" });
    } else {
      res.status(404).json({ error: "Categoría no encontrada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar categoría", details: error.message });
  }
}
