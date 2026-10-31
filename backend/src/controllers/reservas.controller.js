import { ReservasService } from "../services/reservas.service.js";

export const ReservasController = {
  async create(req, res) {
    try {
      const { id_espacio, id_turno, fecha } = req.body;

      if (
        !Number.isSafeInteger(id_espacio) ||
        !Number.isSafeInteger(id_turno) ||
        typeof fecha !== "string"
      ) {
        return res.status(400).json({
          error: "El espacio, el turno y la fecha son obligatorios.",
        });
      }

      const reserva = await ReservasService.create({
        idUsuario: req.usuario.id_usuario,
        idEspacio: id_espacio,
        idTurno: id_turno,
        fecha,
      });

      return res.status(201).json({
        mensaje: "Reserva creada correctamente.",
        reserva,
      });
    } catch (error) {
      if ([400, 403, 404, 409].includes(error.status)) {
        return res.status(error.status).json({
          error: error.message,
        });
      }

      console.error("Error al crear reserva:", error);

      return res.status(500).json({
        error: "Ocurrió un error interno al crear la reserva.",
      });
    }
  },

  async findMine(req, res) {
    try {
      const reservas = await ReservasService.findMyReservations(
        req.usuario.id_usuario,
        // ID proviene del JWT validado por authenticateToken
      );

      return res.status(200).json({ reservas });
    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json({ error: error.message });
      }

      console.error("Error al consultar mis reservas:", error);

      return res.status(500).json({
        error: "Ocurrió un error interno al consultar las reservas.",
      });
    }
  },

  async findMineById(req, res) {
    try {
      const idReserva = Number(req.params.id);

      const reserva = await ReservasService.findMyReservationById(
        idReserva,
        req.usuario.id_usuario,
      );

      return res.status(200).json({ reserva });
    } catch (error) {
      if ([400, 404].includes(error.status)) {
        return res.status(error.status).json({ error: error.message });
      }

      console.error("Error al consultar la reserva:", error);

      return res.status(500).json({
        error: "Ocurrió un error interno al consultar la reserva.",
      });
    }
  },

  async cancel(req, res) {
    try {
      const idReserva = Number(req.params.id);

      const reserva = await ReservasService.cancelMyReservation(
        idReserva,
        req.usuario.id_usuario,
      );

      return res.status(200).json({
        mensaje: "Reserva cancelada correctamente.",
        reserva,
      });
    } catch (error) {
      if ([400, 404].includes(error.status)) {
        return res.status(error.status).json({ error: error.message });
      }

      console.error("Error al cancelar la reserva:", error);

      return res.status(500).json({
        error: "Ocurrió un error interno al cancelar la reserva.",
      });
    }
  },

  async getAll(req, res) {
    try {
      const reservas = await ReservasService.getAll();

      return res.status(200).json(reservas);
    } catch (error) {
      console.error("Error al listar todas las reservas:", error);

      return res.status(500).json({
        error: "Error interno del servidor.",
      });
    }
  },

  async updateStatus(req, res) {
    try {
      const idReserva = Number(req.params.id);
      const { estado } = req.body;

      if (!Number.isInteger(idReserva) || idReserva <= 0) {
        return res.status(400).json({
          error: "El ID debe ser un entero positivo.",
        });
      }

      const reserva = await ReservasService.updateStatus(idReserva, estado);

      return res.status(200).json({
        mensaje: "Estado de reserva actualizado correctamente.",
        reserva,
      });
    } catch (error) {
      if ([400, 404, 409].includes(error.status)) {
        return res.status(error.status).json({
          error: error.message,
        });
      }

      console.error("Error al cambiar estado de reserva:", error);

      return res.status(500).json({
        error: "Error interno del servidor.",
      });
    }
  },
};
