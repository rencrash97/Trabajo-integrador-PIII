import { EspacioRepository } from "../repositories/espacios.repository.js";
import { ReservaRepository } from "../repositories/reservas.repository.js";
import { TurnoRepository } from "../repositories/turnos.repository.js";

function validarDatosEspacio({
  nombre,
  descripcion,
  capacidad,
  ubicacion,
  precio_por_turno,
}) {
  if (
    typeof nombre !== "string" ||
    !nombre.trim() ||
    typeof ubicacion !== "string" ||
    !ubicacion.trim()
  ) {
    const error = new Error("Nombre y ubicación son obligatorios.");
    error.status = 400;
    throw error;
  }

  if (descripcion !== null && typeof descripcion !== "string") {
    const error = new Error("La descripción debe ser un texto.");
    error.status = 400;
    throw error;
  }

  if (!Number.isInteger(capacidad) || capacidad <= 0) {
    const error = new Error("La capacidad debe ser un entero positivo.");
    error.status = 400;
    throw error;
  }

  if (
    typeof precio_por_turno !== "number" ||
    !Number.isFinite(precio_por_turno) ||
    precio_por_turno < 0
  ) {
    const error = new Error(
      "El precio debe ser un número mayor o igual a cero.",
    );
    error.status = 400;
    throw error;
  }
}

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
    await this.getById(idEspacio);

    const turnos = await TurnoRepository.findAll();

    const turnosOcupados = await ReservaRepository.findOccupiedTurns(
      idEspacio,
      fecha,
    );

    const idsOcupados = new Set(turnosOcupados.map((turno) => turno.id_turno));

    return turnos.filter((turno) => !idsOcupados.has(turno.id_turno));
  },

  async getAll() {
    return EspacioRepository.findAll();
  },

  async create(data) {
    const { nombre, descripcion, capacidad, ubicacion, precio_por_turno } =
      data;

    const datos = {
      nombre,
      descripcion: descripcion?.trim() || null,
      capacidad,
      ubicacion,
      precio_por_turno,
    };

    validarDatosEspacio(datos);

    return EspacioRepository.create({
      ...datos,
      nombre: datos.nombre.trim(),
      ubicacion: datos.ubicacion.trim(),
    });
  },

  async update(id, data) {
    // obtener el espacio actual
    const espacioActual = await this.getById(id);

    // combinar los datos actuales con los recibidos
    const datosActualizados = {
      nombre: data.nombre ?? espacioActual.nombre,
      descripcion:
        data.descripcion === undefined
          ? espacioActual.descripcion
          : data.descripcion,
      capacidad: data.capacidad ?? espacioActual.capacidad,
      ubicacion: data.ubicacion ?? espacioActual.ubicacion,
      precio_por_turno:
        data.precio_por_turno ?? Number(espacioActual.precio_por_turno),
    };

    // validar
    datosActualizados.descripcion =
      datosActualizados.descripcion?.trim() || null;

    validarDatosEspacio(datosActualizados);

    return EspacioRepository.update(id, {
      ...datosActualizados,
      nombre: datosActualizados.nombre.trim(),
      ubicacion: datosActualizados.ubicacion.trim(),
    });
  },

  async updateStatus(id, activo) {
    if (typeof activo !== "boolean") {
      const error = new Error(
        "El estado debe ser un valor booleano (true o false).",
      );
      error.status = 400;
      throw error;
    }

    const espacio = await EspacioRepository.findByIdIncludingInactive(id);

    if (!espacio) {
      const error = new Error("Espacio no encontrado.");
      error.status = 404;
      throw error;
    }

    return EspacioRepository.updateStatus(id, activo);
  },
};
