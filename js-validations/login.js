const form = document.querySelector("#loginForm");
const email = document.querySelector("#emailLogin");
const password = document.querySelector("#passwordLogin");
const errorMessage = document.querySelector("#errorMessage");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^.{6,}$/;

    // VALIDACIÓN
    let formularioValido = true;
    errorMessage.textContent = "";
    
    //Email
    if (!regexEmail.test(email.value.trim())) {
        console.log("Email inválido");
        formularioValido = false;
        errorMessage.textContent += "Por favor, ingresa un correo válido. "; 
    } else {
        console.log("Email válido");
    }

    //Contraseña
    if (!regexPassword.test(password.value.trim())) {
        console.log("Contraseña inválida");
        formularioValido = false;
        errorMessage.textContent += "La contraseña debe tener al menos 6 caracteres.";
    } else {
        console.log("Contraseña válida");
    }

    if (formularioValido) {
        console.log("Formulario válido");
        
        form.reset();
    } else {
        console.log("Formulario inválido}}}");
    }
});