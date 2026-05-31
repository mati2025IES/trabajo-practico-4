document.addEventListener("DOMContentLoaded", () => {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const heroBtn = document.getElementById("hero-registro-btn");
  if (heroBtn && loggedIn) heroBtn.style.display = "none";
});
