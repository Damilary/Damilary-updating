// darkmode

const initDarkMode = () => {
  const darkmode = document.querySelector("#darkmode");
  if (!darkmode) return;

  darkmode.addEventListener("click", () => {
    if (darkmode.classList.contains("bx-moon")) {
      darkmode.classList.replace("bx-moon", "bx-sun");
      document.body.classList.add("active");
    } else {
      darkmode.classList.replace("bx-sun", "bx-moon");
      document.body.classList.remove("active");
    }
  });
};

// Initialize if in browser
if (typeof document !== 'undefined') {
  initDarkMode();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initDarkMode };
}
