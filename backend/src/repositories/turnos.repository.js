import pool from "../config/database.js";

export const TurnoRepository = {
  async findAll() {
    const query = "SELECT * FROM Turno";
    const [rows] = await pool.execute(query);
    return rows;
  },

  async findById(idTurno) {
    const query = `
    SELECT
      id_turno,
      nombre,
      hora_inicio,
      hora_fin
    FROM Turno
    WHERE id_turno = ?
  `;
    const [rows] = await pool.execute(query, [idTurno]);

    return rows[0] ?? null;
  },
};
