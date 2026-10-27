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
};
