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

  async create({ idUsuario, idEspacio, idTurno, fecha, precio }) {
    const query = `
      INSERT INTO Reserva (
        id_usuario,
        id_espacio,
        id_turno,
        fecha,
        precio,
        estado
      )
      VALUES (?, ?, ?, ?, ?, 'pendiente')
    `;

    const [result] = await pool.execute(query, [
      idUsuario,
      idEspacio,
      idTurno,
      fecha,
      precio,
    ]);

    return result.insertId;
  },

  async findByUserId(idUsuario) {
    const query = `
    SELECT
      r.id_reserva,
      r.fecha,
      r.precio,
      r.estado,
      r.fecha_creacion,
      e.id_espacio,
      e.nombre AS espacio_nombre,
      e.ubicacion AS espacio_ubicacion,
      t.id_turno,
      t.nombre AS turno_nombre,
      t.hora_inicio,
      t.hora_fin
    FROM Reserva r
    INNER JOIN Espacio e
      ON r.id_espacio = e.id_espacio
    INNER JOIN Turno t
      ON r.id_turno = t.id_turno
    WHERE r.id_usuario = ?
    ORDER BY r.fecha DESC, t.hora_inicio DESC, r.id_reserva DESC
  `;

    const [rows] = await pool.execute(query, [idUsuario]);

    return rows;
  },

  async findByIdAndUserId(idReserva, idUsuario) {
    const query = `
    SELECT
      r.id_reserva,
      r.fecha,
      r.precio,
      r.estado,
      r.fecha_creacion,
      e.id_espacio,
      e.nombre AS espacio_nombre,
      e.ubicacion AS espacio_ubicacion,
      t.id_turno,
      t.nombre AS turno_nombre,
      t.hora_inicio,
      t.hora_fin
    FROM Reserva r
    INNER JOIN Espacio e
      ON r.id_espacio = e.id_espacio
    INNER JOIN Turno t
      ON r.id_turno = t.id_turno
    WHERE r.id_reserva = ?
      AND r.id_usuario = ?
  `;
    // solo devuelve la reserva si coinciden el id solicitado y el usuario autenticado
    const [rows] = await pool.execute(query, [idReserva, idUsuario]);

    return rows[0] ?? null;
  },

  async cancelByIdAndUserId(idReserva, idUsuario) {
    const query = `
    UPDATE Reserva
    SET estado = 'cancelada'
    WHERE id_reserva = ?
      AND id_usuario = ?
      AND estado IN ('pendiente', 'confirmada')
  `;

    const [result] = await pool.execute(query, [idReserva, idUsuario]);

    return result.affectedRows; // saber si modificó una reserva
  },
};
