document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const contraseña = document.getElementById("password").value;

      try {
        const res = await fetch("/api/usuarios/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, contraseña })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Error al iniciar sesión");
          return;
        }

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        window.location.href = "/index.html";
      } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor.");
      }
    });
  }
});
