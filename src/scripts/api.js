const API_URL_RESERVA = "http://localhost:1337/api/reservas";
const API_URL_USERS = "http://localhost:1337/api/users";

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
    const response = await fetch(API_URL_RESERVA, {
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

async function criarConta(event) {
  event.preventDefault();

  const btnCriarConta = document.getElementById("btn-criar-conta");
  const mensagemCriarConta = document.getElementById("mensagem-criar-conta");

  btnCriarConta.disabled = true;
  mensagemCriarConta.textContent = "Processando cadastro...";
  mensagemCriarConta.className = "text-yellow-500 text-center";

  const username = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const telefone = document.getElementById("phone").value;

  try {
    // 1️⃣ Criar conta sem telefone
    const response = await fetch(
      "http://localhost:1337/api/auth/local/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      }
    );

    const responseData = await response.json();
    console.log("Resposta da API:", responseData);

    if (!response.ok) {
      throw new Error(responseData.error?.message || "Erro ao criar conta");
    }

    // 2️⃣ Armazenar JWT no localStorage
    const token = responseData.jwt;
    if (!token) {
      throw new Error("JWT não recebido. Verifique as permissões da API.");
    }
    localStorage.setItem("jwt", token); // 🔐 Salva o JWT para futuras requisições

    // 3️⃣ Atualizar o telefone do usuário criado
    const userId = responseData.user.id;
    const updateResponse = await fetch(
      `http://localhost:1337/api/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔑 JWT na requisição
        },
        body: JSON.stringify({ telefone }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error("Erro ao atualizar telefone.");
    }

    mensagemCriarConta.textContent = "Conta criada com sucesso!";
    mensagemCriarConta.className = "text-green-500 text-center";
    document.getElementById("criar-conta-form").reset();
  } catch (error) {
    console.error("Erro:", error);
    mensagemCriarConta.textContent = "Erro ao criar conta. Tente novamente!";
    mensagemCriarConta.className = "text-red-500 text-center";
  } finally {
    btnCriarConta.disabled = false;
  }
}
