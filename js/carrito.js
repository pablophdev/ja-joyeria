const CART_STORAGE_KEY = 'ja_joyerias_cart';

function getCart() {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function formatPrice(value) {
    return '$' + Number(value).toLocaleString('es-CL');
}

function parsePrice(priceText) {
    return parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;
}

function addToCart(product) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.name === product.name);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += product.quantity;
    } else {
        cart.push(product);
    }

    saveCart(cart);
    alert(`"${product.name}" agregado al carrito.`);
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.product__item .add-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.product__item');
            const name = productCard.querySelector('.product__item__text h6').innerText.trim();
            const priceText = productCard.querySelector('.product__item__text h5').innerText.trim();
            const price = parsePrice(priceText);

            const picElem = productCard.querySelector('.product__item__pic');
            let img = picElem.getAttribute('data-setbg') || '';
            if (!img && picElem.style.backgroundImage) {
                img = picElem.style.backgroundImage.replace(/url\(["']?/, '').replace(/["']?\)/, '');
            }

            addToCart({
                name,
                price,
                img,
                quantity: 1
            });
        });
    });

    const detailBtn = document.querySelector('.product__details__cart__option .primary-btn');
    if (detailBtn) {
        detailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const container = detailBtn.closest('.shop__details__text');
            const name = container.querySelector('h4').innerText.trim();
            const priceText = container.querySelector('h3').innerText.trim();
            const price = parsePrice(priceText);

            const qtyInput = container.querySelector('.pro-qty input') || container.querySelector('input');
            const quantity = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;

            const picElem = document.querySelector('.shop__details__pic__item img');
            const img = picElem ? picElem.getAttribute('src') : '';

            addToCart({
                name,
                price,
                img,
                quantity
            });
        });
    }

    const cartTableBody = document.querySelector('.shopping__cart__table tbody');
    if (cartTableBody) {
        renderCartView();
    }
});


function renderCartView() {
    const cart = getCart();
    const tbody = document.querySelector('.shopping__cart__table tbody');
    const subtotalElem = document.querySelector('.cart__total ul li:first-child span');
    const totalElem = document.querySelector('.cart__total ul li:last-child span');

    tbody.innerHTML = '';

    if (cart.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-5">
                    <h5>Tu carrito está vacío.</h5>
                </td>
            </tr>
        `;
        if (subtotalElem) subtotalElem.innerText = '$0';
        if (totalElem) totalElem.innerText = '$0';
        return;
    }

    let overallTotal = 0;

    cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        overallTotal += itemSubtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="product__cart__item">
                <div class="product__cart__item__pic">
                    <img src="${item.img || 'img/shopping-cart/cart-1.jpg'}" width="80" height="80" style="object-fit: cover;" alt="${item.name}">
                </div>
                <div class="product__cart__item__text">
                    <h6>${item.name}</h6>
                    <h5>${formatPrice(item.price)}</h5>
                </div>
            </td>
            <td class="quantity__item">
                <div class="quantity">
                    <div class="pro-qty-2">
                        <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="cart-qty-input" style="width: 60px; text-align: center;">
                    </div>
                </div>
            </td>
            <td class="cart__price">${formatPrice(itemSubtotal)}</td>
            <td class="cart__close">
                <i class="fa fa-close" data-index="${index}" style="cursor: pointer;"></i>
            </td>
        `;
        tbody.appendChild(row);
    });

    if (subtotalElem) subtotalElem.innerText = formatPrice(overallTotal);
    if (totalElem) totalElem.innerText = formatPrice(overallTotal);

    document.querySelectorAll('.cart-qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const idx = e.target.getAttribute('data-index');
            let newQty = parseInt(e.target.value, 10);
            if (isNaN(newQty) || newQty < 1) newQty = 1;

            const currentCart = getCart();
            currentCart[idx].quantity = newQty;
            saveCart(currentCart);
            renderCartView();
        });
    });

    document.querySelectorAll('.cart__close i').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            const currentCart = getCart();
            currentCart.splice(idx, 1);
            saveCart(currentCart);
            renderCartView();
        });
    });
}