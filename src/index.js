import express from "express";
import userRoutes from "./routes/userRoutes.js";
import customerDetailsRoutes from "./routes/customerDetailsRoutes.js";
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
//puerto
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server listening on port: ", PORT);
});
