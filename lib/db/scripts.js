document.addEventListener("DOMContentLoaded", () => {
  const colors = document.querySelectorAll(".color");

  colors.forEach(el => {
    el.addEventListener("click", () => {
      const name = el.textContent;
      const value = el.dataset.color;

      console.log(`${name}: ${value}`);

      // Visual feedback
      el.style.outline = "3px solid white";
      setTimeout(() => {
        el.style.outline = "none";
      }, 500);

      // Copy to clipboard
      navigator.clipboard.writeText(value)
        .then(() => console.log("Copied to clipboard!"))
        .catch(() => console.log("Clipboard failed"));
    });
  });
});
