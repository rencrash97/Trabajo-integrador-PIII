import pool from "../config/database.js";

export const EspacioRepository = {
  async findActive() {
    const query =
      "SELECT id_espacio, nombre, descripcion, capacidad, ubicacion, precio_por_turno, activo FROM Espacio WHERE activo = true";
    const [rows] = await pool.execute(query);
    return rows;
  },

  async findById(id) {
    const query = `
    SELECT id_espacio, nombre, descripcion, capacidad, ubicacion, precio_por_turno, activo
    FROM Espacio
    WHERE id_espacio = ?
      AND activo = TRUE
  `;
    const [rows] = await pool.execute(query, [id]);

    return rows[0] ?? null;
    // el metodo busca una entidad, no una coleccion, por eso null
  },

  // crear, para admins
  async create({
    nombre,
    descripcion,
    capacidad,
    ubicacion,
    precio_por_turno,
  }) {
    const query = `
    INSERT INTO Espacio (
      nombre,
      descripcion,
      capacidad,
      ubicacion,
      precio_por_turno,
      activo
    )
    VALUES (?, ?, ?, ?, ?, TRUE)
  `;

    const [result] = await pool.execute(query, [
      nombre,
      descripcion,
      capacidad,
      ubicacion,
      precio_por_turno,
    ]);

    return EspacioRepository.findById(result.insertId);
  },

  // editar espacio
  async update(
    id,
    { nombre, descripcion, capacidad, ubicacion, precio_por_turno },
  ) {
    const query = `
    UPDATE Espacio
    SET nombre = ?,
        descripcion = ?,
        capacidad = ?,
        ubicacion = ?,
        precio_por_turno = ?
    WHERE id_espacio = ?
      AND activo = TRUE
  `;

    await pool.execute(query, [
      nombre,
      descripcion,
      capacidad,
      ubicacion,
      precio_por_turno,
      id,
    ]);

    return EspacioRepository.findById(id);
  },

  async findByIdIncludingInactive(id) {
    const query = `
    SELECT id_espacio, nombre, descripcion, capacidad,
           ubicacion, precio_por_turno, activo
    FROM Espacio
    WHERE id_espacio = ?
  `;

    const [rows] = await pool.execute(query, [id]);

    return rows[0] ?? null;
  },

  async updateStatus(id, activo) {
    const query = `
    UPDATE Espacio
    SET activo = ?
    WHERE id_espacio = ?
  `;

    await pool.execute(query, [activo, id]);

    return EspacioRepository.findByIdIncludingInactive(id);
  },

  async findAll() {
    const query = `
    SELECT id_espacio, nombre, descripcion, capacidad,
           ubicacion, precio_por_turno, activo
    FROM Espacio
    ORDER BY id_espacio ASC
  `;

    const [rows] = await pool.execute(query);
    return rows;
  },
};
