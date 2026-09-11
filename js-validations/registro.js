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
        mensajesError += "Ingresa un nombre válido (solo letras). <br>"; 
    }

    let runValor = run.value.trim();
    if (!regexRun.test(runValor)) {
        formularioValido = false;
        mensajesError += "El RUT debe tener formato válido con guion. <br>";
    } else {
        let partes = runValor.split("-");
        let numeros = partes[0];
        let digitoVerificador = partes[1].toUpperCase();

        let suma = 0;
        let multiplicador = 2;

        for (let i = numeros.length - 1; i >= 0; i--) {
            suma += (parseInt(numeros.charAt(i)) * multiplicador);
            multiplicador++;
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
            mensajesError += "El RUT ingresado no existe o es inválido. <br>";
        }
    }

    //pasar a minisculas y sin espacio
    let correoIngresado = email.value.trim().toLowerCase();
    let correoConfirmar = confirmarEmail.value.trim().toLowerCase();

    if (!regexEmail.test(correoIngresado)) {
        formularioValido = false;
        mensajesError += "Por favor, ingresa un correo válido. <br>"; 
    }

    if (!correoIngresado.endsWith("@gmail.com") && 
        !correoIngresado.endsWith("@duoc.cl") && 
        !correoIngresado.endsWith("@profesor.duoc.cl") &&
        !correoIngresado.endsWith("@duocprofesor.cl")) {
        formularioValido = false;
        mensajesError += "El correo debe ser de dominio: @gmail.com, @duoc.cl o @profesor.duoc.cl. <br>";
    }

    if (correoIngresado !== correoConfirmar || correoConfirmar === "") {
        formularioValido = false;
        mensajesError += "Los correos no coinciden. <br>";
    }

    let passIngresada = password.value.trim();
    let passConfirmar = confirmarPassword.value.trim();

    if (!regexPassword.test(passIngresada)) {
        formularioValido = false;
        mensajesError += "La contraseña debe tener al menos 6 caracteres. <br>";
    }

    if (passIngresada !== passConfirmar || passConfirmar === "") {
        formularioValido = false;
        mensajesError += "Las contraseñas no coinciden. <br>";
    }

    if (telefono.value.trim() !== "") {
        if (!regexTelefono.test(telefono.value.trim())) {
            formularioValido = false;
            mensajesError += "El teléfono debe tener entre 8 y 12 números. <br>";
        }
    }

    if (region.value === "") {
        formularioValido = false;
        mensajesError += "Debes seleccionar una región. <br>";
    }
    
    if (comuna.value === "") {
        formularioValido = false;
        mensajesError += "Debes seleccionar una comuna. <br>";
    }

    // Traer usuarios guardados para ver si el correo ya existe
    let usuariosGuardados = getFromLocalStorage('listaUsuarios');
    if (usuariosGuardados === null) {
        usuariosGuardados = []; 
    } else if (!Array.isArray(usuariosGuardados)) {
        usuariosGuardados = [usuariosGuardados]; 
    }

    let correoYaExiste = false;
    for (let i = 0; i < usuariosGuardados.length; i++) {
        // También comparamos en minúsculas por si acaso
        if (usuariosGuardados[i].email.toLowerCase() === correoIngresado) {
            correoYaExiste = true;
        }
    }

    if (correoYaExiste) {
        formularioValido = false;
        mensajesError += "Este correo ya se encuentra registrado. <br>";
    }

    errorMessage.innerHTML = mensajesError;

    if (formularioValido) {
        
        //asigna rol
        let rol = 'user';
        if (correoIngresado.endsWith('@profesor.duoc.cl') || 
            correoIngresado.endsWith('@duoc.cl') || 
            correoIngresado.endsWith('@duocprofesor.cl') || 
            nombre.value.trim().toLowerCase() === 'admin') {
            rol = 'admin';
        }
        
        const nuevoUsuario = {
            nombre: nombre.value.trim(),
            run: runValor,
            email: correoIngresado,
            password: passIngresada,
            telefono: telefono.value.trim(),
            region: region.value,
            comuna: comuna.value,
            rol: rol
        };

        // Agregar a la lista y guardar
        usuariosGuardados.push(nuevoUsuario);
        guardarEnLocalStorage('listaUsuarios', usuariosGuardados);
        
        alert("¡Registro exitoso! Serás redirigido al inicio de sesión.");
        form.reset();
        
        if (typeof $ !== 'undefined' && $.fn.niceSelect) {
            $('#comunaRegistro').empty().append('<option value="">-- Seleccione la comuna --</option>');
            $('#regionRegistro').niceSelect('update');
            $('#comunaRegistro').niceSelect('update');
        }

        // Redirigir al login
        window.location.href = 'login.html';
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

/* utils */
function guardarEnLocalStorage(nombreItem, info) {
    let stringDatos = JSON.stringify(info);
    localStorage.setItem(nombreItem, stringDatos);
}

function getFromLocalStorage(nombreItem) {
    let datos = localStorage.getItem(nombreItem);
    if (!datos) return null;
    try {
        return JSON.parse(datos);
    } catch (e) {
        return null;
    }
}