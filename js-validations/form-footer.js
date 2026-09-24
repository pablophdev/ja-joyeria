const formsFooter = document.querySelectorAll(".footer__newslatter form");

for (let i = 0; i < formsFooter.length; i++) {
    formsFooter[i].addEventListener("submit", function(event) {
        event.preventDefault();

        const emailFooter = formsFooter[i].querySelector("input");
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let formularioValido = true;
        let mensajesError = "";

        if (!regexEmail.test(emailFooter.value.trim())) {
            formularioValido = false;
            mensajesError += "Por favor, ingresa un correo válido.";
        }

        if (formularioValido) {
            alert("¡Gracias por suscribirte a nuestras novedades!");
            emailFooter.value = "";
        } else {
            alert(mensajesError);
        }
    });
}
