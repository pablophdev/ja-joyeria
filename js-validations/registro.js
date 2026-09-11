document.addEventListener("DOMContentLoaded", function() {
    var formulario = document.getElementById("registerForm");

    if (formulario) {
        formulario.addEventListener("submit", function(evento) {
            evento.preventDefault();

            var nombre = document.getElementById("nombreRegistro").value.trim();
            var run = document.getElementById("runRegistro").value.trim();
            var email = document.getElementById("correoRegistro").value.trim().toLowerCase();
            var confirmarEmail = document.getElementById("confirmarCorreoRegistro").value.trim().toLowerCase();
            var password = document.getElementById("passwordRegistro").value.trim();
            var confirmarPassword = document.getElementById("confirmarPasswordRegistro").value.trim();
            var telefono = document.getElementById("telefonoRegistro").value.trim();
            var region = document.getElementById("regionRegistro").value;
            var comuna = document.getElementById("comunaRegistro").value;
            var mensajeError = document.getElementById("errorMessageRegister");

            mensajeError.innerHTML = "";

            if (nombre === "") {
                mensajeError.innerHTML = "Por favor, ingresa tu nombre.";
                return;
            }

            if (run === "") {
                mensajeError.innerHTML = "Por favor, ingresa tu RUT.";
                return;
            }

            var partesRut = run.split("-");
            if (partesRut.length !== 2) {
                mensajeError.innerHTML = "El RUT debe tener un guion (-).";
                return;
            }

            var numeros = partesRut[0];
            var digitoVerificador = partesRut[1].toUpperCase();
            var suma = 0;
            var multiplicador = 2;

            for (var i = numeros.length - 1; i >= 0; i--) {
                suma = suma + (parseInt(numeros.charAt(i)) * multiplicador);
                multiplicador = multiplicador + 1;
                if (multiplicador > 7) {
                    multiplicador = 2;
                }
            }

            var resto = suma % 11;
            var resultado = 11 - resto;
            var dvCalculado = "";

            if (resultado === 11) {
                dvCalculado = "0";
            } else if (resultado === 10) {
                dvCalculado = "K";
            } else {
                dvCalculado = resultado.toString();
            }

            if (dvCalculado !== digitoVerificador) {
                mensajeError.innerHTML = "El RUT ingresado no es válido.";
                return;
            }

            if (email === "") {
                mensajeError.innerHTML = "Falta ingresar el correo.";
                return;
            }

            if (email !== confirmarEmail) {
                mensajeError.innerHTML = "Los correos no coinciden.";
                return;
            }

            var correoValido = false;
            if (email.includes("@gmail.com")) {
                correoValido = true;
            } else if (email.includes("@duoc.cl")) {
                correoValido = true;
            } else if (email.includes("@profesor.duoc.cl")) {
                correoValido = true;
            } else if (email.includes("@duocprofesor.cl")) {
                correoValido = true;
            }

            if (correoValido === false) {
                mensajeError.innerHTML = "El correo debe ser @gmail.com, @duoc.cl o @profesor.duoc.cl";
                return;
            }

            if (password.length < 6) {
                mensajeError.innerHTML = "La contraseña debe tener al menos 6 caracteres.";
                return;
            }

            if (password !== confirmarPassword) {
                mensajeError.innerHTML = "Las contraseñas no coinciden.";
                return;
            }

            if (region === "") {
                mensajeError.innerHTML = "Debes seleccionar una región.";
                return;
            }

            if (comuna === "") {
                mensajeError.innerHTML = "Debes seleccionar una comuna.";
                return;
            }

            var textoUsuarios = localStorage.getItem("listaUsuarios");
            var arregloUsuarios = [];

            if (textoUsuarios !== null) {
                arregloUsuarios = JSON.parse(textoUsuarios);
            }

            var correoYaExiste = false;
            for (var j = 0; j < arregloUsuarios.length; j++) {
                if (arregloUsuarios[j].email === email) {
                    correoYaExiste = true;
                }
            }

            if (correoYaExiste === true) {
                mensajeError.innerHTML = "Este correo ya está registrado en el sistema.";
                return;
            }

            var rolAsignado = "user";
            if (email.includes("@duoc.cl") || email.includes("@profesor.duoc.cl") || email.includes("@duocprofesor.cl")) {
                rolAsignado = "admin";
            }
            if (nombre.toLowerCase() === "admin") {
                rolAsignado = "admin";
            }

            var usuarioNuevo = {
                nombre: nombre,
                run: run,
                email: email,
                password: password,
                telefono: telefono,
                region: region,
                comuna: comuna,
                rol: rolAsignado
            };

            arregloUsuarios.push(usuarioNuevo);
            var nuevoTextoUsuarios = JSON.stringify(arregloUsuarios);
            localStorage.setItem("listaUsuarios", nuevoTextoUsuarios);

            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
            
            formulario.reset();
            if (typeof $ !== 'undefined' && $.fn.niceSelect) {
                $('#comunaRegistro').empty().append('<option value="">-- Seleccione la comuna --</option>');
                $('#regionRegistro').niceSelect('update');
                $('#comunaRegistro').niceSelect('update');
            }

            window.location.href = "login.html";
        });
    }
});

$(document).ready(function() {
    $("#regionRegistro").on("change", function() {

        var regionSeleccionada = $("#regionRegistro").val();
        var selectComuna = $("#comunaRegistro");

        selectComuna.empty();
        selectComuna.append('<option value="">-- Seleccione la comuna --</option>');

        if (regionSeleccionada === "RM") {
            selectComuna.append('<option value="Santiago">Santiago</option>');
            selectComuna.append('<option value="Puente Alto">Puente Alto</option>');
            selectComuna.append('<option value="Maipu">Maipú</option>');
            selectComuna.append('<option value="La Florida">La Florida</option>');
            selectComuna.append('<option value="Las Condes">Las Condes</option>');
        } else if (regionSeleccionada === "Araucania") {
            selectComuna.append('<option value="Temuco">Temuco</option>');
            selectComuna.append('<option value="Villarrica">Villarrica</option>');
            selectComuna.append('<option value="Pucon">Pucón</option>');
        } else if (regionSeleccionada === "Nuble") {
            selectComuna.append('<option value="Chillan">Chillán</option>');
            selectComuna.append('<option value="San Carlos">San Carlos</option>');
            selectComuna.append('<option value="Bulnes">Bulnes</option>');
        }

        if ($.fn.niceSelect) {
            selectComuna.niceSelect('update');
        }
    });
});