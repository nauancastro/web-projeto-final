const API_URL_RESERVA = "http://localhost:1337/api/reservas";
const API_URL_USERS   = "http://localhost:1337/api/users";
const API_URL_AUTH    = "http://localhost:1337/api/auth/local/register";
const API_URL_LOGIN   = "http://localhost:1337/api/auth/local";

// ------------------------------------------
//  FUNÇÃO PARA BUSCAR RESERVAS DE UM BARBEIRO
// ------------------------------------------
async function buscarReservasDoBarbeiro() {
  // Verifica se há dados do usuário logado
  const userDataString = localStorage.getItem("userData");
  if (!userDataString) {
    throw new Error("Usuário não autenticado.");
  }

  const userData = JSON.parse(userDataString);
  const token = userData.token;
  const barberId = userData.id;

  // Garantir que o usuário é um Barbeiro
  if (userData.role !== "Barbeiro") {
    throw new Error("Acesso negado. Você não é barbeiro!");
  }

  // Monta URL com filtro e populate:
  // Ex: /api/reservas?filters[barbeiro][$eq]=<barberId>&populate=cliente
  const url = `${API_URL_RESERVA}?filters[barbeiro][id][$eq]=${barberId}&populate=cliente`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Erro ao buscar reservas.");
  }

  // A resposta do Strapi vem no formato { data: [ ... ] }
  const responseData = await response.json();

  // Retorna o array de reservas (responseData.data)
  return responseData.data; 
}

// ------------------------------------------
//  FUNÇÃO PARA BUSCAR BARBEIROS DINAMICAMENTE
// ------------------------------------------
async function buscarBarbeiros() {
  // 1) Verifica se o usuário está autenticado
  const userDataString = localStorage.getItem("userData");
  if (!userDataString) {
    throw new Error("Usuário não autenticado.");
  }

  // 2) Pega o token do localStorage
  const userData = JSON.parse(userDataString);
  const token = userData.token;

  // 3) Faz a requisição para buscar somente usuários com role=Barbeiro
  //    (Necessita que a role “Barbeiro” exista e que o usuário logado tenha permissão de find em /users 
  //     OU que exista uma rota customizada no Strapi para retornar barbers)
  const url = `${API_URL_USERS}?populate=role&filters[role][name][$eq]=Barbeiro`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Erro ao buscar barbeiros.");
  }

  const barbers = await response.json();
  // Retorna o array de usuários que têm a role “Barbeiro”
  return barbers; 
}

// ----------------------------------
//  FUNÇÃO CRIAR-RESERVA (REFATORADA)
// ----------------------------------
async function criarReserva(event) {
  event.preventDefault();

  const btnReserva       = document.getElementById("btn-reserva");
  const mensagemReserva  = document.getElementById("mensagem-reserva");

  btnReserva.disabled = true;
  mensagemReserva.textContent = "Processando reserva...";
  mensagemReserva.className = "text-yellow-500 text-center";

  // Verifica se o usuário está autenticado
  const userDataString = localStorage.getItem("userData");
  if (!userDataString) {
    mensagemReserva.textContent = "Usuário não autenticado. Faça login para reservar.";
    mensagemReserva.className = "text-red-500 text-center";
    btnReserva.disabled = false;
    return;
  }
  const userData = JSON.parse(userDataString);
  const token = userData.token;

  // Dados da reserva
  const dia       = document.getElementById("date").value;
  let horario     = document.getElementById("time").value;
  const barberId  = document.getElementById("barber").value; // ID do barbeiro
  const servico   = document.getElementById("service").value;

  // Ajusta o horário no formato com segundos e milissegundos
  horario = `${horario}:00.000`;

  // O campo “cliente” deve ser o ID do usuário logado
  const clienteId = userData.id;

  // Monta o objeto de reserva (Strapi formata no campo “data” por padrão)
  const reserva = {
    data: {
      dia,
      horario,
      cliente: clienteId, // ID do cliente
      barbeiro: barberId, // ID do barbeiro selecionado
      servico,
    },
  };

  try {
    const response = await fetch(API_URL_RESERVA, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reserva),
    });

    const responseData = await response.json();
    console.log("Resposta da API (criarReserva):", responseData);

    if (!response.ok) {
      throw new Error(responseData.error?.message || "Erro ao criar reserva");
    }

    mensagemReserva.textContent = "Reserva criada com sucesso!";
    mensagemReserva.className = "text-green-500 text-center";
    document.getElementById("reserva-form").reset();
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    mensagemReserva.textContent = "Erro ao criar reserva. Tente novamente!";
    mensagemReserva.className = "text-red-500 text-center";
  } finally {
    btnReserva.disabled = false;
  }
}

// ---- FUNÇÃO CRIAR-CONTA ----
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
    // Supondo que o backend atribua automaticamente a role "Cliente"
    const response = await fetch(API_URL_AUTH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const responseData = await response.json();
    console.log("Resposta da API:", responseData);

    if (!response.ok) {
      throw new Error(responseData.error?.message || "Erro ao criar conta");
    }

    // Após o registro, nenhum update extra é necessário se o usuário já recebe a role correta
    mensagemCriarConta.textContent = "Conta criada com sucesso!";
    mensagemCriarConta.className = "text-green-500 text-center";
    document.getElementById("criar-conta-form").reset();

    setTimeout(() => {
      window.location.href = "/frontend/src/login.html";
    }, 2000);
  } catch (error) {
    console.error("Erro:", error);
    mensagemCriarConta.textContent = "Erro ao criar conta. Tente novamente!";
    mensagemCriarConta.className = "text-red-500 text-center";
  } finally {
    btnCriarConta.disabled = false;
  }
}

// ---- FUNÇÃO FAZER-LOGIN ----
async function loginUsuario(event) {
  event.preventDefault();

  const btnLogin = document.getElementById("btn-login");
  const mensagemLogin = document.getElementById("mensagem-login");

  btnLogin.disabled = true;
  mensagemLogin.textContent = "Processando login...";
  mensagemLogin.className = "text-yellow-500 text-center";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(API_URL_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ identifier: email, password }),
    });

    const loginData = await response.json();
    console.log("Resposta do login:", loginData);

    if (!response.ok) {
      throw new Error(loginData.error?.message || "Erro ao fazer login");
    }

    const token = loginData.jwt;

    const meResponse = await fetch("http://localhost:1337/api/users/me?populate=role", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const meData = await meResponse.json();
    console.log("Usuário autenticado:", meData);

    if (!meData.role || !meData.role.name) {
      throw new Error("Usuário sem papel definido no banco de dados!");
    }
    const role = meData.role.name;
    const expiresAt = new Date().getTime() + 50 * 1000;
    const userData = { token, expiresAt, id: meData.id, username: meData.username, role };
    localStorage.setItem("userData", JSON.stringify(userData));

    mensagemLogin.textContent = "Login realizado com sucesso!";
    mensagemLogin.className = "text-green-500 text-center";

    setTimeout(() => {
      if (role === "Cliente") {
        window.location.href = "/frontend/src/reserva.html";
      } else if (role === "Barbeiro") {
        window.location.href = "/frontend/src/dashboard.html";
      } else {
        throw new Error("Usuário sem permissão para acessar esta área!");
      }
    }, 1000);
  } catch (error) {
    console.error("Erro:", error);
    mensagemLogin.textContent =
      error.message || "Erro ao fazer login. Tente novamente!";
    mensagemLogin.className = "text-red-500 text-center";
  } finally {
    btnLogin.disabled = false;
  }
}