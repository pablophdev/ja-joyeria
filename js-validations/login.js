const form = document.querySelector("#loginForm");
const email = document.querySelector("#emailLogin");
const password = document.querySelector("#passwordLogin");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    errorMessage.textContent = "";

    // Traer la lista completa de usuarios
    let users = getFromLocalStorage('listaUsuarios');
    
    // Si no hay usuarios guardados, creamos un arreglo vacío
    if (users === null) {
        users = [];
    } else if (!Array.isArray(users)) {
        users = [users];
    }

    // Limpiamos los espacios y pasamos el correo a minúsculas
    let correoIngresado = email.value.trim().toLowerCase();
    let passIngresado = password.value.trim();

    // Buscar al usuario con un ciclo for
    let user = null;
    for (let i = 0; i < users.length; i++) {
        let correoGuardado = users[i].email.toLowerCase();
        if (correoGuardado === correoIngresado && users[i].password === passIngresado) {
            user = users[i];
        }
    }

    if (user === null) {
        errorMessage.textContent = 'Usuario o contraseña inválidos.';
        errorMessage.style.color = "#e53637";
    } else {
        // Guardamos la sesión
        guardarEnLocalStorage('sessionActivas', user);
        
        // Redirigir dependiendo del correo o si tiene el rol de admin guardado
        if (correoIngresado.endsWith('@profesor.duoc.cl') || 
            correoIngresado.endsWith('@duoc.cl') || 
            correoIngresado.endsWith('@duocprofesor.cl') || 
            user.rol === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    }
});

const btnLogout = document.querySelector("#btnLogout");

if (btnLogout) {
    btnLogout.addEventListener("click", cerrarSesion);
}

/* utils */
function guardarEnLocalStorage(nombreItem, info) {
    let stringDatos = JSON.stringify(info);
    localStorage.setItem(nombreItem, stringDatos);
}

function getFromLocalStorage(nombreItem)  {
    let datos = localStorage.getItem(nombreItem);
    if (!datos) return null;
    try {
        return JSON.parse(datos);
    } catch (e) {
        return null;
    }
}

function cerrarSesion() {
    localStorage.removeItem('sessionActivas');
    window.location.href = 'index.html';
}