const form = document.querySelector("#loginForm");
const email = document.querySelector("#emailLogin");
const password = document.querySelector("#passwordLogin");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    errorMessage.textContent = "";

    //trae lista de usuarios
    let users = getFromLocalStorage('listaUsuarios');
    
    //si no hay crea una lista vacia
    if (users === null) {
        users = [];
    } else if (!Array.isArray(users)) {
        users = [users];
    }

    //limpia espacios y convierte minusculas
    let correoIngresado = email.value.trim().toLowerCase();
    let passIngresado = password.value.trim();

    //busca al usuario
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
        //guarda la sesion
        guardarEnLocalStorage('sessionActivas', user);
        
        //segun rol dirige a admin o a index
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