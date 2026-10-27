import { EspacioRepository } from "../repositories/espacios.repository.js";
import { ReservaRepository } from "../repositories/reservas.repository.js";
import { TurnoRepository } from "../repositories/turnos.repository.js";

export const EspaciosService = {
  async getById(id) {
    const espacio = await EspacioRepository.findById(id);

    if (!espacio) {
      const error = new Error("Espacio no encontrado");
      error.status = 404;
      throw error;
    }

    return espacio;
  },

  async getDisponibilidad(idEspacio, fecha) {
    // espacio exista y este activo
    await this.getById(idEspacio);

    // obtener todos los turnos
    const turnos = await TurnoRepository.findAll();
    // obtener los ocupados
    const turnosOcupados = await ReservaRepository.findOccupiedTurns(
      idEspacio,
      fecha,
    );

    // set con ids ocupados
    const idsOcupados = new Set(turnosOcupados.map((turno) => turno.id_turno));

    // devolver disponibles
    return turnos.filter((turno) => !idsOcupados.has(turno.id_turno));
  },
};
