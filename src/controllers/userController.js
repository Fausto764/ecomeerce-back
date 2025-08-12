import { generateToken } from "./authController.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getUserByEmail,
} from "../models/userModel.js";

// Obtener todos los usuarios
export async function handleGetAllUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener usuarios", details: error.message });
  }
}

// Obtener un usuario por ID
export async function handleGetUserById(req, res) {
  try {
    const user_id = req.params.user_id;
    const user = await getUserById(user_id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al buscar usuario", details: error.message });
  }
}

// Crear un nuevo usuario
export async function handleCreateUser(req, res) {
  try {
    const { email, password, role } = req.body;

    const newUser = await createUser({ email, password, role });
    const token = generateToken(newUser);

    res.status(201).json({ message: "Usuario creado", user: newUser, token });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear usuario", details: error.message });
  }
}

// Actualizar usuario
export async function handleUpdateUser(req, res) {
  try {
    const user_id = req.params.user_id;
    const data = req.body;
    const result = await updateUser(user_id, data);

    if (result.changes > 0) {
      res.json({ message: "Usuario actualizado", ...result });
    } else {
      res.status(404).json({ error: "Usuario no encontrado o sin cambios" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar usuario", details: error.message });
  }
}

// Eliminar usuario
export async function handleDeleteUser(req, res) {
  try {
    const user_id = req.params.user_id;
    const result = await deleteUser(user_id);

    if (result.changes > 0) {
      res.json({ message: "Usuario eliminado" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar usuario", details: error.message });
  }
}
//login

export async function handleLoginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password); // sin la contraseña

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = generateToken(user); // ✅ Generamos el token

    res.json({
      message: "Login exitoso",
      user,
      token, // ✅ Devolvés el token al frontend
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Obtener un usuario por email (POST)
export async function handleGetUserByEmail(req, res) {
  try {
    const { email } = req.body; // ← Datos vienen del cuerpo (body) de la solicitud POST

    if (!email) {
      return res
        .status(400)
        .json({ error: "El campo 'email' es requerido en el body" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario por email: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
