console.log(
    "Shop page loaded successfully!"
);

// =============================
// API BASE URL
// =============================
const API_BASE = "http://localhost:5000/api";

// =============================
// PRODUCTS ARRAY
// =============================

let allProducts = [];

// =============================
// ELEMENTS
// =============================

const searchInput =
    document.getElementById(
        "search-input"
    );

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );

const sortSelect =
    document.getElementById(
        "sort-select"
    );

const productContainer =
    document.getElementById(
        "product-container"
    );

// =============================
// FETCH PRODUCTS
// =============================
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const data = await response.json();
        if(data.success) {
            allProducts = data.products;
            renderProducts(allProducts);
        }
    } catch(error) {
        console.error(error);
        productContainer.innerHTML = `<h3>Failed to load products.</h3>`;
    }
}

// =============================
// RENDER PRODUCTS (MODULAR)
// =============================
function renderProducts(products) {
    productContainer.innerHTML = "";

    if(products.length === 0) {
        productContainer.innerHTML = `<h3>No products found.</h3>`;
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("pro");
        productCard.dataset.category = product.category || "other";
        productCard.dataset.price = product.price;

        productCard.innerHTML = `
            <img src="${product.image || '../assets/images/f1.jpg'}" alt="${product.name}">
            <div class="des">
                <span>${product.category || 'Brand'}</span>
                <h5>${product.name}</h5>
                <div class="star">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <h4>₹${product.price}</h4>
                <p class="stock-info">${product.stock > 0 ? `Stock: ${product.stock}` : 'Out Of Stock'}</p>
            </div>
            ${product.stock === 0
                ? `<button class="out-stock-btn">Out Of Stock</button>`
                : `<a href="#"><i class="fal fa-shopping-cart cart"></i></a>`}
        `;

        // Redirect to product page
        productCard.addEventListener("click", () => {
            localStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "product.html";
        });

        // Add to cart
        const cartBtn = productCard.querySelector(".cart");
        if(cartBtn) {
            cartBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                const item = {
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price),
                    img: product.image,
                    qty: 1
                };

                const existing = cart.find(p => p.id === item.id);
                if(existing) existing.qty++;
                else cart.push(item);

                localStorage.setItem("cart", JSON.stringify(cart));
                showToast("Added to cart 🛍️");
            });
        }

        productContainer.appendChild(productCard);
    });
}

// =============================
// INITIALIZATION
// =============================
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

// =============================
// SEARCH FILTER
// =============================

searchInput.addEventListener(
    "keyup",
    () => {

        const value =
            searchInput.value
            .toLowerCase();

        const filtered =
            allProducts.filter(
                (product) => {

                    return (
                        product.name
                        .toLowerCase()
                        .includes(value)
                    );

                }
            );

        renderProducts(filtered);

    }
);

// =============================
// CATEGORY FILTER
// =============================

filterButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach((btn) => {

                btn.classList.remove(
                    "active-filter"
                );

            });

            button.classList.add(
                "active-filter"
            );

            const category =
                button.dataset.category;

            if(category === "all"){

                renderProducts(
                    allProducts
                );

                return;

            }

            const filtered =
                allProducts.filter(
                    (product) => {

                        return (
                            product.category
                            .toLowerCase()
                            === category
                        );

                    }
                );

            renderProducts(filtered);

        }
    );

});

// =============================
// SORT PRODUCTS
// =============================

sortSelect.addEventListener(
    "change",
    () => {

        let sortedProducts =
            [...allProducts];

        if(
            sortSelect.value
            === "low-high"
        ){

            sortedProducts.sort(
                (a, b) => {

                    return (
                        a.price - b.price
                    );

                }
            );

        }

        if(
            sortSelect.value
            === "high-low"
        ){

            sortedProducts.sort(
                (a, b) => {

                    return (
                        b.price - a.price
                    );

                }
            );

        }

        renderProducts(
            sortedProducts
        );

    }
);