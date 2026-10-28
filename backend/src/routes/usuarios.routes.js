import { Router } from "express";
import { UsuariosController } from "../controllers/usuarios.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/api/usuarios", UsuariosController.register);

router.get("/api/usuarios/me", authenticateToken, UsuariosController.getMe);

export default router;
