const header = document.querySelector(".header");

async function loadNavbar() {
    const response = await fetch("navbar.html");

    if (!response.ok) {
        throw new Error("Navbar could not be loaded");
    }

    header.innerHTML = await response.text();

    const menuButton = header.querySelector(".menu-button");
    const navLinks = header.querySelector(".nav-links");
    const searchButton = header.querySelector(".search-button");
    const searchPanel = header.querySelector(".search-panel");
    const searchInput = header.querySelector(".search-panel input");
    const searchClose = header.querySelector(".search-close");
    const bagButton = header.querySelector(".bag-button");

    bagButton.addEventListener("click", () => {
        window.location.href = "bag.html";
    });
    menuButton.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.textContent = isOpen ? "Close" : "Menu";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.textContent = "Menu";
        });
    });

    searchButton.addEventListener("click", () => {
        searchPanel.classList.add("open");
        searchPanel.setAttribute("aria-hidden", "false");
        searchInput.focus();
    });

    searchClose.addEventListener("click", () => {
        searchPanel.classList.remove("open");
        searchPanel.setAttribute("aria-hidden", "true");
        searchInput.value = "";
    });
setInterval(() => {
    let getBagItem = JSON.parse(localStorage.getItem("bagProducts")) || [];
    let cartCount = document.querySelector(".cart-count");
    cartCount.textContent = `${getBagItem.length}`;
}, 500);
}

loadNavbar();
