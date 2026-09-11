const form = document.querySelector("#registerForm");
const nombre = document.querySelector("#nombreRegistro");
const run = document.querySelector("#runRegistro");
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
    const regexRun = /^[0-9]+-[0-9kK]{1}$/;

    let formularioValido = true;
    let mensajesError = "";

    if (!regexNombre.test(nombre.value.trim())) {
        formularioValido = false;
        mensajesError = mensajesError + "Ingresa un nombre válido (solo letras). <br>"; 
    }

    let runValor = run.value.trim();
    if (!regexRun.test(runValor)) {
        formularioValido = false;
        mensajesError = mensajesError + "El RUT debe tener formato válido con guion. <br>";
    } else {
        let partes = runValor.split("-");
        let numeros = partes[0];
        let digitoVerificador = partes[1].toUpperCase();

        let suma = 0;
        let multiplicador = 2;

        for (let i = numeros.length - 1; i >= 0; i--) {
            suma = suma + (parseInt(numeros.charAt(i)) * multiplicador);
            multiplicador = multiplicador + 1;
            if (multiplicador > 7) {
                multiplicador = 2;
            }
        }

        let resto = suma % 11;
        let resultado = 11 - resto;
        let dvCalculado = "";

        if (resultado === 11) {
            dvCalculado = "0";
        } else if (resultado === 10) {
            dvCalculado = "K";
        } else {
            dvCalculado = resultado.toString();
        }

        if (dvCalculado !== digitoVerificador) {
            formularioValido = false;
            mensajesError = mensajesError + "El RUT ingresado no existe o es inválido. <br>";
        }
    }

    if (!regexEmail.test(email.value.trim())) {
        formularioValido = false;
        mensajesError = mensajesError + "Por favor, ingresa un correo válido. <br>"; 
    }

    if (email.value.trim() !== confirmarEmail.value.trim() || confirmarEmail.value.trim() === "") {
        formularioValido = false;
        mensajesError = mensajesError + "Los correos no coinciden. <br>";
    }

    if (!regexPassword.test(password.value.trim())) {
        formularioValido = false;
        mensajesError = mensajesError + "La contraseña debe tener al menos 6 caracteres. <br>";
    }

    if (password.value.trim() !== confirmarPassword.value.trim() || confirmarPassword.value.trim() === "") {
        formularioValido = false;
        mensajesError = mensajesError + "Las contraseñas no coinciden. <br>";
    }

    if (telefono.value.trim() !== "") {
        if (!regexTelefono.test(telefono.value.trim())) {
            formularioValido = false;
            mensajesError = mensajesError + "El teléfono debe tener entre 8 y 12 números. <br>";
        }
    }

    if (region.value === "") {
        formularioValido = false;
        mensajesError = mensajesError + "Debes seleccionar una región. <br>";
    }
    
    if (comuna.value === "") {
        formularioValido = false;
        mensajesError = mensajesError + "Debes seleccionar una comuna. <br>";
    }

    errorMessage.innerHTML = mensajesError;

    if (formularioValido) {
        alert("¡Registro exitoso!");
        form.reset();
        
        if (typeof $ !== 'undefined' && $.fn.niceSelect) {
            $('#comunaRegistro').empty().append('<option value="">-- Seleccione la comuna --</option>');
            $('#regionRegistro').niceSelect('update');
            $('#comunaRegistro').niceSelect('update');
        }
    }
});

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