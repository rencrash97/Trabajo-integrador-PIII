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

  async getAll() {
    return UsuarioRepository.findAll();
  },

  async getByIdForAdmin(idUsuario) {
    // a diferencia de getProfile, devuelve tambien cuentas inactivas
    const usuario = await UsuarioRepository.findById(idUsuario);

    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    return usuario;
  },

  async updateByAdmin(idUsuario, datos) {
    const usuarioActual = await UsuarioRepository.findById(idUsuario);

    if (!usuarioActual) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    const usuarioActualizado = {
      nombre: datos.nombre ?? usuarioActual.nombre,
      apellido: datos.apellido ?? usuarioActual.apellido,
      mail: datos.mail ?? usuarioActual.mail,
    };

    // validar nombre y apellido
    if (
      typeof usuarioActualizado.nombre !== "string" ||
      !usuarioActualizado.nombre.trim()
    ) {
      const error = new Error("El nombre es obligatorio");
      error.status = 400;
      throw error;
    }

    if (
      typeof usuarioActualizado.apellido !== "string" ||
      !usuarioActualizado.apellido.trim()
    ) {
      const error = new Error("El apellido es obligatorio");
      error.status = 400;
      throw error;
    }

    // normalizar datos
    usuarioActualizado.nombre = usuarioActualizado.nombre.trim();
    usuarioActualizado.apellido = usuarioActualizado.apellido.trim();
    usuarioActualizado.mail = usuarioActualizado.mail.trim().toLowerCase();

    // Validar email
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(usuarioActualizado.mail)) {
      const error = new Error("El correo electrónico no es válido");
      error.status = 400;
      throw error;
    }

    // comprobar que el correo no pertenezca a otro usuario
    const usuarioConEmail = await UsuarioRepository.findByEmail(
      usuarioActualizado.mail,
    );

    if (usuarioConEmail && usuarioConEmail.id_usuario !== Number(idUsuario)) {
      const error = new Error("El correo electrónico ya está registrado");
      error.status = 409;
      throw error;
    }

    try {
      return await UsuarioRepository.update(idUsuario, usuarioActualizado);
    } catch (error) {
      // protección adicional ante solicitudes simultaneas
      if (error.code === "ER_DUP_ENTRY") {
        const conflicto = new Error("El correo electrónico ya está registrado");
        conflicto.status = 409;
        throw conflicto;
      }

      throw error;
    }
  },

  async updateStatusByAdmin(idUsuario, activo, idUsuarioAutenticado) {
    const usuario = await UsuarioRepository.findById(idUsuario);

    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    if (Number(idUsuario) === Number(idUsuarioAutenticado) && !activo) {
      const error = new Error("No podés desactivar tu propia cuenta");
      error.status = 400;
      throw error;
    }

    if (typeof activo !== "boolean") {
      const error = new Error("El estado debe ser un booleano");
      error.status = 400;
      throw error;
    }

    return await UsuarioRepository.updateStatus(idUsuario, activo);
  },

  async updateRoleByAdmin(idUsuario, nuevoRol, idUsuarioAutenticado) {
    const rolesPermitidos = ["cliente", "admin", "super_admin"];

    if (!rolesPermitidos.includes(nuevoRol)) {
      const error = new Error("El rol indicado no es válido");
      error.status = 400;
      throw error;
    }

    const usuario = await UsuarioRepository.findById(idUsuario);

    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    if (Number(idUsuario) === Number(idUsuarioAutenticado)) {
      const error = new Error("No podés modificar tu propio rol");
      error.status = 400;
      throw error;
    }
    // validar que haya otro super_admin activo
    if (
      usuario.rol === "super_admin" &&
      usuario.activo &&
      nuevoRol !== "super_admin"
    ) {
      const cantidad = await UsuarioRepository.countActiveSuperAdmins();

      if (cantidad <= 1) {
        const error = new Error(
          "No se puede quitar el rol al último superadministrador activo",
        );
        error.status = 409;
        throw error;
      }
    }

    return await UsuarioRepository.updateRole(idUsuario, nuevoRol);
  },
};
