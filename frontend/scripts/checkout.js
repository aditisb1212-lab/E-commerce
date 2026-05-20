console.log("Checkout page loaded successfully!");

// =============================
// LOAD CART
// =============================
const API_BASE = "http://localhost:5000/api";
const cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

if(cart.length === 0){
    showToast("Your cart is empty!", "error");
    window.location.href = "cart.html";
}

const checkoutItems =
    document.getElementById(
        "checkout-items"
    );

const subtotalElement =
    document.getElementById(
        "checkout-subtotal"
    );

const taxElement =
    document.getElementById(
        "checkout-tax"
    );

const totalElement =
    document.getElementById(
        "checkout-total"
    );

// =============================
// RENDER SUMMARY
// =============================

function renderCheckout(){

    checkoutItems.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item) => {

        const price =
            parseInt(
                item.price.replace(/\D/g, "")
            );

        subtotal +=
            price * item.qty;

        const div =
            document.createElement("div");

        div.classList.add(
            "checkout-item"
        );

        div.innerHTML = `
            <span>
                ${item.name}
                (${item.qty})
            </span>

            <span>
                ₹${price * item.qty}
            </span>
        `;

        checkoutItems.appendChild(div);

    });

    const tax =
        subtotal * 0.18;

    const total =
        subtotal + tax;

    subtotalElement.innerText =
        `₹${subtotal}`;

    taxElement.innerText =
        `₹${tax.toFixed(2)}`;

    totalElement.innerText =
        `₹${total.toFixed(2)}`;

}

renderCheckout();

// =============================
// PAYMENT METHOD TOGGLE
// =============================

const paymentMethods =
    document.querySelectorAll(
        'input[name="payment"]'
    );

const cardDetails =
    document.getElementById(
        "card-details"
    );

paymentMethods.forEach((method) => {

    method.addEventListener(
        "change",
        () => {

            if(method.value === "Card"){

                cardDetails.style.display =
                    "block";

            }else{

                cardDetails.style.display =
                    "none";

            }

        }
    );

});

// =============================
// PLACE ORDER
// =============================

const checkoutForm =
    document.getElementById(
        "checkout-form"
    );

checkoutForm.addEventListener(
    "submit",
    (e) => {

        e.preventDefault();

        if(cart.length === 0){
            showToast("Your cart is empty!", "error");
            return;
        }

        const orders =
            JSON.parse(
                localStorage.getItem(
                    "orders"
                )
            ) || [];

        const order = {

            id:
                "ORD-" +
                Date.now(),

            date:
                new Date()
                .toLocaleString(),

            status:
                "Pending",

            customer: {
            
                name:
                    document.getElementById(
                        "full-name"
                    ).value,
                
                email:
                    document.getElementById(
                        "email"
                    ).value,
                
                phone:
                    document.getElementById(
                        "phone"
                    ).value
                
            },
        
            address: {
            
                city:
                    document.getElementById(
                        "city"
                    ).value,
                
                state:
                    document.getElementById(
                        "state"
                    ).value,
                
                zip:
                    document.getElementById(
                        "zip"
                    ).value,
                
                fullAddress:
                    document.getElementById(
                        "address"
                    ).value
                
            },
        
            paymentMethod:
                document.querySelector(
                    'input[name="payment"]:checked'
                ).value,
            
            items:
                cart,
                        
            total:
                total.toFixed(2)
            
        };

        orders.push(order);

        localStorage.setItem(
            "orders",
            JSON.stringify(orders)
        );

        // =============================
        // REDUCE PRODUCT STOCK
        // =============================
            
        let adminProducts =
            JSON.parse(
                localStorage.getItem(
                    "adminProducts"
                )
            ) || [];
        
        cart.forEach((cartItem) => {
        
            const product =
                adminProducts.find(
                    (item) =>
                        item.name ===
                        cartItem.name
                );
            
            if(product){
            
                product.stock -=
                    cartItem.qty;
            
                if(product.stock < 0){
                
                    product.stock = 0;
                
                }
            
            }
        
        });
        
        localStorage.setItem(
            "adminProducts",
            JSON.stringify(adminProducts)
        );

        localStorage.removeItem(
            "cart"
        );

        showToast("Order placed successfully! 🎉");

        // Optional: POST order to backend for logged-in users
        // fetch(`${API_BASE}/orders`, { method: "POST", body: JSON.stringify(order) });

        window.location.href = "order.html";
            }
);