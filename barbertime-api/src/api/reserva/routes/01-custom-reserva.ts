export default {
  routes: [
    {
      method: 'GET',
      path: '/reservas/barbeiro',
      handler: 'api::reserva.reserva.findByBarbeiro',
      config: {
        auth: { scope: ['barbeiro'] }, // Permite acesso apenas ao role "barbeiro"
      },
    },
  ],
};