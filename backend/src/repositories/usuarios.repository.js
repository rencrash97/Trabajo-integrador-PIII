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

  // activos e inactivos
  async findAll() {
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
    ORDER BY id_usuario ASC
  `;

    const [rows] = await pool.execute(query);

    return rows;
  },

  async update(idUsuario, { nombre, apellido, mail }) {
    const query = `
    UPDATE Usuario
    SET nombre = ?, apellido = ?, mail = ?
    WHERE id_usuario = ?
  `;

    await pool.execute(query, [nombre, apellido, mail, idUsuario]);

    return UsuarioRepository.findById(idUsuario);
  },

  async updateStatus(idUsuario, activo) {
    const query = `
    UPDATE Usuario
    SET activo = ?
    WHERE id_usuario = ?
  `;

    await pool.execute(query, [activo, idUsuario]);

    return UsuarioRepository.findById(idUsuario);
  },

  async updateRole(idUsuario, rol) {
    const query = `
    UPDATE Usuario
    SET rol = ?
    WHERE id_usuario = ?
  `;

    await pool.execute(query, [rol, idUsuario]);

    return UsuarioRepository.findById(idUsuario);
  },

  async countActiveSuperAdmins() {
    const query = `
    SELECT COUNT(*) AS cantidad
    FROM Usuario
    WHERE rol = 'super_admin'
      AND activo = TRUE
  `;

    const [rows] = await pool.execute(query);

    return rows[0].cantidad;
  },

  // estado y rol actual, para usar en authenticateToken
  async findStatusById(idUsuario) {
    const query = `
    SELECT activo, rol
    FROM Usuario
    WHERE id_usuario = ?
  `;

    const [rows] = await pool.execute(query, [idUsuario]);

    return rows[0] ?? null;
  },
};
