import { TurnoRepository } from "../repositories/turnos.repository.js";

export const TurnosController = {
  async getTurnos(req, res) {
    try {
      const turnos = await TurnoRepository.findAll();
      return res.status(200).json(turnos);
    } catch (error) {
      console.error("Error al listar turnos: ", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  },
};
