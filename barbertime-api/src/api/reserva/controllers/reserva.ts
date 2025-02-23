/**
 * reserva controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::reserva.reserva", ({ strapi }) => ({
  async findByBarbeiro(ctx) {
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized("Você precisa estar autenticado.");
      }

      if (user.role.name !== "Barbeiro") {
        return ctx.forbidden("Apenas barbeiros podem acessar esta informação.");
      }

      const reservas = await strapi.entityService.findMany("api::reserva.reserva", {
        filters: { barbeiro: user.id },
        populate: { cliente: true }, // Inclui os dados do cliente na resposta
      });

      return reservas;
    } catch (error) {
      ctx.throw(500, "Erro ao buscar reservas", { error });
    }
  },
}));