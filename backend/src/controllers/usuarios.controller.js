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
};
