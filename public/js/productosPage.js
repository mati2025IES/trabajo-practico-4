document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("productos-container");
  const filtroSelect = document.getElementById("filtro-categoria");
  let todosLosProductos = [];

  function formatPrecio(valor) {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(valor);
  }

  try {
    const res = await fetch("/api/productos");
    todosLosProductos = await res.json();
    poblarFiltro(todosLosProductos);
    renderProductos(todosLosProductos);
  } catch (error) {
    console.error("Error cargando productos:", error);
    contenedor.innerHTML = "<p>Error al cargar los productos.</p>";
    return;
  }

  function poblarFiltro(productos) {
    if (!filtroSelect) return;
    const categorias = [...new Set(productos.map(p => p.categoria))];
    filtroSelect.innerHTML = `<option value="todas">Todas</option>`;
    categorias.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      filtroSelect.appendChild(opt);
    });
  }

  if (filtroSelect) {
    filtroSelect.addEventListener("change", () => {
      const categoria = filtroSelect.value;
      renderProductos(categoria === "todas" ? todosLosProductos : todosLosProductos.filter(p => p.categoria === categoria));
    });
  }

  function renderProductos(productos) {
    contenedor.innerHTML = "";

    if (productos.length === 0) {
      contenedor.innerHTML = "<p>No se encontraron productos.</p>";
      return;
    }

    const categorias = {};
    productos.forEach(p => {
      if (!categorias[p.categoria]) categorias[p.categoria] = [];
      categorias[p.categoria].push(p);
    });

    for (const cat in categorias) {
      const titulo = document.createElement("h2");
      titulo.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      contenedor.appendChild(titulo);

      const grupo = document.createElement("div");
      grupo.classList.add("categoria-grupo");

      categorias[cat].forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <img src="${producto.imagen.replace('../', '/')}" alt="${producto.nombre}">
          <div class="card-content">
            <h3>${producto.nombre}</h3>
            <p>${producto.desc}</p>
            <p class="precio">${formatPrecio(producto.precio)}</p>
            <p class="stock">Stock: ${producto.stock}</p>
            <div class="cantidad">
              <button class="menos">-</button>
              <span>1</span>
              <button class="mas">+</button>
            </div>
            <button class="btn agregar">Añadir al carrito</button>
          </div>
        `;

        const span = card.querySelector("span");
        card.querySelector(".mas").addEventListener("click", () => {
          const val = parseInt(span.textContent);
          if (val < producto.stock) span.textContent = val + 1;
        });
        card.querySelector(".menos").addEventListener("click", () => {
          const val = parseInt(span.textContent);
          if (val > 1) span.textContent = val - 1;
        });
        card.querySelector(".agregar").addEventListener("click", () => {
          const cantidad = parseInt(span.textContent);
          const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
          const existente = carrito.find(item => item._id === producto._id);
          if (existente) {
            existente.cantidad += cantidad;
          } else {
            carrito.push({ ...producto, cantidad });
          }
          localStorage.setItem("carrito", JSON.stringify(carrito));
          alert(`"${producto.nombre}" (x${cantidad}) agregado al carrito`);
          crearNavbar();
        });

        grupo.appendChild(card);
      });

      contenedor.appendChild(grupo);
    }
  }
});
