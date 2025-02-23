export default {
  routes: [
    {
      method: "GET",
      path: "/reservas/barbeiro",
      handler: "reserva.findByBarbeiro",
      config: {
        auth: { scope: ["barbeiro"] }, // Permite acesso apenas à role "Barbeiro"
      },
    },
  ],
};
