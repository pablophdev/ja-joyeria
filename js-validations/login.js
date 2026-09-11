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

    const users = getFromLocalStorage('user') || [];
    console.log(users)
    const user = users.find(u => u.email === email.value && u.password === password.value);
    console.log(user)
    if (!user) {
        errorMessage.textContent = 'Usuario o contraseña inválidos.';
    } else {
        guardarEnLocalStorage('sessionActivas', user);
        window.location.href('index.html');
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

function  getFromLocalStorage(nombreItem)  {
    let datos = localStorage.getItem(nombreItem);
    datos  =  JSON.parse(datos);
    return  datos;
}

function cerrarSesion() {
    localStorage.removeItem('sessionActivas');
    window.location.href('index.html')
}