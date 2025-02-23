/**
 * reserva router
 */
import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::reserva.reserva", ({ router }) => {
  router.get("/reservas/barbeiro", "reserva.findByBarbeiro", {
    config: {
      auth: { scope: ["barbeiro"] }, // Permite acesso apenas à role "Barbeiro"
    },
  });

  return router;
});