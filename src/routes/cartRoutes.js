import express from "express";
import {
  handleCreateCart,
  handleAddItem,
  handleGetCart,
  handleClearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", handleCreateCart);
router.post("/:cart_id/item", handleAddItem);
router.get("/:cart_id", handleGetCart);
router.delete("/:cart_id", handleClearCart);

export default router;
