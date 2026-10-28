import bcrypt from "bcrypt";
import { UsuarioRepository } from "../repositories/usuarios.repository.js";

export const UsuariosService = {
  async register({ nombre, apellido, mail, password }) {
    const usuarioExistente = await UsuarioRepository.findByEmail(mail);

    if (usuarioExistente) {
      const error = new Error("El correo ya está registrado.");
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    try {
      const idUsuario = await UsuarioRepository.create({
        nombre,
        apellido,
        mail,
        passwordHash,
      });

      return { id_usuario: idUsuario };
    } catch (error) {
      // otra capa de seguridad para duplicados
      if (error.code === "ER_DUP_ENTRY") {
        const conflicto = new Error("El correo ya está registrado.");
        conflicto.status = 409;
        throw conflicto;
      }
      throw error;
    }
  },

  async getProfile(idUsuario) {
    const usuario = await UsuarioRepository.findById(idUsuario);

    if (!usuario) {
      const error = new Error("El usuario no existe.");
      error.status = 404;
      throw error;
    }

    if (!usuario.activo) {
      const error = new Error("La cuenta está desactivada.");
      error.status = 403;
      throw error;
    }

    return usuario;
  },
};
