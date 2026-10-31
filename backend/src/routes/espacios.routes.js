import { Router } from "express";
import { EspaciosController } from "../controllers/espacios.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = Router();

router.get("/api/espacios", EspaciosController.getActiveEspacios);
router.get("/api/espacios/:id", EspaciosController.getById);
router.get(
  "/api/espacios/:id/disponibilidad",
  EspaciosController.getDisponibilidad,
);

// rutas admins
router.get(
  "/api/admin/espacios",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  EspaciosController.getAll,
);

router.post(
  "/api/admin/espacios",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  EspaciosController.create,
);

router.patch(
  "/api/admin/espacios/:id",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  EspaciosController.update,
);

router.patch(
  "/api/admin/espacios/:id/estado",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  EspaciosController.updateStatus,
);

export default router;
