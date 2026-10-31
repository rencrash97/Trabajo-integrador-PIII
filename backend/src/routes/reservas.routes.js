import { Router } from "express";
import { ReservasController } from "../controllers/reservas.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = Router();

router.post("/api/reservas", authenticateToken, ReservasController.create);

router.get(
  "/api/reservas/mias",
  authenticateToken,
  ReservasController.findMine,
);

router.get(
  "/api/reservas/:id",
  authenticateToken,
  ReservasController.findMineById,
);

router.patch(
  "/api/reservas/:id/cancelar",
  authenticateToken,
  ReservasController.cancel,
);

// admins routes
router.get(
  "/api/admin/reservas",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  ReservasController.getAll,
);

router.patch(
  "/api/admin/reservas/:id/estado",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  ReservasController.updateStatus,
);

export default router;
