const form = document.querySelector("#registerForm");
const nombre = document.querySelector("#nombreRegistro");
const email = document.querySelector("#correoRegistro");
const confirmarEmail = document.querySelector("#confirmarCorreoRegistro");
const password = document.querySelector("#passwordRegistro");
const confirmarPassword = document.querySelector("#confirmarPasswordRegistro");
const telefono = document.querySelector("#telefonoRegistro");
const region = document.querySelector("#regionRegistro");
const comuna = document.querySelector("#comunaRegistro");
const errorMessage = document.querySelector("#errorMessageRegister");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^.{6,}$/;
    const regexTelefono = /^[0-9]{8,12}$/;

    // VALIDACIÓN
    let formularioValido = true;
    errorMessage.textContent = "";
    
    // Nombre
    if (!regexNombre.test(nombre.value.trim())) {
        console.log("Nombre inválido");
        formularioValido = false;
        errorMessage.textContent += "Ingresa un nombre válido (solo letras). "; 
    } else {
        console.log("Nombre válido");
    }

    // Email
    if (!regexEmail.test(email.value.trim())) {
        console.log("Email inválido");
        formularioValido = false;
        errorMessage.textContent += "Por favor, ingresa un correo válido. "; 
    } else {
        console.log("Email válido");
    }

    // Confirmar Email
    if (email.value.trim() !== confirmarEmail.value.trim() || confirmarEmail.value.trim() === "") {
        console.log("Correos no coinciden");
        formularioValido = false;
        errorMessage.textContent += "Los correos no coinciden. ";
    } else {
        console.log("Correos coinciden");
    }

    // Contraseña
    if (!regexPassword.test(password.value.trim())) {
        console.log("Contraseña inválida");
        formularioValido = false;
        errorMessage.textContent += "La contraseña debe tener al menos 6 caracteres. ";
    } else {
        console.log("Contraseña válida");
    }

    // Confirmar Contraseña
    if (password.value.trim() !== confirmarPassword.value.trim() || confirmarPassword.value.trim() === "") {
        console.log("Contraseñas no coinciden");
        formularioValido = false;
        errorMessage.textContent += "Las contraseñas no coinciden. ";
    } else {
        console.log("Contraseñas coinciden");
    }

    // Teléfono
    if (telefono.value.trim() !== "") {
        if (!regexTelefono.test(telefono.value.trim())) {
            console.log("Teléfono inválido");
            formularioValido = false;
            errorMessage.textContent += "El teléfono debe tener entre 8 y 12 números. ";
        } else {
            console.log("Teléfono válido");
        }
    }

    // Región 
    if (region.value === "") {
        console.log("Región inválida");
        formularioValido = false;
        errorMessage.textContent += "Debes seleccionar una región. ";
    }
    
    // Comuna
    if (comuna.value === "") {
        console.log("Comuna inválida");
        formularioValido = false;
        errorMessage.textContent += "Debes seleccionar una comuna. ";
    }

    // Resultado final
    if (formularioValido) {
        console.log("Formulario válido");
        alert("¡Registro exitoso!");
        
        form.reset();
        
        if (typeof $ !== 'undefined' && $.fn.niceSelect) {
            $('#comunaRegistro').empty().append('<option value="">-- Seleccione la comuna --</option>');
            $('#regionRegistro').niceSelect('update');
            $('#comunaRegistro').niceSelect('update');
        }
    } else {
        console.log("Formulario inválido}}}");
    }
});




//Cambio de comunas segun region
$(document).ready(function() {
    
    $('#regionRegistro').on('change', function() {
        let regionSeleccionada = $('#regionRegistro').val(); 
        let comunas = []; 

        if (regionSeleccionada === "RM") {
            comunas = ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes"];
        } else if (regionSeleccionada === "Araucania") {
            comunas = ["Temuco", "Villarrica", "Pucón"];
        } else if (regionSeleccionada === "Nuble") {
            comunas = ["Chillán", "San Carlos", "Bulnes"];
        } else {
            comunas = [];
        }

        $('#comunaRegistro').empty();
        $('#comunaRegistro').append('<option value="">-- Seleccione la comuna --</option>');

        for (let i = 0; i < comunas.length; i++) {
            let opcionHtml = '<option value="' + comunas[i] + '">' + comunas[i] + '</option>';
            $('#comunaRegistro').append(opcionHtml);
        }

        if ($.fn.niceSelect) {
            $('#comunaRegistro').niceSelect('update');
        }
    });

});