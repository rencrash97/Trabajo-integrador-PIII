import { Router } from "express";
import { EspaciosController } from "../controllers/espacios.controller.js";

const router = Router();

router.get("/api/espacios", EspaciosController.getActiveEspacios);
router.get("/api/espacios/:id", EspaciosController.getById);
router.get(
  "/api/espacios/:id/disponibilidad",
  EspaciosController.getDisponibilidad,
);

export default router;
