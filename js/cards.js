function formatPrecio(valor) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(valor);
}

async function crearCards() {
  const cont = document.getElementById("cards-container");
  if (!cont) return;

  try {
    const res = await fetch("/api/productos");
    const productos = await res.json();
    const destacados = productos.filter(p => p.destacado).slice(0, 3);

    let html = "";
    destacados.forEach(p => {
      html += `<div class='card'>
        <img src='${p.imagen.replace("../", "/")}' alt='${p.nombre}'>
        <div class="card-content">
          <h3>${p.nombre}</h3>
          <p>${p.desc}</p>
          <p class='precio'>${formatPrecio(p.precio)}</p>
          <button class='btn' onclick='agregarAlCarrito(${JSON.stringify(p).replace(/'/g, "&#39;")})'>Agregar al carrito</button>
        </div>
      </div>`;
    });

    const linkCardHTML = `
      <a href="/pages/productos.html" class="card card-link">
        <h3>Ver todos los productos</h3>
        <p>Hacé clic acá para ver el catálogo completo.</p>
        <span class="flecha">&rarr;</span>
      </a>`;

    cont.innerHTML = html + linkCardHTML;
  } catch (error) {
    console.error("Error cargando productos:", error);
    cont.innerHTML = "<p>Error al cargar los productos.</p>";
  }
}

function agregarAlCarrito(producto) {
  const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
  const existente = carrito.find(item => item.id === producto.id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`"${producto.nombre}" agregado al carrito`);
  crearNavbar();
}

crearCards();
