import bcrypt, { hash } from "bcrypt";

import { getDBConnection } from "../db/db.js";

//Todas las funciones esperan que la base de datos este conectada con el await

// funcion que retorna todos los usuarios
export async function getAllUsers() {
  const db = await getDBConnection();
  const users = await db.all("SELECT * FROM users");
  if (!users) return null;

  // Para cada usuario, eliminar la contraseña
  const safeUsers = users.map(({ password, ...safeUser }) => safeUser);

  return safeUsers;
}
//funcion para buscar un solo resultado
export async function getUserById(user_id) {
  const db = await getDBConnection();
  const user = await db.get("SELECT * FROM users WHERE user_id = ?", [user_id]);
  //si no encuentra el usuario
  if (!user) return null;

  // Elimina la contraseña antes de devolver
  const { password, ...safeUser } = user;
  return safeUser;
}
// conseguir datos por email
export async function getUserByEmail(email) {
  const db = await getDBConnection();
  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);

  if (!user) {
    return null;
  }
  const { password, ...safeUser } = user;
  return safeUser;
}
//funcion para crear un nuevo usuario
export async function createUser({ email, password, role = "customer" }) {
  const db = await getDBConnection();
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("El email ya está registrado");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.run(
    `
           INSERT INTO users(email,password,role) 
           VALUES(?,?,?) 
        `,
    [email, hashedPassword, role]
  );
  //Le ingresa directamente el lastId
  const user = await getUserById(result.lastID);
  return user;
}
//funcion para actualizar un usuario
export async function updateUser(user_id, { email, password, role }) {
  const db = await getDBConnection();
  //si la contraseña se cambia se vuelve a hashear sino no se hashea
  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }
  const result = await db.run(
    `
   UPDATE users SET email = COALESCE(?, email), 
   password = COALESCE(?, password),
   role = COALESCE(?, role)
   WHERE user_id = ?
    `,
    [email, hashedPassword, role, user_id]
  );
  return { changes: result.changes };
}
//funcion para borrar un usuario

export async function deleteUser(user_id) {
  const db = await getDBConnection();
  const result = await db.run(
    `
            DELETE  FROM users WHERE user_id = ?
        `,
    [user_id]
  );
  return { changes: result.changes };
}
//  login (comparar password con el hash)
export async function loginUser(email, password) {
  const db = await getDBConnection();

  // 1. Buscar usuario por email y seleccionar todos sus datos
  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);

  if (!user) {
    return null; // Usuario no encontrado
  }

  // 2. Comparar la contraseña ingresada con el hash almacenado
  //user.password es la consultada y password es la ingresada en la peticion
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return null; // Contraseña incorrecta
  }

  // 3. Devolver datos del usuario (sin la contraseña)
  const { password: _, ...safeUser } = user; // eliminamos la contraseña del resultado
  return safeUser;
}
