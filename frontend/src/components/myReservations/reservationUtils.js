// formatear fecha
const MESES_ABREVIADOS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

export const formatReservationDate = (date) => {
  const [year, month, day] = date.slice(0, 10).split("-");
  return `${Number(day)} ${MESES_ABREVIADOS[Number(month) - 1]} ${year}`;
};

export const formatHour = (hour) => String(hour).slice(0, 5);

// para esconder botones de fechas anteriores
export const turnoYaComenzo = (reservation) => {
  const fecha = reservation.fecha.slice(0, 10);
  const hora = String(reservation.hora_inicio).slice(0, 8);
  const inicioTurno = new Date(`${fecha}T${hora}`);

  return inicioTurno <= new Date();
};
