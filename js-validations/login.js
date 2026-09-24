const form = document.querySelector("#loginForm");
const email = document.querySelector("#emailLogin");
const password = document.querySelector("#passwordLogin");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    errorMessage.textContent = "";
    const session = getFromLocalStorage('sessionActivas');

    if (session) {
        errorMessage.textContent = 'Ya tienes una sesión activa.';
        form.reset();
        return;
    }

    const emailValor = email.value.trim().toLowerCase();
    const passwordValor = password.value.trim();

    const users = getFromLocalStorage('usuarios') || [];

    const user = users.find(u => u.email.toLowerCase() === emailValor && u.password === passwordValor);

    if (!user) {
        errorMessage.textContent = 'Usuario o contraseña inválidos.';
    } else {
        guardarEnLocalStorage('sessionActivas', user);

        if (user.rol === 'admin') {
            alert('Bienvenido Administrador: ' + user.nombre);
            window.location.href = './admin.html';
        } else {
            alert('Bienvenido: ' + user.nombre);
            window.location.href = './index.html';
        }
    }
});

const btnLogout = document.querySelector("#btnLogout");

if (btnLogout) {
    btnLogout.addEventListener("click", cerrarSesion);
}

function guardarEnLocalStorage(nombreIteam, info) {
    let stringDatos = JSON.stringify(info);
    localStorage.setItem(nombreIteam, stringDatos);
}

function getFromLocalStorage(nombreItem) {
    let datos = localStorage.getItem(nombreItem);
    return datos ? JSON.parse(datos) : null;
}

function cerrarSesion() {
    localStorage.removeItem('sessionActivas');
    window.location.href = './index.html';
}