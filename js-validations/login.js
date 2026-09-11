document.addEventListener("DOMContentLoaded", function() {
    var formularioLogin = document.getElementById("loginForm");
    
    if (formularioLogin) {
        formularioLogin.addEventListener("submit", function(evento) {
            evento.preventDefault();

            var correoIngresado = document.getElementById("emailLogin").value.trim().toLowerCase();
            var passwordIngresada = document.getElementById("passwordLogin").value.trim();
            var mensajeError = document.getElementById("errorMessage");

            mensajeError.innerHTML = ""; 

            var textoUsuarios = localStorage.getItem("listaUsuarios");
            var arregloUsuarios = [];

            if (textoUsuarios !== null) {
                arregloUsuarios = JSON.parse(textoUsuarios);
            } else {
                mensajeError.innerHTML = "No hay usuarios registrados todavía.";
                mensajeError.style.color = "red";
                return;
            }

            var usuarioEncontrado = false;
            var rolDelUsuario = "";
            var datosDelUsuario = null;

            for (var i = 0; i < arregloUsuarios.length; i++) {
                var usuarioActual = arregloUsuarios[i];
                var correoGuardado = usuarioActual.email.toLowerCase();

                if (correoGuardado === correoIngresado) {
                    if (usuarioActual.password === passwordIngresada) {
                        usuarioEncontrado = true;
                        rolDelUsuario = usuarioActual.rol;
                        datosDelUsuario = usuarioActual;
                    }
                }
            }

            if (usuarioEncontrado === true) {
                
                var textoSesion = JSON.stringify(datosDelUsuario);
                localStorage.setItem("sessionActivas", textoSesion);

                if (rolDelUsuario === "admin" || 
                    correoIngresado.includes("@duoc.cl") || 
                    correoIngresado.includes("@profesor.duoc.cl") || 
                    correoIngresado.includes("@duocprofesor.cl")) {
                    
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "index.html";
                }
                
            } else {
                mensajeError.innerHTML = "Usuario o contraseña incorrectos.";
                mensajeError.style.color = "red";
            }
        });
    }

    var btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", function() {
            localStorage.removeItem("sessionActivas");
            window.location.href = "index.html";
        });
    }
});