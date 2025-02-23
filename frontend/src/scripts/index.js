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
      })
      .catch((err) => console.error("Erro ao carregar cabeçalho:", err));
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
    const userInfo = document.getElementById("user-info");
    const userName = document.getElementById("user-name");
    const mobileUserInfo = document.getElementById("mobile-user-info");
    const mobileUserName = document.getElementById("mobile-user-name");

    if (!userDataString) {
      if (userInfo) userInfo.classList.add("hidden");
      if (mobileUserInfo) mobileUserInfo.classList.add("hidden");
      return;
    }
    const userData = JSON.parse(userDataString);
    if (userName) userName.textContent = userData.username;
    if (mobileUserName) mobileUserName.textContent = userData.username;
    if (userInfo) userInfo.classList.remove("hidden");
    if (mobileUserInfo) mobileUserInfo.classList.remove("hidden");
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
