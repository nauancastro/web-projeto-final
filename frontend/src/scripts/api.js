const API_URL_RESERVA = "http://localhost:1337/api/reservas";
const API_URL_USERS = "http://localhost:1337/api/users";
const API_URL_AUTH = "http://localhost:1337/api/auth/local/register";
const API_URL_LOGIN = "http://localhost:1337/api/auth/local";
const API_URL_ROLES = "http://localhost:1337/api/users-permissions/roles";

// ---- FUNÇÃO CRIAR-RESERVA ----
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
  const roleEscolhida = "Cliente"; //document.getElementById("role").value; // Pegamos a role do formulário (Cliente ou Barbeiro)

  try {
    // Criar conta com role padrão (Authenticated)
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

    // Obter o id e o JWT do usuário criado
    const userId = responseData.user.id;
    const jwtToken = responseData.jwt;

    // Obter ID da Role selecionada (Cliente ou Barbeiro)
    const rolesResponse = await fetch(API_URL_ROLES, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });

    const rolesData = await rolesResponse.json();
    const roleObj = rolesData.roles.find((r) => r.name === roleEscolhida);
    
    if (!roleObj) {
      throw new Error("Role inválida selecionada!");
    }

    const roleId = roleObj.id;

    // Atualizar usuário para a nova role
    const updateResponse = await fetch(`${API_URL_USERS}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ telefone: telefone.toString(), role: roleId }),
    });

    if (!updateResponse.ok) {
      throw new Error("Erro ao atualizar usuário com a role correta.");
    }

    mensagemCriarConta.textContent = "Conta criada com sucesso!";
    mensagemCriarConta.className = "text-green-500 text-center";
    document.getElementById("criar-conta-form").reset();

    // Redirecionar para login
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
    // Login para obter JWT
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

    // Obter informações completas do usuário
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

    // Salvar no localStorage
    const expiresAt = new Date().getTime() + 50 * 1000;
    const userData = { token, expiresAt, username: meData.username, role };
    localStorage.setItem("userData", JSON.stringify(userData));

    mensagemLogin.textContent = "Login realizado com sucesso!";
    mensagemLogin.className = "text-green-500 text-center";

    // Redirecionamento baseado na role
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