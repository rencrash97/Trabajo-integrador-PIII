import { UsuarioRepository } from "../repositories/usuarios.repository.js";
import { EspacioRepository } from "../repositories/espacios.repository.js";
import { TurnoRepository } from "../repositories/turnos.repository.js";
import { ReservaRepository } from "../repositories/reservas.repository.js";

function obtenerFechaHoraArgentina() {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const valores = Object.fromEntries(
    partes
      .filter((parte) => parte.type !== "literal")
      .map((parte) => [parte.type, parte.value]),
  );

  return {
    fecha: `${valores.year}-${valores.month}-${valores.day}`,
    hora: `${valores.hour}:${valores.minute}:${valores.second}`,
  };
}

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

function fechaValida(fecha) {
  if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return false;
  }

  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaDate = new Date(Date.UTC(anio, mes - 1, dia));

  return (
    fechaDate.getUTCFullYear() === anio &&
    fechaDate.getUTCMonth() === mes - 1 &&
    fechaDate.getUTCDate() === dia
  );
}

export const ReservasService = {
  async create({ idUsuario, idEspacio, idTurno, fecha }) {
    // validar IDs
    for (const id of [idUsuario, idEspacio, idTurno]) {
      if (!Number.isSafeInteger(id) || id <= 0) {
        throw crearError("Los identificadores no son válidos.", 400);
      }
    }

    // validar fecha
    if (!fechaValida(fecha)) {
      throw crearError(
        "La fecha debe ser válida y tener formato YYYY-MM-DD.",
        400,
      );
    }

    const ahora = obtenerFechaHoraArgentina();

    if (fecha < ahora.fecha) {
      throw crearError("No se permiten reservas para fechas pasadas.", 400);
    }

    // verificar usuario
    const usuario = await UsuarioRepository.findById(idUsuario);

    if (!usuario) {
      throw crearError("El usuario no existe.", 404);
    }

    if (!usuario.activo) {
      throw crearError("La cuenta está desactivada.", 403);
    }

    // verificar espacio
    const espacio = await EspacioRepository.findById(idEspacio);

    if (!espacio) {
      throw crearError("El espacio no existe o no está disponible.", 404);
    }

    if (!espacio.activo) {
      throw crearError("El espacio está inactivo.", 404);
    }

    // verificar turno
    const turno = await TurnoRepository.findById(idTurno);

    if (!turno) {
      throw crearError("El turno no existe.", 404);
    }

    // rechazar turnos que ya empezaron
    if (fecha === ahora.fecha && String(turno.hora_inicio) <= ahora.hora) {
      throw crearError("No se puede reservar un turno que ya comenzó.", 400);
    }

    // guardar el precio vigente
    try {
      const idReserva = await ReservaRepository.create({
        idUsuario,
        idEspacio,
        idTurno,
        fecha,
        precio: espacio.precio_por_turno,
      });

      return { id_reserva: idReserva };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw crearError(
          "El espacio ya está reservado para esa fecha y turno.",
          409,
        );
      }

      throw error;
    }
  },

  async findMyReservations(idUsuario) {
    if (!Number.isSafeInteger(idUsuario) || idUsuario <= 0) {
      throw crearError("El identificador del usuario no es válido.", 400);
    }

    return await ReservaRepository.findByUserId(idUsuario);
  },

  async findMyReservationById(idReserva, idUsuario) {
    if (
      !Number.isSafeInteger(idReserva) ||
      idReserva <= 0 ||
      !Number.isSafeInteger(idUsuario) ||
      idUsuario <= 0
    ) {
      throw crearError("Los identificadores no son válidos.", 400);
    }

    const reserva = await ReservaRepository.findByIdAndUserId(
      idReserva,
      idUsuario,
    );

    if (!reserva) {
      throw crearError("La reserva no existe.", 404);
    }

    return reserva;
  },

  async cancelMyReservation(idReserva, idUsuario) {
    if (
      !Number.isSafeInteger(idReserva) ||
      idReserva <= 0 ||
      !Number.isSafeInteger(idUsuario) ||
      idUsuario <= 0
    ) {
      throw crearError("Los identificadores no son válidos.", 400);
    }

    const reserva = await ReservaRepository.findByIdAndUserId(
      idReserva,
      idUsuario,
    );

    if (!reserva || reserva.estado === "cancelada") {
    throw crearError(
      "La reserva no existe, no te pertenece o ya está cancelada.",
      404,
    );
  }

    const puedeCancelar = await ReservaRepository.canCancel(
    idReserva,
    idUsuario,
  );

  if (!puedeCancelar) {
    throw crearError(
      "No se puede cancelar una reserva cuyo turno ya comenzó.",
      409,
    );
  }

  const affectedRows = await ReservaRepository.cancelByIdAndUserId(
    idReserva,
    idUsuario,
  );

  if (affectedRows === 0) {
    throw crearError(
      "La reserva ya no está disponible para cancelación.",
      409,
    );
  }

  return { id_reserva: idReserva, estado: "cancelada" };
},

  async getAll() {
    return ReservaRepository.findAll();
  },

  async updateStatus(idReserva, nuevoEstado) {
    const estadosPermitidos = ["confirmada", "cancelada"];

    if (!estadosPermitidos.includes(nuevoEstado)) {
      const error = new Error("El estado debe ser 'confirmada' o 'cancelada'.");
      error.status = 400;
      throw error;
    }

    const reserva = await ReservaRepository.findById(idReserva);

    if (!reserva) {
      const error = new Error("Reserva no encontrada.");
      error.status = 404;
      throw error;
    }

    const transicionesPermitidas = {
      pendiente: ["confirmada", "cancelada"],
      confirmada: ["cancelada"],
      cancelada: [],
    };

    if (!transicionesPermitidas[reserva.estado].includes(nuevoEstado)) {
      const error = new Error(
        `No se puede cambiar una reserva de '${reserva.estado}' a '${nuevoEstado}'.`,
      );
      error.status = 409;
      throw error;
    }

    const actualizada = await ReservaRepository.updateStatus(
      idReserva,
      reserva.estado,
      nuevoEstado,
    );

    if (!actualizada) {
      const error = new Error(
        "La reserva fue modificada por otro usuario. Volvé a consultar su estado.",
      );
      error.status = 409;
      throw error;
    }

    return {
      id_reserva: idReserva,
      estado: nuevoEstado,
    };
  },
};
