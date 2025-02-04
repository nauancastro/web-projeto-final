// -------INÍCIO-COMPONENTES-------
// INICIO FOOTER
async function loadFooter() {
  try {
    // Verifica se a página está na raiz ou dentro da pasta ./src/
    const basePath = window.location.pathname.includes("/src/") ? ".." : ".";

    // Caminho correto para carregar o footer
    const response = await fetch(`${basePath}/src/components/footer.html`);
    const footerHTML = await response.text();

    // Insere o rodapé na página
    document.getElementById("footer-container").innerHTML = footerHTML;
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
    // Verifica se a página está na raiz ou dentro da pasta ./src/
    const basePath = window.location.pathname.includes("/src") ? ".." : ".";

    // Caminho correto para carregar o header
    const response = await fetch(`${basePath}/src/components/header.html`);
    const headerHTML = await response.text();

    // Insere o cabeçalho na página
    document.getElementById("header-container").innerHTML = headerHTML;
  } catch (error) {
    console.error("Erro ao carregar o rodapé:", error);
  }
}
// Chama a função para carregar o header
loadHeader();
// FIM HEADER
// -------FIM-COMPONENTES----------

// Função para abrir e fechar o menu mobile
function toggleMenu() {
  document.getElementById("mobile-menu").classList.toggle("hidden");
}

// Back to top button
window.addEventListener("scroll", function () {
  const button = document.getElementById("back-to-top");
  if (window.scrollY > 300) {
    button.classList.remove("hidden");
  } else {
    button.classList.add("hidden");
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Verificar horário de funcionamento
const horario = document.getElementById("horario-funcionamento");
const agora = new Date();
const horaAtual = agora.getHours();

if (horaAtual >= 9 && horaAtual <= 20) {
  horario.classList.add("bg-green-500");
  horario.textContent = "Estamos abertos! de 9h às 20h";
} else {
  horario.classList.add("bg-red-500");
  horario.textContent = "Estamos fechados! Aberto de 9h às 20h";
}
