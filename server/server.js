import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//Test route
app.get("/", (req, res) => {
  res.send("E-commerce API is running");
});

//Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
