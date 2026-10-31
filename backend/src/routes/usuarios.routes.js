import { Router } from "express";
import { UsuariosController } from "../controllers/usuarios.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = Router();

router.post("/api/usuarios", UsuariosController.register);

router.get("/api/usuarios/me", authenticateToken, UsuariosController.getMe);

// admins
router.get(
  "/api/admin/usuarios",
  authenticateToken,
  authorizeRoles("super_admin"),
  UsuariosController.getAll,
);

router.get(
  "/api/admin/usuarios/:id",
  authenticateToken,
  authorizeRoles("super_admin"),
  UsuariosController.getById,
);

router.patch(
  "/api/admin/usuarios/:id",
  authenticateToken,
  authorizeRoles("super_admin"),
  UsuariosController.updateByAdmin,
);

router.patch(
  "/api/admin/usuarios/:id/estado",
  authenticateToken,
  authorizeRoles("super_admin"),
  UsuariosController.updateStatus,
);

router.patch(
  "/api/admin/usuarios/:id/rol",
  authenticateToken,
  authorizeRoles("super_admin"),
  UsuariosController.updateRole,
);

export default router;
