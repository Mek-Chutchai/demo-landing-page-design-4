// Header Component Loader
async function loadHeader(activePage = "home") {
  try {
    console.log("🔄 Loading header component...");
    const response = await fetch("components/header.html");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const headerHTML = await response.text();
    console.log("📄 Header HTML loaded, length:", headerHTML.length);

    // Insert header into the page
    const headerContainer = document.getElementById("header-container");
    if (headerContainer) {
      headerContainer.innerHTML = headerHTML;
      console.log("✅ Header HTML inserted into DOM");

      // Wait a tiny bit for DOM to be ready
      setTimeout(() => {
        // Set active page
        setActivePage(activePage);

        // Initialize navigation menu
        initNavigationMenu();

        console.log("✅ Header component fully initialized");
      }, 0);
    } else {
      console.error("❌ Header container not found!");
    }
  } catch (error) {
    console.error("❌ Error loading header:", error);
  }
}

// Set active navigation link
function setActivePage(activePage) {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.dataset.page === activePage) {
      link.classList.add("active");
    }
  });
}

// Initialize complete navigation menu system
function initNavigationMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navDropdowns = document.querySelectorAll(".nav-dropdown");

  console.log("🔧 Initializing navigation...");
  console.log("  - Hamburger:", hamburger ? "✅ Found" : "❌ Not found");
  console.log("  - Nav menu:", navMenu ? "✅ Found" : "❌ Not found");
  console.log("  - Dropdowns:", navDropdowns.length, "found");

  // Hamburger menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", !isExpanded);
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
      console.log("📱 Mobile menu toggled:", !isExpanded ? "OPEN" : "CLOSED");
    });
  } else {
    console.error("❌ Cannot initialize hamburger menu - elements not found");
  }

  // Mobile dropdown toggle
  navDropdowns.forEach((dropdown) => {
    const link = dropdown.querySelector(".nav-link");
    link?.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle("active");
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".main-nav")) {
      navMenu?.classList.remove("active");
      hamburger?.setAttribute("aria-expanded", "false");
      hamburger?.classList.remove("active");

      // Close all dropdowns
      navDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    }
  });

  // Close menu when window is resized to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      navMenu?.classList.remove("active");
      hamburger?.setAttribute("aria-expanded", "false");
      hamburger?.classList.remove("active");
      navDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    }
  });

  // Add scroll effect to navbar
  const mainNav = document.querySelector(".main-nav");
  if (mainNav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        mainNav.classList.add("scrolled");
      } else {
        mainNav.classList.remove("scrolled");
      }
    });
    console.log("📜 Scroll listener added to navbar");
  }
}
