import pool from "../config/database.js";

// consulta las reservas que bloquean
export const ReservaRepository = {
  async findOccupiedTurns(idEspacio, fecha) {
    const query = `
      SELECT id_turno
      FROM Reserva
      WHERE id_espacio = ?
        AND fecha = ?
        AND estado IN ('confirmada', 'pendiente')
    `;

    const [rows] = await pool.execute(query, [idEspacio, fecha]);

    return rows;
  },
};
