import { AuthService } from "../services/auth.service.js";

export const AuthController = {
  async login(req, res) {
    try {
      const { mail, password } = req.body;

      // validar campos obligatorios
      if (
        typeof mail !== "string" ||
        !mail.trim() ||
        typeof password !== "string" ||
        !password
      ) {
        return res.status(400).json({
          error: "El correo y la contraseña son obligatorios.",
        });
      }

      // validación básica del correo
      const email = mail.trim().toLowerCase();
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!emailValido) {
        return res.status(400).json({
          error: "El correo electrónico no es válido.",
        });
      }

      const resultado = await AuthService.login({
        mail: email,
        password,
      });

      return res.status(200).json(resultado);
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        return res.status(error.status).json({
          error: error.message,
        });
      }

      console.error("Error al iniciar sesión:", error);

      return res.status(500).json({
        error: "Ocurrió un error interno al iniciar sesión.",
      });
    }
  },
};
