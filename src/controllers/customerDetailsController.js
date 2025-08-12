// controllers/customerDetailsController.js
import {
  createCustomerDetails,
  getAllCustomerDetails,
  getCustomerDetailsById,
  getCustomerDetailsByUserId,
  updateCustomerDetails,
  deleteCustomerDetails,
} from "../models/customerDetailsModel.js";

// Crear detalles
export async function handleCreateCustomerDetails(req, res) {
  try {
    const data = req.body;
    const result = await createCustomerDetails(data);
    res.status(201).json({ message: "Detalles creados", ...result });
    //el punteado expande las propiedades de result
  } catch (error) {
    res
      .status(500) // internal server error
      .json({ error: "Error al crear detalles", details: error.message });
  }
}

// Obtener todos
export async function handleGetAllCustomerDetails(req, res) {
  try {
    const details = await getAllCustomerDetails();
    res.json(details);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener detalles", details: error.message });
  }
}

// Obtener por ID (del detalle)
export async function handleGetCustomerDetailsById(req, res) {
  try {
    const customer_details_id = req.params.customer_details_id;
    const detail = await getCustomerDetailsById(customer_details_id);
    if (detail) {
      res.json(detail);
    } else {
      //no encontro los detalles
      res.status(404).json({ error: "Detalles no encontrados" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al buscar detalles", details: error.message });
  }
}

// Obtener por ID de usuario
export async function handleGetCustomerDetailsByUserId(req, res) {
  try {
    const user_id = req.params.user_id;
    const detail = await getCustomerDetailsByUserId(user_id);
    if (detail) {
      res.json(detail);
    } else {
      res
        .status(404)
        .json({ error: "Detalles no encontrados para este usuario" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error al buscar detalles por usuario",
      details: error.message,
    });
  }
}

// Actualizar
export async function handleUpdateCustomerDetails(req, res) {
  try {
    const customer_details_id = req.params.customer_details_id;
    const data = req.body;
    const result = await updateCustomerDetails(customer_details_id, data);
    if (result.changes > 0) {
      res.json({ message: "Detalles actualizados", ...result });
    } else {
      res.status(404).json({ error: "Detalles no encontrados o sin cambios" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar", details: error.message });
  }
}

// Eliminar
export async function handleDeleteCustomerDetails(req, res) {
  try {
    const customer_details_id = req.params.customer_details_id;
    const result = await deleteCustomerDetails(customer_details_id);
    if (result.changes > 0) {
      res.json({ message: "Detalles eliminados" });
    } else {
      res.status(404).json({ error: "Detalles no encontrados" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar", details: error.message });
  }
}
