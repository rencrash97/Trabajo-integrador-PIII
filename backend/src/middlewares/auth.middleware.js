import jwt from "jsonwebtoken";
import { UsuarioRepository } from "../repositories/usuarios.repository.js";

export async function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Se requiere un token de autenticación.",
    });
  }

  const token = authorization.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("Falta configurar JWT_SECRET.");

    return res.status(500).json({
      error: "Error interno de configuración.",
    });
  }

  try {
    const payload = jwt.verify(token, secret);

    // el id se obtiene del token verificado, no del body
    req.usuario = {
      id_usuario: Number(payload.sub),
      rol: payload.rol,
    };

    if (
      !Number.isSafeInteger(req.usuario.id_usuario) ||
      req.usuario.id_usuario <= 0
    ) {
      return res.status(401).json({
        error: "Token inválido.",
      });
    }

    const usuario = await UsuarioRepository.findStatusById(
      req.usuario.id_usuario,
    );

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        error: "La cuenta no existe o está desactivada.",
      });
    }

    req.usuario.rol = usuario.rol;

    next();
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        error: "Error al verificar el estado de la cuenta.",
      });
    }
    return res.status(401).json({
      error: "Token inválido o expirado.",
    });
  }
}
