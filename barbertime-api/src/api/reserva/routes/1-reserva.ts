export default {
  routes: [
    {
      method: 'GET',
      path: '/find-by-barbeiro',
      handler: 'reserva.findByBarbeiro',
    },
      
    {
      method: "GET",
      path: "/find-by-cliente",
      handler: 'reserva.findByCliente',
    }
  ]
}
