require("dotenv").config();

const express = require("express");
const pool = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS resultado");

    res.json({
      status: "ok",
      database: rows[0].resultado === 1 ? "connected" : "error",
    });
  } catch (error) {
    console.error("Error al conectar con MySQL:", error.message);

    res.status(500).json({
      status: "error",
      message: "No se pudo conectar con la base de datos",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
