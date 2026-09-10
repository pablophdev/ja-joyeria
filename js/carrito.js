var arregloCarrito = [];

function cargarCarrito() {
    var datos = localStorage.getItem('ja_joyerias_cart');
    if (datos != null) {
        arregloCarrito = JSON.parse(datos);
    } else {
        arregloCarrito = [];
    }
}

function guardarEnLocalStorage() {
    var stringDatos = JSON.stringify(arregloCarrito);
    localStorage.setItem('ja_joyerias_cart', stringDatos);
}

function convertirAPrecioChileno(monto) {
    return '$' + Number(monto).toLocaleString('es-CL');
}

function sacarNumeroDeTexto(texto) {
    var res = '';
    for (var i = 0; i < texto.length; i++) {
        if (texto[i] >= '0' && texto[i] <= '9') {
            res = res + texto[i];
        }
    }
    if (res == '') {
        return 0;
    }
    return parseInt(res);
}

function agregarProducto(nombre, precio, imagen, cant) {
    cargarCarrito();
    
    var yaExiste = false;
    var posicion = -1;

    for (var i = 0; i < arregloCarrito.length; i++) {
        if (arregloCarrito[i].name == nombre) {
            yaExiste = true;
            posicion = i;
            break;
        }
    }

    if (yaExiste == true) {
        arregloCarrito[posicion].quantity = arregloCarrito[posicion].quantity + cant;
    } else {
        var nuevoProd = {
            name: nombre,
            price: precio,
            img: imagen,
            quantity: cant
        };
        arregloCarrito.push(nuevoProd);
    }

    guardarEnLocalStorage();
    alert('"' + nombre + '" agregado al carrito.');
}

window.onload = function() {

    var botonesLista = document.querySelectorAll('.product__item .add-cart');
    for (var i = 0; i < botonesLista.length; i++) {
        botonesLista[i].onclick = function(evento) {
            evento.preventDefault();

            var card = this.closest('.product__item');
            var h6 = card.querySelector('.product__item__text h6');
            var h5 = card.querySelector('.product__item__text h5');
            
            var nombreProd = h6.innerText.trim();
            var precioProd = sacarNumeroDeTexto(h5.innerText.trim());

            var fotoDiv = card.querySelector('.product__item__pic');
            var foto = '';

            if (fotoDiv.getAttribute('data-setbg')) {
                foto = fotoDiv.getAttribute('data-setbg');
            } else {
                if (fotoDiv.style.backgroundImage) {
                    var bg = fotoDiv.style.backgroundImage;
                    foto = bg.replace('url("', '').replace('")', '').replace('url(\'', '').replace('\')', '');
                }
            }

            agregarProducto(nombreProd, precioProd, foto, 1);
        };
    }

    var botonDetalle = document.querySelector('.product__details__cart__option .primary-btn');
    if (botonDetalle != null) {
        botonDetalle.onclick = function(evento) {
            evento.preventDefault();

            var divDetalle = this.closest('.shop__details__text');
            var nombreDetalle = divDetalle.querySelector('h4').innerText.trim();
            var precioDetalle = sacarNumeroDeTexto(divDetalle.querySelector('h3').innerText.trim());

            var inputCant = divDetalle.querySelector('.pro-qty input');
            if (inputCant == null) {
                inputCant = divDetalle.querySelector('input');
            }

            var cantidadProd = 1;
            if (inputCant != null) {
                var valor = parseInt(inputCant.value);
                if (valor > 0) {
                    cantidadProd = valor;
                }
            }

            var fotoImg = document.querySelector('.shop__details__pic__item img');
            var rutaFoto = '';
            if (fotoImg != null) {
                rutaFoto = fotoImg.getAttribute('src');
            }

            agregarProducto(nombreDetalle, precioDetalle, rutaFoto, cantidadProd);
        };
    }

    var tablaCarrito = document.querySelector('.shopping__cart__table tbody');
    if (tablaCarrito != null) {
        mostrarTabla();
    }
};

