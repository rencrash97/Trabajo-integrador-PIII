import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsuarioRepository } from "../repositories/usuarios.repository.js";

export const AuthService = {
  async login({ mail, password }) {
    const usuario = await UsuarioRepository.findByEmailWithPassword(
      mail.trim().toLowerCase(),
    );

    // mensaje generico para no revelar si el correo existe
    if (!usuario) {
      const error = new Error("Credenciales incorrectas.");
      error.status = 401;
      throw error;
    }

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password_hash,
    );

    if (!passwordValida) {
      const error = new Error("Credenciales incorrectas.");
      error.status = 401;
      throw error;
    }

    if (!usuario.activo) {
      const error = new Error("La cuenta está desactivada.");
      error.status = 403;
      throw error;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("Falta configurar JWT_SECRET.");
    }

    const token = jwt.sign({ rol: usuario.rol }, secret, {
      subject: String(usuario.id_usuario),
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    return {
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        mail: usuario.mail,
        rol: usuario.rol,
      },
    };
  },
};
