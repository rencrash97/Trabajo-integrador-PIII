import { UsuariosService } from "../services/usuarios.service.js";

export const UsuariosController = {
  async register(req, res) {
    try {
      const { nombre, apellido, mail, password } = req.body;

      // validar campos obligatorios
      if (!nombre?.trim() || !apellido?.trim() || !mail?.trim() || !password) {
        return res.status(400).json({
          error: "Todos los campos son obligatorios.",
        });
      }

      // validar formato básico del correo
      const email = mail.trim().toLowerCase();
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!emailValido) {
        return res.status(400).json({
          error: "El correo electrónico no es válido.",
        });
      }

      // validar contraseña
      if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({
          error: "La contraseña debe tener al menos 8 caracteres.",
        });
      }

      // registrar usuario mediante el servicio
      const usuario = await UsuariosService.register({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        mail: email,
        password,
      });

      return res.status(201).json({
        mensaje: "Usuario registrado correctamente.",
        usuario,
      });
    } catch (error) {
      if (error.status === 409) {
        return res.status(409).json({
          error: error.message,
        });
      }

      console.error("Error al registrar usuario:", error);

      return res.status(500).json({
        error: "Ocurrió un error interno al registrar el usuario.",
      });
    }
  },

  async getMe(req, res) {
    try {
      const usuario = await UsuariosService.getProfile(req.usuario.id_usuario);
      // req.usuario.id_usuario lo establece el middleware
      return res.status(200).json({ usuario });
    } catch (error) {
      if (error.status === 404 || error.status === 403) {
        return res.status(error.status).json({
          error: error.message,
        });
      }

      console.error("Error al obtener el perfil:", error);

      return res.status(500).json({
        error: "Ocurrió un error interno al obtener el perfil.",
      });
    }
  },

  async getAll(req, res) {
    try {
      const usuarios = await UsuariosService.getAll();

      return res.status(200).json(usuarios);
    } catch (error) {
      console.error("Error al listar usuarios:", error);

      return res.status(500).json({
        error: "Error interno del servidor.",
      });
    }
  },

  async getById(req, res) {
    try {
      const idUsuario = Number(req.params.id);

      if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        return res.status(400).json({
          mensaje: "ID de usuario inválido",
        });
      }

      const usuario = await UsuariosService.getByIdForAdmin(idUsuario);

      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(error.status || 500).json({
        mensaje: error.status ? error.message : "Error interno del servidor",
      });
    }
  },

  async updateByAdmin(req, res) {
    try {
      const idUsuario = Number(req.params.id);

      if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        return res.status(400).json({
          mensaje: "ID de usuario inválido",
        });
      }

      const datos = req.body;

      const camposPermitidos = ["nombre", "apellido", "mail"];
      const camposEnviados = Object.keys(datos);

      // rechazar body vacío
      if (camposEnviados.length === 0) {
        return res.status(400).json({
          mensaje: "Debe enviar al menos un campo para modificar",
        });
      }

      // rechazar campos no permitidos
      const camposInvalidos = camposEnviados.filter(
        (campo) => !camposPermitidos.includes(campo),
      );

      if (camposInvalidos.length > 0) {
        return res.status(400).json({
          mensaje: `Campos no permitidos: ${camposInvalidos.join(", ")}`,
        });
      }

      // validar que los campos enviados sean strings no vacíos
      for (const campo of camposEnviados) {
        if (typeof datos[campo] !== "string" || !datos[campo].trim()) {
          return res.status(400).json({
            mensaje: `El campo ${campo} debe ser un texto no vacío`,
          });
        }
      }

      const usuario = await UsuariosService.updateByAdmin(idUsuario, datos);

      return res.status(200).json({
        mensaje: "Usuario actualizado correctamente",
        usuario,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        mensaje: error.status ? error.message : "Error interno del servidor",
      });
    }
  },

  async updateStatus(req, res) {
    try {
      const idUsuario = Number(req.params.id);

      if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        return res.status(400).json({
          mensaje: "ID de usuario inválido",
        });
      }

      const { activo } = req.body;

      if (typeof activo !== "boolean") {
        return res.status(400).json({
          mensaje: "El campo activo debe ser true o false",
        });
      }

      const usuario = await UsuariosService.updateStatusByAdmin(
        idUsuario,
        activo,
        req.usuario.id_usuario,
      );

      return res.status(200).json({
        mensaje: activo
          ? "Usuario activado correctamente"
          : "Usuario desactivado correctamente",
        usuario,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        mensaje: error.status ? error.message : "Error interno del servidor",
      });
    }
  },

  async updateRole(req, res) {
    try {
      const idUsuario = Number(req.params.id);

      if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        return res.status(400).json({
          mensaje: "ID de usuario inválido",
        });
      }

      const { rol } = req.body;

      if (typeof rol !== "string") {
        return res.status(400).json({
          mensaje: "Debe indicar un rol válido",
        });
      }

      const usuario = await UsuariosService.updateRoleByAdmin(
        idUsuario,
        rol,
        req.usuario.id_usuario,
      );

      return res.status(200).json({
        mensaje: "Rol actualizado correctamente",
        usuario,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        mensaje: error.status ? error.message : "Error interno del servidor",
      });
    }
  },
};
