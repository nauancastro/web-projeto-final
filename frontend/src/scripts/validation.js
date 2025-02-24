function validateReservationDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return "Data e horário são obrigatórios.";
  const [hour] = timeStr.split(":").map(Number);
  if (hour < 9 || hour > 20) {
    return "Horário inválido. A barbearia funciona das 9h às 20h.";
  }
  const selectedDateTime = new Date(`${dateStr}T${timeStr}`);
  const now = new Date();
  if (selectedDateTime < now) {
    return "A reserva não pode ser para uma data/hora anterior ao atual.";
  }
  return null;
}
