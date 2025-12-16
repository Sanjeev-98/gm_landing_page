// Navigation loader and initializer
function loadNavigation() {
  fetch("navigation.html")
    .then((response) => response.text())
    .then((data) => {
      // Load navigation into all placeholders
      const placeholders = document.querySelectorAll("#navigation-placeholder");
      placeholders.forEach((placeholder) => {
        placeholder.innerHTML = data;
      });
      initializeNavigation();
    })
    .catch((error) => console.error("Error loading navigation:", error));
}

function initializeNavigation() {
  // Highlight active page
  highlightActivePage();

  // Mobile menu toggle
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

  hamburgerBtn.addEventListener("click", () => {
    mobileMenu.classList.add("active");
    mobileMenuOverlay.classList.add("active");
  });

  mobileMenuOverlay.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    mobileMenuOverlay.classList.remove("active");
  });

  // Mobile dropdown toggles
  const mobileDropdownBtns = document.querySelectorAll(".mobile-dropdown-btn");
  mobileDropdownBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const targetContent = document.getElementById(targetId);
      const arrow = btn.querySelector("svg");
      const isActive = targetContent.classList.contains("active");

      // Close all dropdowns
      document
        .querySelectorAll(".mobile-dropdown-content")
        .forEach((content) => {
          content.classList.remove("active");
        });

      // Reset all arrows
      document.querySelectorAll(".mobile-dropdown-btn svg").forEach((svg) => {
        svg.style.transform = "rotate(0deg)";
      });

      // Toggle current dropdown
      if (!isActive) {
        targetContent.classList.add("active");
        arrow.style.transform = "rotate(180deg)";
      }
    });
  });

  // Close mobile menu when clicking on a link
  const mobileMenuLinks = document.querySelectorAll("#mobile-menu a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      mobileMenuOverlay.classList.remove("active");
    });
  });

  // Handle dropdown menu visibility
  const dropdowns = document.querySelectorAll(".dropdown");
  let closeTimer = null;

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector("button");
    const menu = dropdown.querySelector(".dropdown-menu");

    // Show menu on button hover
    button.addEventListener("mouseenter", () => {
      clearTimeout(closeTimer);
      menu.style.display = "block";
    });

    // Hide menu when leaving button
    button.addEventListener("mouseleave", () => {
      closeTimer = setTimeout(() => {
        menu.style.display = "none";
      }, 100);
    });

    // Keep menu visible when hovering over it
    menu.addEventListener("mouseenter", () => {
      clearTimeout(closeTimer);
    });

    // Hide menu when leaving menu
    menu.addEventListener("mouseleave", () => {
      menu.style.display = "none";
    });
  });
}

function highlightActivePage() {
  const currentPage = document.body.getAttribute("data-page");
  if (!currentPage) return;

  // Highlight desktop navigation
  const desktopLinks = document.querySelectorAll(".nav-link");
  desktopLinks.forEach((link) => {
    if (link.getAttribute("data-page") === currentPage) {
      link.classList.add("active");
    }
  });

  // Highlight mobile navigation
  const mobileLinks = document.querySelectorAll(".mobile-menu-item");
  mobileLinks.forEach((link) => {
    if (link.getAttribute("data-page") === currentPage) {
      link.classList.add("active");
    }
  });
}

// Load navigation when DOM is ready
document.addEventListener("DOMContentLoaded", loadNavigation);
