function crearNavbar() {
  const navbarDiv = document.getElementById("navbar");
  const loggedIn = localStorage.getItem("loggedIn") === "true";

  let navHTML = `<nav class='navbar'>
    <a href="/index.html"><h1 class='logo'>CapaCapa</h1></a>
    <ul>
      <li><a href="/index.html">Inicio</a></li>
      <li><a href="/pages/productos.html">Productos</a></li>`;

  if (loggedIn) {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    navHTML += `<li><a href="/pages/carrito.html">Carrito (${totalItems})</a></li>`;
    navHTML += `<li><button id='logoutBtn' class='btn'>Cerrar Sesión</button></li>`;
  } else {
    navHTML += `<li><a href='/pages/registro.html'>Registro</a></li>`;
    navHTML += `<li><a href='/pages/login.html'>Login</a></li>`;
  }

  navHTML += `</ul></nav>`;
  navbarDiv.innerHTML = navHTML;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      window.location.href = "/pages/login.html";
    });
  }
}

crearNavbar();
