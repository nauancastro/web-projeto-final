import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::reserva.reserva", ({ strapi }) => ({
  async findByBarbeiro(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized("Usuário não autenticado");
      }
      if (user.role?.type !== "barbeiro") {
        return ctx.forbidden("Acesso negado");
      }
      const reservas = await strapi.db.query("api::reserva.reserva").findMany({
        where: { barbeiro: user.id },
        populate: { cliente: true, avaliacao_cliente: true }
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
        documentId: reserva.documentId,
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
          : null,
        avaliacao_cliente: reserva.avaliacao_cliente
      }));
  
      ctx.body = {
        barbeiro: {
          id: user.id,
          nome: user.username
        },
        reservas: reservasFormatadas
      };
    } catch (error) {
      console.error(error);
      ctx.internalServerError("Erro ao buscar reservas.");
    }
  },

  async findByCliente(ctx) {
    try {
      const user = ctx.state.user;
      if (!user || user.role.name !== "Cliente") {
        return ctx.unauthorized("Você não tem permissão para acessar esta rota.");
      }
      const reservas = await strapi.db
        .query("api::reserva.reserva")
        .findMany({
          where: { cliente: user.id },
          populate: {
            cliente: true,
            barbeiro: true,
          },
        });
      // Remove duplicatas filtrando pelo documentId
      const reservasUnicas = reservas.reduce((acc, reserva) => {
        if (!acc.some(r => r.documentId === reserva.documentId)) {
          acc.push(reserva);
        }
        return acc;
      }, []);
      const reservasFormatadas = reservasUnicas.map(reserva => ({
        id: reserva.id,
        documentId: reserva.documentId, // Nova propriedade adicionada
        dia: reserva.dia,
        horario: reserva.horario,
        servico: reserva.servico,
        concluida: reserva.concluida,
        barbeiro: reserva.barbeiro
          ? {
              id: reserva.barbeiro.id,
              nome: reserva.barbeiro.username
            }
          : null,
      }));
      ctx.body = {
        cliente: {
          id: user.id,
          nome: user.username,
        },
        reservas: reservasFormatadas,
      };
    } catch (error) {
      console.error(error);
      ctx.internalServerError("Ocorreu um erro ao buscar reservas do cliente.");
    }
  },

  // ...incluir outras funções padrão herdadas se necessário...
}));