// Footer Component Loader
async function loadFooter() {
  try {
    console.log("🔄 Loading footer component...");
    const response = await fetch("components/footer.html");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const footerHTML = await response.text();
    console.log("📄 Footer HTML loaded");

    // Insert footer into the page
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
      footerContainer.innerHTML = footerHTML;
      console.log("✅ Footer component loaded successfully");
    } else {
      console.error("❌ Footer container not found!");
    }
  } catch (error) {
    console.error("❌ Error loading footer:", error);
  }
}
