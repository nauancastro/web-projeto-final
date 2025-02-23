export default {
  async findByBarbeiro(ctx) {
    try {
      const user = ctx.state.user;

      if (!user) {
        ctx.unauthorized("Usuário não autenticado");
        return;
      }

      if (user.role?.type !== "barbeiro") {
        ctx.forbidden("Acesso negado");
        return;
      }

      const reservas = await strapi.entityService.findMany("api::reserva.reserva", {
        filters: { barbeiro: user.id },
        populate: { cliente: true }
      });

      // Remove duplicatas filtrando pelo documentId
      const reservasUnicas = reservas.reduce((acc, reserva) => {
        if (!acc.some(r => r.documentId === reserva.documentId)) {
          acc.push(reserva);
        }
        return acc;
      }, []);

      // Formata os dados para a resposta
      const reservasFormatadas = reservasUnicas.map(reserva => ({
        id: reserva.id,
        dia: reserva.dia,
        horario: reserva.horario,
        servico: reserva.servico,
        cliente: reserva.cliente
          ? {
              id: reserva.cliente.id,
              nome: reserva.cliente.username,
              email: reserva.cliente.email,
              telefone: reserva.cliente.telefone
            }
          : null
      }));

      ctx.body = {
        barbeiro: {
          id: user.id,
          nome: user.username
        },
        reservas: reservasFormatadas
      };
    } catch (error) {
      ctx.internalServerError("Erro ao buscar reservas.");
    }
  }
};
