document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("carrito-container");
  const totalDiv = document.getElementById("carrito-total");
  const accionesDiv = document.getElementById("carrito-acciones");
  const checkoutForm = document.getElementById("checkout-form");
  const formEnvio = document.getElementById("form-envio");

  function formatPrecio(valor) {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(valor);
  }

  function renderCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    checkoutForm.style.display = "none";

    if (carrito.length === 0) {
      contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
      totalDiv.innerHTML = "";
      accionesDiv.innerHTML = `<a href="/pages/productos.html" class="btn">Ver productos</a>`;
      return;
    }

    let html = `<table class="carrito-tabla">
      <thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
      <tbody>`;

    let total = 0;
    carrito.forEach((item, index) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      const imgSrc = item.imagen ? item.imagen.replace("../", "/") : "";
      html += `<tr>
        <td class="td-producto">
          ${imgSrc ? `<img src="${imgSrc}" alt="${item.nombre}" class="carrito-img">` : ""}
          <span>${item.nombre}</span>
        </td>
        <td>${formatPrecio(item.precio)}</td>
        <td>
          <button class="cantidad-btn" onclick="cambiarCantidad(${index}, -1)">-</button>
          <span>${item.cantidad}</span>
          <button class="cantidad-btn" onclick="cambiarCantidad(${index}, 1)">+</button>
        </td>
        <td>${formatPrecio(subtotal)}</td>
        <td><button class="btn btn-eliminar" onclick="eliminarItem(${index})">X</button></td>
      </tr>`;
    });

    html += `</tbody></table>`;
    contenedor.innerHTML = html;
    totalDiv.innerHTML = `<h3>Total: ${formatPrecio(total)}</h3>`;
    accionesDiv.innerHTML = `
      <button class="btn btn-vaciar" onclick="vaciarCarrito()">Vaciar carrito</button>
      <button class="btn btn-comprar" onclick="mostrarCheckout()">Confirmar compra</button>
    `;
  }

  window.mostrarCheckout = function () {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    if (!usuario) {
      alert("Debes iniciar sesión para comprar.");
      window.location.href = "/pages/login.html";
      return;
    }
    checkoutForm.style.display = "block";
    checkoutForm.scrollIntoView({ behavior: "smooth" });
  };

  window.cancelarCheckout = function () {
    checkoutForm.style.display = "none";
    document.getElementById("direccion").value = "";
    document.getElementById("envio-express").checked = false;
  };

  formEnvio.addEventListener("submit", async (e) => {
    e.preventDefault();

    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const token = localStorage.getItem("token");
    if (!token || carrito.length === 0) return;

    const direccion = document.getElementById("direccion").value.trim();
    const envio_express = document.getElementById("envio-express").checked;

    const venta = {
      direccion,
      envio_express,
      productos: carrito.map(item => ({ id_producto: item._id, cantidad: item.cantidad }))
    };

    try {
      const res = await fetch("/api/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(venta)
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Error al realizar la compra: " + error.error);
        return;
      }

      const resultado = await res.json();
      alert(`¡Compra realizada! Total: ${formatPrecio(resultado.total)}`);
      localStorage.setItem("carrito", JSON.stringify([]));
      cancelarCheckout();
      renderCarrito();
      crearNavbar();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
    }
  });

  window.cambiarCantidad = function (index, delta) {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
    crearNavbar();
  };

  window.eliminarItem = function (index) {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
    crearNavbar();
  };

  window.vaciarCarrito = function () {
    localStorage.setItem("carrito", JSON.stringify([]));
    renderCarrito();
    crearNavbar();
  };

  renderCarrito();
});
