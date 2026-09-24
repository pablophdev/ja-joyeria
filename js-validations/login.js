const form = document.querySelector("#loginForm");
const email = document.querySelector("#emailLogin");
const password = document.querySelector("#passwordLogin");
const errorMessage = document.querySelector("#errorMessage");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^.{6,}$/;

    let formularioValido = true;
    let mensajesError = "";

    if (!regexEmail.test(email.value.trim())) {
        formularioValido = false;
        mensajesError += "Por favor, ingresa un correo válido. <br>";
    }

    if (!email.value.trim().endsWith("@duoc.cl")) {
        formularioValido = false;
        mensajesError += "El correo debe ser de estudiante Duoc: @duoc.cl. <br>";
    }

    if (!regexPassword.test(password.value.trim())) {
        formularioValido = false;
        mensajesError += "La contraseña debe tener al menos 6 caracteres. <br>";
    }

    errorMessage.innerHTML = mensajesError;

    if (formularioValido) {
        const usuario = getFromLocalStorage('usuario');

        if (usuario === null) {
            errorMessage.innerHTML = "No hay usuarios registrados todavía.";
            return;
        }

        if (usuario.email.toLowerCase() === email.value.trim().toLowerCase() &&
            usuario.password === password.value.trim()) {

            guardarEnLocalStorage('sessionActivas', usuario);
            alert("¡Inicio de sesión exitoso!");
            form.reset();

            if (usuario.rol === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "index.html";
            }
        } else {
            errorMessage.innerHTML = "Usuario o contraseña incorrectos.";
        }
    }
});

const btnLogout = document.querySelector("#btnLogout");

if (btnLogout) {
    btnLogout.addEventListener("click", function() {
        localStorage.removeItem("sessionActivas");
        window.location.href = "index.html";
    });
}

/* utils */

function guardarEnLocalStorage(nombreItem, info) {
    let stringDatos = JSON.stringify(info);
    localStorage.setItem(nombreItem, stringDatos);
}

function getFromLocalStorage(nombreItem) {
    let datos = localStorage.getItem(nombreItem);
    return datos ? JSON.parse(datos) : null;
}
