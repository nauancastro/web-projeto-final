// INICIO FOOTER
async function loadFooter() {
  try {
    // Carrega o componente
    const response = await fetch(`/frontend/src/components/footer.html`);
    const footerHTML = await response.text();

    // Verifica se o elemento existe antes de definir o innerHTML
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
      footerContainer.innerHTML = footerHTML;
    } else {
      console.error("Elemento footer-container não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao carregar o rodapé:", error);
  }
}
// Chama a função para carregar o rodapé
loadFooter();

document.addEventListener("DOMContentLoaded", () => {
  carregarHeader();

  function carregarHeader() {
    const headerContainer = document.getElementById("header-container");
    if (!headerContainer) return;
    fetch("/frontend/src/components/header.html")
      .then((res) => res.text())
      .then((html) => {
        headerContainer.innerHTML = html;
        configurarMenu();
        carregarUserInfo();
        checkHeaderUserRole(); // call the new function after header insertion
      })
      .catch((err) => console.error("Erro ao carregar cabeçalho:", err));
  }

  // New function to toggle "Minhas Reservas" based on user role
  function checkHeaderUserRole() {
    const userDataString = localStorage.getItem("userData");
    if (!userDataString) return;
    try {
      const userData = JSON.parse(userDataString);
      if (userData.role === "Cliente") {
        const menuReservas = document.getElementById("menu-reservas");
        const mobileMenuReservas = document.getElementById("mobile-menu-reservas");
        if (menuReservas) menuReservas.style.display = "block";
        if (mobileMenuReservas) mobileMenuReservas.style.display = "block";
      }
    } catch (e) {
      console.error("Error checking header user role:", e);
    }
  }

  function configurarMenu() {
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuOverlay = document.getElementById("menu-overlay");
    if (!menuBtn || !mobileMenu || !menuOverlay) return;

    menuBtn.onclick = toggleMenu;
    menuOverlay.onclick = toggleMenu;
  }

  window.toggleMenu = function toggleMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    const menuOverlay = document.getElementById("menu-overlay");
    if (!mobileMenu || !menuOverlay) return;
    const aberto = !mobileMenu.classList.contains("translate-x-full");
    mobileMenu.classList.toggle("translate-x-full", aberto);
    menuOverlay.classList.toggle("hidden", aberto);
  };

  function carregarUserInfo() {
    const userDataString = localStorage.getItem("userData");

    // Desktop elements
    const userText = document.getElementById("user-text");
    const userName = document.getElementById("user-name");
    const loginLink = document.getElementById("login-link");
    const logoutBtn = document.getElementById("logout-btn");

    // Mobile elements
    const mobileUserText = document.getElementById("mobile-user-text");
    const mobileUserName = document.getElementById("mobile-user-name");
    const mobileLoginLink = document.getElementById("mobile-login-link");
    const mobileLogoutBtn = document.getElementById("mobile-logout-btn");

    if (!userDataString) {
      if (loginLink) loginLink.classList.remove("hidden");
      if (userText) userText.classList.add("hidden");
      if (logoutBtn) logoutBtn.classList.add("hidden");

      if (mobileLoginLink) mobileLoginLink.classList.remove("hidden");
      if (mobileUserText) mobileUserText.classList.add("hidden");
      if (mobileLogoutBtn) mobileLogoutBtn.classList.add("hidden");
      return;
    }

    const userData = JSON.parse(userDataString);

    // Desktop: Exibe dados do usuário
    if (userText) {
      userText.classList.remove("hidden");
      if (userName) userName.textContent = userData.username;
    }
    if (loginLink) loginLink.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");

    // Mobile: Exibe dados do usuário
    if (mobileUserText) {
      mobileUserText.classList.remove("hidden");
      if (mobileUserName) mobileUserName.textContent = userData.username;
    }
    if (mobileLoginLink) mobileLoginLink.classList.add("hidden");
    if (mobileLogoutBtn) mobileLogoutBtn.classList.remove("hidden");
  }

  const btnCheckLogin = document.getElementById("btn-check-login");
  if (btnCheckLogin) {
    btnCheckLogin.onclick = () => {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
        window.location.href = "/frontend/src/login.html";
      } else {
        const userData = JSON.parse(userDataString);
        if (userData.role === "Cliente") {
          window.location.href = "/frontend/src/reserva.html";
        } else if (userData.role === "Barbeiro") {
          window.location.href = "/frontend/src/dashboard.html";
        } else {
          window.location.href = "/frontend/src/login.html";
        }
      }
    };
  }

  if (window.location.pathname.includes("minhas_reservas.html")) {
    carregarReservasDoCliente();
  }
  
  async function carregarReservasDoCliente() {
    const reservasBody = document.getElementById("reservas-cliente-corpo");
    const mensagem = document.getElementById("mensagem-minhas-reservas");
    const clienteInfo = document.getElementById("cliente-info");
    if (!reservasBody || !mensagem) return;
  
    try {
      const data = await buscarReservasDoCliente();
      if (data.cliente) {
        clienteInfo.textContent = `Reservas de ${data.cliente.nome}`;
      }
      const reservas = data.reservas || data.data || [];
      if (!reservas.length) {
        mensagem.textContent = "Você não possui reservas.";
        mensagem.className = "text-center text-yellow-500";
        return;
      }
      // Limpa a tabela e prepara para renderização
      reservasBody.innerHTML = "";
      reservas.forEach((item) => {
        const rec = item.attributes || item;
        const identifier = rec.documentId;
        const dia = rec.dia;
        const horario = rec.horario;
        const servico = rec.servico;
        const barbeiroName = rec.barbeiro 
            ? (rec.barbeiro.data?.attributes?.username || rec.barbeiro.nome || "N/A")
            : "N/A";
  
        // Cria a linha com todas as células, incluindo uma célula vazia para ações
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="border border-gray-700 px-4 py-2 text-center">${formatarData(dia)}</td>
          <td class="border border-gray-700 px-4 py-2 text-center">${formatarHorario(horario)}</td>
          <td class="border border-gray-700 px-4 py-2 text-center">${barbeiroName}</td>
          <td class="border border-gray-700 px-4 py-2 text-center">${formatarServico(servico)}</td>
          <td class="border border-gray-700 px-4 py-2 text-center"></td>
        `;
        // Cria os botões de Editar e Excluir
        const actionCell = tr.querySelector("td:last-child");
  
        const editButton = document.createElement("button");
        editButton.className = "edit-btn p-1 bg-blue-500 rounded";
        if (identifier) {
          editButton.setAttribute("data-identifier", identifier);
          editButton.setAttribute("data-date", dia);
          editButton.setAttribute("data-time", horario);
          editButton.textContent = "Editar";
        } else {
          editButton.textContent = "Não editável";
          editButton.disabled = true;
        }
  
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn p-1 bg-red-500 rounded ml-2";
        if (identifier) {
          deleteButton.setAttribute("data-identifier", identifier);
          deleteButton.textContent = "Excluir";
        }
  
        // Adiciona ambos na célula de ações
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
        reservasBody.appendChild(tr);
      });
    } catch (err) {
      mensagem.textContent = err.message || "Erro ao carregar reservas.";
      mensagem.className = "text-center text-red-500";
    }
  }
  
  // Listener para abertura do modal utilizando data-identifier
  document.getElementById("reservas-cliente-corpo").addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const identifier = e.target.getAttribute("data-identifier");
      const dia = e.target.getAttribute("data-date");
      const horario = e.target.getAttribute("data-time");
      document.getElementById("edit-reserva-id").value = identifier;
      document.getElementById("edit-date").value = dia;
      document.getElementById("edit-time").value = horario.slice(0, 5);
      document.getElementById("edit-reserva-modal").classList.remove("hidden");
    }
  });

  // Fechar modal ao clicar em Cancelar
  document.getElementById("cancel-edit").addEventListener("click", () => {
    document.getElementById("edit-reserva-modal").classList.add("hidden");
  });

  // Enviar formulário de edição
  if (!window.location.pathname.includes("minhas_reservas.html")) {
    document.getElementById("edit-reserva-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const documentId = document.getElementById("edit-reserva-id").value;
      const dia = document.getElementById("edit-date").value;
      const time = document.getElementById("edit-time").value;
      const horario = `${time}:00.000`;
      try {
        await editarReserva(documentId, dia, horario);
        alert("Reserva atualizada com sucesso!");
        location.reload();
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // Listener para modal no dashboard
  document.getElementById("reservations-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const identifier = e.target.getAttribute("data-identifier");
      const dia = e.target.getAttribute("data-date");
      const horario = e.target.getAttribute("data-time");
      document.getElementById("edit-reserva-id").value = identifier;
      document.getElementById("edit-date").value = dia;
      document.getElementById("edit-time").value = horario.slice(0,5);
      document.getElementById("edit-reserva-modal").classList.remove("hidden");
    }
  });

  document.getElementById("cancel-edit").addEventListener("click", () => {
    document.getElementById("edit-reserva-modal").classList.add("hidden");
  });

  // Attach edit-reserva-form listener only if NOT on minhas_reservas.html
  if (!window.location.pathname.includes("minhas_reservas.html")) {
    document.getElementById("edit-reserva-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const dia = document.getElementById("edit-date").value;
      const time = document.getElementById("edit-time").value;
      // Note: Dashboard validation could be added here if desired.
      const error = validateReservationDateTime ? validateReservationDateTime(dia, time) : null;
      if (error) {
        alert(error);
        return;
      }
      const identifier = document.getElementById("edit-reserva-id").value;
      const horario = `${time}:00.000`;
      try {
        await editarReserva(identifier, dia, horario);
        alert("Reserva atualizada com sucesso!");
        location.reload();
      } catch (error) {
        alert(error.message);
      }
    });
  }
});

// Botão de “voltar ao topo”
window.addEventListener("scroll", function () {
  const button = document.getElementById("back-to-top");
  if (button) {
    if (window.scrollY > 300) {
      button.classList.remove("hidden");
    } else {
      button.classList.add("hidden");
    }
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function formatarData(dia) {
  if (!dia) return "";
  const [ano, mes, diaNum] = dia.split("-");
  return `${diaNum}/${mes}/${ano}`;
}
function formatarHorario(horario) {
  if (!horario) return "";
  return horario.slice(0, 5);
}
function formatarServico(servico) {
  switch (servico) {
    case "corte":
      return "Corte de Cabelo";
    case "barba":
      return "Barba";
    case "cortebarba":
      return "Corte + Barba";
    case "barboterapia":
      return "Barboterapia";
    default:
      return servico;
  }
}
