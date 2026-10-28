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

  async findByEmailWithPassword(email) {
    const query = `
      SELECT
        id_usuario,
        nombre,
        apellido,
        mail,
        password_hash,
        rol,
        activo
      FROM Usuario
      WHERE mail = ?
    `;

    const [rows] = await pool.execute(query, [email]);

    return rows[0] ?? null;
  },

  async findById(idUsuario) {
    const query = `
    SELECT
      id_usuario,
      nombre,
      apellido,
      mail,
      rol,
      activo,
      fecha_alta
    FROM Usuario
    WHERE id_usuario = ?
  `;
    const [rows] = await pool.execute(query, [idUsuario]);

    return rows[0] ?? null;
    // devuelve unicamente datos publicos
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
