import pool from "../config/database.js";

export const UsuarioRepository = {
  async findByEmail(email) {
    const query = `
      SELECT id_usuario
      FROM Usuario
      WHERE mail = ?`;

    const [rows] = await pool.execute(query, [email]);

    return rows[0] ?? null;
  },

  async create({ nombre, apellido, mail, passwordHash }) {
    const query =
      'INSERT INTO Usuario (Nombre, apellido, mail, password_hash, rol, activo) VALUES (?, ?, ?, ?, "cliente", TRUE)';
    const [result] = await pool.execute(query, [
      nombre,
      apellido,
      mail,
      passwordHash,
    ]);

    return result.insertId;
  },
};