function mostrarTabla() {
    cargarCarrito();
    var tabla = document.querySelector('.shopping__cart__table tbody');
    var spanSubtotal = document.querySelector('.cart__total ul li:first-child span');
    var spanTotal = document.querySelector('.cart__total ul li:last-child span');

    tabla.innerHTML = '';

    if (arregloCarrito.length == 0) {
        tabla.innerHTML = '<tr><td colspan="4" class="text-center py-5"><h5>Tu carrito está vacío.</h5></td></tr>';
        if (spanSubtotal != null) {
            spanSubtotal.innerText = '$0';
        }
        if (spanTotal != null) {
            spanTotal.innerText = '$0';
        }
        return;
    }

    var totalAPagar = 0;

    for (var i = 0; i < arregloCarrito.length; i++) {
        var p = arregloCarrito[i];
        var totalPorFila = p.price * p.quantity;
        totalAPagar = totalAPagar + totalPorFila;

        var imgFinal = 'img/shopping-cart/cart-1.jpg';
        if (p.img != '' && p.img != null) {
            imgFinal = p.img;
        }

        var tr = document.createElement('tr');
        var contenidoHtml = '';
        contenidoHtml = contenidoHtml + '<td class="product__cart__item">';
        contenidoHtml = contenidoHtml + '  <div class="product__cart__item__pic">';
        contenidoHtml = contenidoHtml + '    <img src="' + imgFinal + '" width="80" height="80" style="object-fit: cover;" alt="' + p.name + '">';
        contenidoHtml = contenidoHtml + '  </div>';
        contenidoHtml = contenidoHtml + '  <div class="product__cart__item__text">';
        contenidoHtml = contenidoHtml + '    <h6>' + p.name + '</h6>';
        contenidoHtml = contenidoHtml + '    <h5>' + convertirAPrecioChileno(p.price) + '</h5>';
        contenidoHtml = contenidoHtml + '  </div>';
        contenidoHtml = contenidoHtml + '</td>';
        contenidoHtml = contenidoHtml + '<td class="quantity__item">';
        contenidoHtml = contenidoHtml + '  <div class="quantity">';
        contenidoHtml = contenidoHtml + '    <div class="pro-qty-2">';
        contenidoHtml = contenidoHtml + '      <input type="number" min="1" value="' + p.quantity + '" data-pos="' + i + '" class="cart-qty-input" style="width: 60px; text-align: center;">';
        contenidoHtml = contenidoHtml + '    </div>';
        contenidoHtml = contenidoHtml + '  </div>';
        contenidoHtml = contenidoHtml + '</td>';
        contenidoHtml = contenidoHtml + '<td class="cart__price">' + convertirAPrecioChileno(totalPorFila) + '</td>';
        contenidoHtml = contenidoHtml + '<td class="cart__close">';
        contenidoHtml = contenidoHtml + '  <i class="fa fa-close" data-pos="' + i + '" style="cursor: pointer;"></i>';
        contenidoHtml = contenidoHtml + '</td>';

        tr.innerHTML = contenidoHtml;
        tabla.appendChild(tr);
    }

    if (spanSubtotal != null) {
        spanSubtotal.innerText = convertirAPrecioChileno(totalAPagar);
    }
    if (spanTotal != null) {
        spanTotal.innerText = convertirAPrecioChileno(totalAPagar);
    }

    var inputs = document.querySelectorAll('.cart-qty-input');
    for (var a = 0; a < inputs.length; a++) {
        inputs[a].onchange = function(e) {
            var pos = this.getAttribute('data-pos');
            var valorNuevo = parseInt(this.value);

            if (isNaN(valorNuevo) || valorNuevo < 1) {
                valorNuevo = 1;
            }

            arregloCarrito[pos].quantity = valorNuevo;
            guardarEnLocalStorage();
            mostrarTabla();
        };
    }

    var cruces = document.querySelectorAll('.cart__close i');
    for (var b = 0; b < cruces.length; b++) {
        cruces[b].onclick = function(e) {
            var posBorrar = this.getAttribute('data-pos');
            arregloCarrito.splice(posBorrar, 1);
            guardarEnLocalStorage();
            mostrarTabla();
        };
    }
}