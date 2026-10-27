import { Router } from "express";
import { UsuariosController } from "../controllers/usuarios.controller.js";

const router = Router();

router.post("/api/usuarios", UsuariosController.register);

export default router;
