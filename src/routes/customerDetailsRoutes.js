import express from "express";
import {
  handleCreateCustomerDetails,
  handleDeleteCustomerDetails,
  handleGetAllCustomerDetails,
  handleGetCustomerDetailsById,
  handleGetCustomerDetailsByUserId,
  handleUpdateCustomerDetails,
} from "../controllers/customerDetailsController.js";
const router = express.Router();

router.get("/", handleGetAllCustomerDetails);
router.get("/:user_id", handleGetCustomerDetailsByUserId);
router.get("/:customer_details_id", handleGetCustomerDetailsById);
router.post("/", handleCreateCustomerDetails);
router.put("/customer_details_id", handleUpdateCustomerDetails);
router.delete("/:customer_details_id", handleDeleteCustomerDetails);

export default router;
