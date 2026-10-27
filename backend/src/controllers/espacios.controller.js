import { EspacioRepository } from "../repositories/espacios.repository.js";
import { EspaciosService } from "../services/espacios.service.js";

export const EspaciosController = {
  async getActiveEspacios(req, res) {
    try {
      const espacios = await EspacioRepository.findActive();
      return res.status(200).json(espacios);
    } catch (error) {
      console.error("Error al listar espacios: ", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async getById(req, res) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          error: "El ID debe ser un entero positivo",
        });
      }

      const espacio = await EspaciosService.getById(id);

      return res.status(200).json(espacio);
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({
          error: error.message,
        });
      }
      console.error("Error al consultar espacio:", error);
      return res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  },

  async getDisponibilidad(req, res) {
    try {
      const idEspacio = Number(req.params.id);
      const { fecha } = req.query;

      // validar id del espacio
      if (!Number.isInteger(idEspacio) || idEspacio <= 0) {
        return res.status(400).json({
          error: "El ID del espacio debe ser un entero positivo.",
        });
      }

      // validar presencia y formato de la fecha
      if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return res.status(400).json({
          error: "La fecha es obligatoria y debe tener el formato AAAA-MM-DD.",
        });
      }

      // validar que la fecha exista en el calendario
      const [anio, mes, dia] = fecha.split("-").map(Number);
      const fechaValidada = new Date(Date.UTC(anio, mes - 1, dia));

      if (
        fechaValidada.getUTCFullYear() !== anio ||
        fechaValidada.getUTCMonth() !== mes - 1 ||
        fechaValidada.getUTCDate() !== dia
      ) {
        return res.status(400).json({
          error: "La fecha proporcionada no existe en el calendario.",
        });
      }

      // obtener la fecha actual
      const hoyArgentina = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Argentina/Buenos_Aires",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());

      if (fecha < hoyArgentina) {
        return res.status(400).json({
          error: "No se pueden consultar reservas para fechas pasadas.",
        });
      }

      // invocar el service
      const turnosDisponibles = await EspaciosService.getDisponibilidad(
        idEspacio,
        fecha,
      );

      return res.status(200).json({
        id_espacio: idEspacio,
        fecha,
        turnos_disponibles: turnosDisponibles,
      });
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ error: error.message });
      }

      console.error("Error al consultar disponibilidad:", error);

      return res.status(500).json({
        error: "Error interno del servidor.",
      });
    }
  },
};
