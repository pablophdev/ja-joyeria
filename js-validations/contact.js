document.addEventListener("DOMContentLoaded", function() {
    let formulario = document.getElementById("form-contacto");

    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        let nombre = document.getElementById("nombre").value;
        let email = document.getElementById("email").value;
        let mensaje = document.getElementById("mensaje").value;
        let error = document.getElementById("mensaje-error");

        let regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        let regexArroba = /@/;
        let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (nombre == "") {
            error.innerHTML = "El nombre esta vacio";
            error.style.display = "block";
        } else if (regexLetras.test(nombre) == false) {
            error.innerHTML = "El nombre tiene que ser solo letras";
            error.style.display = "block";
        } else if (email == "") {
            error.innerHTML = "El email esta vacio";
            error.style.display = "block";
        } else if (regexArroba.test(email) == false) {
            error.innerHTML = "El email debe tener una arroba (@)";
            error.style.display = "block";
        } else if (regexEmail.test(email) == false) {
            error.innerHTML = "El correo no es valido";
            error.style.display = "block";
        } else if (mensaje == "") {
            error.innerHTML = "El mensaje esta vacio";
            error.style.display = "block";
        } else {
            error.style.display = "none";
            alert("Enviado con exito");
            formulario.reset();
        }
    });
});