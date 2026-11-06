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

  // devuelve true cuando el comienzo del turno todavía está en el futuro 
  async canCancel(idReserva, idUsuario) {
    const query = `
      SELECT
        TIMESTAMP(r.fecha, t.hora_inicio) > NOW() AS puede_cancelar
      FROM Reserva r
      INNER JOIN Turno t ON r.id_turno = t.id_turno
      WHERE r.id_reserva = ?
        AND r.id_usuario = ?
    `;

    const [rows] = await pool.execute(query, [
      idReserva,
      idUsuario,
    ]);

    return rows[0]?.puede_cancelar === 1;
  },

  async cancelByIdAndUserId(idReserva, idUsuario) {
    const query = `
    UPDATE Reserva r
    INNER JOIN Turno t ON r.id_turno = t.id_turno
    SET r.estado = 'cancelada'
    WHERE r.id_reserva = ?
      AND r.id_usuario = ?
      AND r.estado IN ('pendiente', 'confirmada')
      AND TIMESTAMP(r.fecha, t.hora_inicio) > NOW();
    `;

    const [result] = await pool.execute(query, [idReserva, idUsuario]);

    return result.affectedRows; // saber si modificó una reserva
  },

  async findAll() {
    const query = `
    SELECT
      r.id_reserva,
      r.fecha,
      r.precio,
      r.estado,
      r.fecha_creacion,

      u.id_usuario,
      u.nombre AS usuario_nombre,
      u.apellido AS usuario_apellido,
      u.mail AS usuario_mail,

      e.id_espacio,
      e.nombre AS espacio_nombre,
      e.ubicacion AS espacio_ubicacion,

      t.id_turno,
      t.nombre AS turno_nombre,
      t.hora_inicio,
      t.hora_fin

    FROM Reserva r

    INNER JOIN Usuario u
      ON r.id_usuario = u.id_usuario

    INNER JOIN Espacio e
      ON r.id_espacio = e.id_espacio

    INNER JOIN Turno t
      ON r.id_turno = t.id_turno

    ORDER BY
      r.fecha DESC,
      t.hora_inicio DESC,
      r.id_reserva DESC
  `;

    const [rows] = await pool.execute(query);

    return rows;
  },

  async findById(idReserva) {
    const query = `
    SELECT id_reserva, estado
    FROM Reserva
    WHERE id_reserva = ?
  `;

    const [rows] = await pool.execute(query, [idReserva]);

    return rows[0] ?? null;
  },

  async updateStatus(idReserva, estadoActual, nuevoEstado) {
    const query = `
    UPDATE Reserva
    SET estado = ?
    WHERE id_reserva = ?
      AND estado = ?
  `;

    const [result] = await pool.execute(query, [
      nuevoEstado,
      idReserva,
      estadoActual,
    ]);

    return result.affectedRows;
  },
};
