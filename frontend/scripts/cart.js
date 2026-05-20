console.log("Cart page loaded successfully!");

// =============================
// CART DATA
// =============================

// =============================
// API BASE URL & GLOBAL STATE
// =============================
const API_BASE = "http://localhost:5000/api";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer =
    document.getElementById("cart-items");

const subtotalElement =
    document.getElementById("subtotal");

const taxElement =
    document.getElementById("tax");

const totalElement =
    document.getElementById("total");

// =============================
// RENDER CART (Backend Integration)
// =============================
async function renderCart() {
    cartContainer.innerHTML = "";

    if(cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add products to continue shopping.</p>
                <a href="shop.html" class="continue-shopping-btn">Continue Shopping</a>
            </div>
        `;
        subtotalElement.innerText = "₹0";
        taxElement.innerText = "₹0";
        totalElement.innerText = "₹0";
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        const price = parseFloat(item.price);
        subtotal += price * item.qty;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Price: ₹${price}</p>
                <div class="cart-qty-controls">
                    <button data-index="${index}" class="decrease-qty">-</button>
                    <span>${item.qty}</span>
                    <button data-index="${index}" class="increase-qty">+</button>
                </div>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
    });

    const tax = subtotal * 0.18;
    const shippingCost = parseInt(localStorage.getItem("shippingCost") || 0);
    const total = subtotal + tax + shippingCost;

    subtotalElement.innerText = `₹${subtotal}`;
    taxElement.innerText = `₹${tax.toFixed(2)}`;
    document.getElementById("checkout-shipping").innerText =
        shippingCost === 0 ? "Free" : `₹${shippingCost}`;
    totalElement.innerText = `₹${total.toFixed(2)}`;

    attachCartEventListeners();
}

// =============================
// CART EVENT LISTENERS
// =============================
function attachCartEventListeners() {
    document.querySelectorAll(".increase-qty").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            cart[index].qty++;
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        });
    });

    document.querySelectorAll(".decrease-qty").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            if(cart[index].qty > 1) cart[index].qty--;
            else cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        });
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        });
    });
}

// =============================
// REMOVE ITEM
// =============================
function removeItem(index){
    cart.splice(index, 1);
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
    renderCart();
}

// =============================
// QUANTITY CONTROLS
// =============================
function increaseQty(index){
    cart[index].qty++;
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
    renderCart();
}

function decreaseQty(index){
    if(cart[index].qty > 1){
        cart[index].qty--;
    }else{
        cart.splice(index, 1);
    }
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
    renderCart();
}

// =============================
// CHECKOUT
// =============================
checkoutBtn.addEventListener("click", async () => {
    if(cart.length === 0) {
        showToast("Cart is empty!", "error");
        return;
    }

    // Optional: Store shipping
    localStorage.setItem("shippingCost", 0);

    // Optionally: POST cart to backend for logged-in users
    // await fetch(`${API_BASE}/cart/checkout`, { method: "POST", body: JSON.stringify(cart) });

    window.location.href = "checkout.html";
});

// =============================
// INITIALIZATION
// =============================
document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});