document.addEventListener("DOMContentLoaded", () => {
  const registroForm = document.getElementById("registroForm");

  if (registroForm) {
    registroForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value;
      const apellido = document.getElementById("apellido").value;
      const email = document.getElementById("email").value;
      const contraseña = document.getElementById("password").value;
      const fechaNac = document.getElementById("fecha_nacimiento").value;

      const hoy = new Date();
      const nacimiento = new Date(fechaNac);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;

      try {
        const res = await fetch("/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, apellido, email, contraseña, edad })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Error al registrarse");
          return;
        }

        alert("¡Registro exitoso! Serás redirigido para iniciar sesión.");
        window.location.href = "/pages/login.html";
      } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor.");
      }
    });
  }
});
