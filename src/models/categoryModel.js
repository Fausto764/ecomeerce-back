import { getDBConnection } from "../db/db";

//obtener todas las categorias
export async function getAllCategories() {
  const db = await getDBConnection();
  const categories = await db.get(` 
        SELECT * FROM categories
        `);
  return categories;
}

// Obtener categoría por ID
export async function getCategoryById(category_id) {
  const db = await getDBConnection();
  return await db.get(`SELECT * FROM categories WHERE category_id = ?`, [
    category_id,
  ]);
}

// Crear nueva categoría
export async function createCategory({ name, description }) {
  const db = await getDBConnection();
  const result = await db.run(
    `INSERT INTO categories (name, description, created_at) VALUES (?, ?, datetime('now'))`,
    [name, description]
  );
  return { category_id: result.lastID };
}

// Actualizar categoría
export async function updateCategory(category_id, { name, description }) {
  const db = await getDBConnection();
  const result = await db.run(
    `UPDATE categories 
     SET name = COALESCE(?, name), description = COALESCE(?, description)
     WHERE category_id = ?`,
    [name, description, category_id]
  );
  return { changes: result.changes };
}

// Borrar categoría
export async function deleteCategory(category_id) {
  const db = await getDBConnection();
  const result = await db.run(`DELETE FROM categories WHERE category_id = ?`, [
    category_id,
  ]);
  return { changes: result.changes };
}
