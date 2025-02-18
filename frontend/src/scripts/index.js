// -------INÍCIO-COMPONENTES-------
// INICIO FOOTER
async function loadFooter() {
  try {
    // Carrega o componente
    const response = await fetch(`/src/components/footer.html`);
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
// FIM FOOTER

// INICIO HEADER
async function loadHeader() {
  try {
    // Carrega o componente
    const response = await fetch(`/src/components/header.html`);
    const headerHTML = await response.text();

    // Verifica se o elemento existe antes de definir o innerHTML
    const headerContainer = document.getElementById("header-container");
    if (headerContainer) {
      headerContainer.innerHTML = headerHTML;
    } else {
      console.error("Elemento header-container não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao carregar o cabeçalho:", error);
  }
}
// Chama a função para carregar o header
loadHeader();
// FIM HEADER
// -------FIM-COMPONENTES----------

// Função para abrir e fechar o menu mobile
function toggleMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenu) {
    mobileMenu.classList.toggle("hidden");
  } else {
    console.error("Elemento mobile-menu não encontrado.");
  }
}

// Back to top button
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

// Verificar horário de funcionamento
const horario = document.getElementById("horario-funcionamento");
if (horario) {
  const agora = new Date();
  const horaAtual = agora.getHours();

  if (horaAtual >= 9 && horaAtual <= 20) {
    horario.classList.add("bg-green-500");
    horario.textContent = "Estamos abertos! de 9h às 20h";
  } else {
    horario.classList.add("bg-red-500");
    horario.textContent = "Estamos fechados! Aberto de 9h às 20h";
  }
} else {
  console.error("Elemento horario-funcionamento não encontrado.");
}
