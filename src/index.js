import express from "express";
//rutas
import userRoutes from "./routes/userRoutes.js";
import customerDetailsRoutes from "./routes/customerDetailsRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

import dotenv from "dotenv";

const app = express();
//CONFIG JWT
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
//midlewares
app.use(express.json());
//rutas
app.use("/api/users", userRoutes);
app.use("/api/customerDetails", customerDetailsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
//puerto
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server listening on port: ", PORT);
});
