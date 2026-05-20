console.log("Wishlist page loaded successfully!");

// =============================
// API BASE URL & GLOBAL STATE
// =============================
const API_BASE = "http://localhost:5000/api";
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// =============================
// ELEMENTS
// =============================

const wishlistContainer =
    document.getElementById(
        "wishlist-container"
    );

const emptyWishlist =
    document.getElementById(
        "empty-wishlist"
    );

// =============================
// RENDER WISHLIST
// =============================
function renderWishlist() {
    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {
        emptyWishlist.style.display = "block";
        return;
    }

    emptyWishlist.style.display = "none";

    wishlist.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("wishlist-card");

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="wishlist-content">
                <span>${product.brand || "Brand"}</span>
                <h4>${product.name}</h4>
                <p class="wishlist-price">₹${product.price}</p>
                <div class="wishlist-buttons">
                    <button class="add-cart-btn" data-index="${index}">Add To Cart</button>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
            </div>
        `;

        // Navigate to product page
        card.addEventListener("click", () => {
            localStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "product.html";
        });

        wishlistContainer.appendChild(card);
    });

    attachWishlistEventListeners();
}

// =============================
// WISHLIST EVENT LISTENERS
// =============================
function attachWishlistEventListeners() {
    document.querySelectorAll(".add-cart-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const index = parseInt(e.target.dataset.index);
            addToCartFromWishlist(index);
        });
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const index = parseInt(e.target.dataset.index);
            removeWishlist(index);
        });
    });
}

// =============================
// =============================
// REMOVE WISHLIST ITEM
// =============================
function removeWishlist(index) {
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlist();

    // Optional: POST to backend for logged-in users
    // fetch(`${API_BASE}/wishlist/remove`, { method: "POST", body: JSON.stringify({ index }) });
}

// =============================
// ADD TO CART FROM WISHLIST
// =============================
function addToCartFromWishlist(index) {
    const product = wishlist[index];

    const item = {
        name: product.name,
        price: parseFloat(product.price),
        img: product.image,
        qty: 1
    };

    const existing = cart.find(p => p.name === item.name);
    if (existing) existing.qty++;
    else cart.push(item);

    localStorage.setItem("cart", JSON.stringify(cart));
    showToast("Added to cart 🛍️");

    // Optional: POST to backend for logged-in users
    // fetch(`${API_BASE}/cart/add`, { method: "POST", body: JSON.stringify(item) });
}

// =============================
// INITIALIZATION
// =============================
document.addEventListener("DOMContentLoaded", () => {
    renderWishlist();
});