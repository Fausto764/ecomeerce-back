import { getDBConnection } from "../db/db";

//funcion para retornan todos los productos
export async function getAllProducts() {
  const db = await getDBConnection();
  return db.all("SELECT * FROM products");
}
//retornar producto por id
export async function getProductById(product_id) {
  const db = await getDBConnection();
  const product = await db.get(
    `
            SELECT FROM products
            WHERE product_id = ?
            `,
    [product_id]
  );
  return product || null;
}
//crear nuevo producto
export async function createProduct({
  name,
  description,
  price,
  stock,
  image_url,
  category_id,
}) {
  const db = await getDBConnection();
  const result = await db.run(
    ` 
        INSERT INTO products(name,description,price,stock,image_url,category_id)
        VALUES(?,?,?,?,?,?)
        
    `,
    [name, description, price, stock, image_url, category_id]
  );
  //   resul.lastID devuelve el id del ultimo elemento insertado es una prop especifica del metodo insert en sqlite3
  return { product_id: result.lastID };
}

//actualizar un producto
export async function updateProduct(
  product_id,
  { name, description, price, stock, image_url, category_id }
) {
  const db = await getDBConnection();
  const result = await db.run(
    ` 
           UPDATE products SET
           name = COALESCE(?, name),
           description = COALESCE(?, description),
           price = COALESCE(?, price),
           stock = COALESCE(?,stock),
           image_url = COALESCE(?,image_url),
           category_id = COALESCE(?,category_id),
           updated_at = datetime('now')
           WHERE product_id = ? 
        `,
    [name, description, price, stock, image_url, category_id, product_id]
  );
  return { changes: result.changes };
}
//eliminar un producto
export async function deleteProduct(product_id) {
  const db = await getDBConnection();
  const result = await db.run(
    ` 
        DELETE FROM products
        WHERE product_id = ?
        `,
    [product_id]
  );
  return { changes: result.changes };
}
