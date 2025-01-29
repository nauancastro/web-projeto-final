const API_URL = "http://localhost:1337/api/reservas";

async function criarReserva(event) {
  event.preventDefault();

  const btnReserva = document.getElementById("btn-reserva");
  const mensagemReserva = document.getElementById("mensagem-reserva");

  btnReserva.disabled = true;
  mensagemReserva.textContent = "Processando reserva...";
  mensagemReserva.className = "text-yellow-500 text-center";

  const dia = document.getElementById("date").value;
  let horario = document.getElementById("time").value;

  // Adicionando segundos e milissegundos ao horário
  horario = `${horario}:00.000`;

  const cliente = "Usuário Padrão";
  const barbeiro = document.getElementById("barber").value;
  const servico = document.getElementById("service").value;

  const reserva = {
    data: { dia, horario, cliente, barbeiro, servico },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(reserva),
    });

    const responseData = await response.json();
    console.log("Resposta da API:", responseData);

    if (!response.ok) {
      throw new Error(responseData.error?.message || "Erro ao criar reserva");
    }

    mensagemReserva.textContent = "Reserva criada com sucesso!";
    mensagemReserva.className = "text-green-500 text-center";
    document.getElementById("reserva-form").reset();
  } catch (error) {
    console.error("Erro:", error);
    mensagemReserva.textContent = "Erro ao criar reserva. Tente novamente!";
    mensagemReserva.className = "text-red-500 text-center";
  } finally {
    btnReserva.disabled = false;
  }
}