document.addEventListener("DOMContentLoaded", async () => {
  const usersTableBody = document.getElementById("users-table-body");
  const mensagemAdmin = document.getElementById("mensagem-admin");

  try {
    const data = await buscarTodosUsuarios();
    const users = Array.isArray(data) ? data : data.data || [];
    if (!users.length) {
      mensagemAdmin.textContent = "Nenhum usuário encontrado.";
      mensagemAdmin.className = "text-center text-yellow-500 mt-4";
      return;
    }
    usersTableBody.innerHTML = "";
    users.forEach(user => {
      const { id, username, email, telefone } = user;
      const roleName = user.role?.name || "N/A";
      // Define o botão de alteração de role se aplicável
      let roleButton = "";
      if (roleName === "Cliente") {
        roleButton = `<button class="swap-role-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-2 rounded"
                         data-userid="${id}" data-newrole="Barbeiro">
                         Tornar Barbeiro</button>`;
      } else if (roleName === "Barbeiro") {
        roleButton = `<button class="swap-role-btn bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-2 rounded"
                         data-userid="${id}" data-newrole="Cliente">
                         Tornar Cliente</button>`;
      }
      // Botões de editar e deletar com dados incluídos
      const editButton = `<button class="edit-user-btn bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-2 rounded"
                              data-userid="${id}" data-username="${username}" data-email="${email}" data-telefone="${telefone}">
                              Editar</button>`;
      const deleteButton = `<button class="delete-user-btn bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded"
                               data-userid="${id}">Excluir</button>`;
      const acoes = `${roleButton} ${editButton} ${deleteButton}`;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border border-gray-700 px-2 py-1 text-center">${id}</td>
        <td class="border border-gray-700 px-2 py-1 text-center">${username}</td>
        <td class="border border-gray-700 px-2 py-1 text-center">${email}</td>
        <td class="border border-gray-700 px-2 py-1 text-center">${telefone || ""}</td>
        <td class="border border-gray-700 px-2 py-1 text-center">${roleName}</td>
        <td class="border border-gray-700 px-2 py-1 text-center">${acoes}</td>
      `;
      usersTableBody.appendChild(row);
    });

    // Listener para swap de role
    document.querySelectorAll(".swap-role-btn").forEach(button => {
      button.addEventListener("click", async () => {
        const userId = button.getAttribute("data-userid");
        const newRole = button.getAttribute("data-newrole");
        try {
          await atualizarRoleUsuario(userId, newRole);
          window.location.reload();
        } catch (err) {
          alert("Erro ao atualizar usuário: " + err.message);
        }
      });
    });

    // Listener para editar usuário usando modal
    document.querySelectorAll(".edit-user-btn").forEach(button => {
      button.addEventListener("click", () => {
        // Preenche os inputs do modal com os dados atuais
        document.getElementById("edit-user-id").value = button.getAttribute("data-userid");
        document.getElementById("edit-username").value = button.getAttribute("data-username");
        document.getElementById("edit-email").value = button.getAttribute("data-email");
        document.getElementById("edit-telefone").value = button.getAttribute("data-telefone");
        // Abre o modal
        document.getElementById("edit-user-modal").classList.remove("hidden");
      });
    });

    // Listener para cancelar no modal
    document.getElementById("cancel-edit-user").addEventListener("click", () => {
      document.getElementById("edit-user-modal").classList.add("hidden");
    });

    // Listener para envio do formulário do modal
    document.getElementById("edit-user-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const userId = document.getElementById("edit-user-id").value;
      const novoUsername = document.getElementById("edit-username").value;
      const novoEmail = document.getElementById("edit-email").value;
      const novoTelefone = document.getElementById("edit-telefone").value;
      try {
        await atualizarUsuario(userId, { username: novoUsername, email: novoEmail, telefone: novoTelefone });
        window.location.reload();
      } catch (err) {
        alert("Erro ao editar usuário: " + err.message);
      }
    });

    // Listener para deletar usuário
    document.querySelectorAll(".delete-user-btn").forEach(button => {
      button.addEventListener("click", async () => {
        const userId = button.getAttribute("data-userid");
        if (!confirm("Tem certeza que deseja deletar este usuário?")) return;
        try {
          await deletarUsuario(userId);
          window.location.reload();
        } catch (err) {
          alert("Erro ao deletar usuário: " + err.message);
        }
      });
    });
    
  } catch (err) {
    mensagemAdmin.textContent = err.message || "Erro ao carregar usuários.";
    mensagemAdmin.className = "text-center text-red-500 mt-4";
  }
});
