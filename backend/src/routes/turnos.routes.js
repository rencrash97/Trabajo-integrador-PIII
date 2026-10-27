import { Router } from "express";
import { TurnosController } from "../controllers/turnos.controller.js";

const router = Router();
router.get("/api/turnos", TurnosController.getTurnos);

export default router;
