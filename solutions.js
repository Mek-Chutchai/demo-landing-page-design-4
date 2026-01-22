// Solutions Page Modal Handler
document.addEventListener("DOMContentLoaded", function () {
  // Get all "Read More" buttons
  const readMoreButtons = document.querySelectorAll(".btn-read-more");
  const modals = document.querySelectorAll(".solution-modal");
  const closeButtons = document.querySelectorAll(".modal-close");

  // Open modal when clicking "Read More"
  readMoreButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modalId = this.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
      }
    });
  });

  // Close modal when clicking close button
  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".solution-modal");
      if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = ""; // Restore scrolling
      }
    });
  });

  // Close modal when clicking outside content
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      modals.forEach((modal) => {
        modal.classList.remove("active");
      });
      document.body.style.overflow = "";
    }
  });
});
