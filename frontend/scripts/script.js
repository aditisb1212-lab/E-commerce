// =============================
// API BASE URL & GLOBAL STATE
// =============================
const API_BASE = "http://localhost:5000/api";
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let viewed = JSON.parse(localStorage.getItem("viewed")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// =============================
// HELPER: CREATE PRODUCT CARD
// =============================
function createProductCard(product) {
    const card = document.createElement("div");
    card.classList.add("pro");
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="des">
            <span>${product.brand || "Brand"}</span>
            <h5>${product.name}</h5>
            <div class="star">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </div>
            <h4>₹${product.price}</h4>
        </div>
        <button class="cart">Add to Cart</button>
        <span class="wishlist-heart">❤</span>
    `;

    // Navigate to product page
    card.addEventListener("click", () => {
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "product.html";
    });

    // Add to cart button
    card.querySelector(".cart").addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(product);
    });

    // Wishlist toggle
    card.querySelector(".wishlist-heart").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleWishlist(product, e.target);
    });

    return card;
}

// =============================
// MOBILE NAVBAR
// =============================
const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");

if (bar) {
    bar.addEventListener("click", () => {
        nav.classList.toggle("active");
        nav.style.right = nav.style.right === "0px" ? "-300px" : "0px";
    });
}

// =============================
// STICKY HEADER EFFECT
// =============================
window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
        if (window.scrollY > 80) {
            header.style.boxShadow = "0 5px 25px rgba(0,0,0,0.15)";
        } else {
        header.style.boxShadow = "none";
    }
});

// =============================
// TOAST MESSAGE
// =============================
function showToast(msg) {
    const toast = document.createElement("div");
    toast.innerText = msg;
    toast.style.cssText = `     position:fixed;
        bottom:20px;
        right:20px;
        background:#088178;
        color:#fff;
        padding:12px 18px;
        border-radius:6px;
        font-size:14px;
        z-index:9999;
        opacity:0;
        transition:0.4s;
    `;
    document.body.appendChild(toast);
    setTimeout(() => (toast.style.opacity = "1"), 100);
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 400);
    }, 2000);
}

// =============================
// ADD TO CART
// =============================
function addToCart(product) {
    const item = {
        name: product.name,
        price: product.price,
        img: product.image,
        qty: 1
    };

    const existing = cart.find(p => p.name === product.name);
    if (existing) existing.qty++;
    else cart.push(item);

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showToast("Added to Cart 🛍️");

    // Optional: POST to backend for logged-in users
    // fetch(`${API_BASE}/cart/add`, { method: "POST", body: JSON.stringify(item) });
}

// =============================
// WISHLIST TOGGLE
// =============================
function toggleWishlist(product, heartEl) {
    if (wishlist.find(p => p.name === product.name)) {
        wishlist = wishlist.filter(p => p.name !== product.name);
        heartEl.style.color = "white";
        showToast("Removed from Wishlist ❌");
    } else {
        wishlist.push(product);
        heartEl.style.color = "red";
        showToast("Added to Wishlist ❤️");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    // Optional: POST to backend for logged-in users
    // fetch(`${API_BASE}/wishlist/toggle`, { method: "POST", body: JSON.stringify(product) });
}

// =============================
// CART COUNT BADGE
// =============================
function updateCartCount() {
    let total = cart.reduce((sum, item) => sum + item.qty, 0);

    let badge = document.getElementById("cart-count");
    if (!badge) {
        badge = document.createElement("span");
        badge.id = "cart-count";
        badge.style.cssText = `       position:absolute;
            top:-8px;
            right:-10px;
            background:red;
            color:white;
            font-size:12px;
            padding:2px 6px;
            border-radius:50%;
        `;
        const cartIcon = document.querySelector(".fa-shopping-bag")?.parentElement;
        if (cartIcon) cartIcon.appendChild(badge);
    }   

    badge.innerText = total;
}

updateCartCount();

// =============================
// PRODUCT QUICK VIEW
// =============================
document
.querySelectorAll(".pro img")
.forEach((img) => {

    img.addEventListener(
        "click",
        () => {

            const modal =
                document.createElement(
                    "div"
                );

            modal.style.cssText = `
                position:fixed;
                inset:0;
                background:rgba(0,0,0,0.7);
                display:flex;
                align-items:center;
                justify-content:center;
                z-index:9999;
            `;

            const box =
                document.createElement(
                    "div"
                );

            box.style.cssText = `
                background:white;
                padding:20px;
                border-radius:10px;
                text-align:center;
            `;

            const big =
                document.createElement(
                    "img"
                );

            big.src = img.src;

            big.style.width =
                "300px";

            box.appendChild(big);

            modal.appendChild(box);

            document.body.appendChild(
                modal
            );

            modal.onclick = () => {

                modal.remove();

            };

        }
    );

});

// =============================
// NEWSLETTER VALIDATION
// =============================
const newsletterBtn = document.querySelector("#newsletter button");
if (newsletterBtn) {
newsletterBtn.addEventListener("click", () => {
const input = document.querySelector("#newsletter input");
const email = input.value.trim();

```
if (!email.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/)) {
  showToast("Enter valid email ❌");
} else {
  showToast("Subscribed Successfully 🎉");
  input.value = "";
}
```

});
}

// =============================
// SCROLL ANIMATION
// =============================
const observer = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.style.transform = "translateY(0)";
entry.target.style.opacity = "1";
}
});
},
{ threshold: 0.1 }
);

document.querySelectorAll(".pro, .fe-box, .banner-box").forEach((el) => {
el.style.transform = "translateY(40px)";
el.style.opacity = "0";
el.style.transition = "0.6s ease";
observer.observe(el);
});

// =============================
// BUTTON RIPPLE EFFECT
// =============================
document.querySelectorAll("button").forEach((btn) => {
btn.addEventListener("click", function (e) {
const ripple = document.createElement("span");
ripple.style.cssText = `       position:absolute;
      width:10px;height:10px;
      background:white;
      border-radius:50%;
      transform:scale(0);
      animation:ripple 0.6s linear;
      top:${e.offsetY}px;
      left:${e.offsetX}px;
    `;
this.style.position = "relative";
this.appendChild(ripple);
setTimeout(() => ripple.remove(), 600);
});
});

// =============================
// RECENTLY VIEWED PRODUCTS
// =============================
document.querySelectorAll(".pro").forEach((card) => {
card.addEventListener("click", () => {
const name = card.querySelector("h5").innerText;
viewed.unshift(name);
viewed = [...new Set(viewed)].slice(0, 5);
localStorage.setItem("viewed", JSON.stringify(viewed));
});
});

// =============================
// FAKE CHECKOUT
// =============================
window.checkout = function () {
if (cart.length === 0) return showToast("Cart Empty ❌");

showToast("Processing Payment...");
setTimeout(() => {
cart = [];
localStorage.removeItem("cart");
updateCartCount();
showToast("Order Placed Successfully 🎉");
}, 1500);
};

// =============================
// ❤️ WISHLIST SYSTEM
// =============================
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

document.querySelectorAll(".pro").forEach((card) => {
const heart = document.createElement("span");
heart.innerHTML = "❤";
heart.style.cssText = `   position:absolute;
  top:10px;
  left:10px;
  color:white;
  font-size:20px;
  cursor:pointer;
  text-shadow:0 0 5px black;
  `;
card.appendChild(heart);

heart.onclick = (e) => {
e.stopPropagation();
const name = card.querySelector("h5").innerText;

```
if (wishlist.includes(name)) {
  wishlist = wishlist.filter(p => p !== name);
  heart.style.color = "white";
} else {
  wishlist.push(name);
  heart.style.color = "red";
}

localStorage.setItem("wishlist", JSON.stringify(wishlist));
```

};
});

// =============================
// ESTIMATED DELIVERY DATE
// =============================
function deliveryDate() {
const date = new Date();
date.setDate(date.getDate() + Math.floor(Math.random() * 5 + 3));
return date.toDateString();
}

document.querySelectorAll(".pro").forEach(card => {
const d = document.createElement("p");
d.style.fontSize = "11px";
d.style.color = "gray";
d.innerText = "Delivery by: " + deliveryDate();
card.appendChild(d);
});

// =============================
// AUTO HERO TEXT SLIDER
// =============================
const heroTexts = [
"Super Deals Today 🔥",
"Limited Time Offer ⏰",
"New Collection Arrived 👕",
"Flat 70% OFF 💸"
];

let i = 0;
setInterval(() => {
const hero = document.querySelector("#hero h2");
if(hero){
hero.innerText = heroTexts[i];
i = (i + 1) % heroTexts.length;
}
}, 2500);

// =============================
// HIGHLIGHT NEW PRODUCTS
// =============================
document.querySelectorAll(".pro").forEach((card, index) => {
if(index < 2){
const tag = document.createElement("span");
tag.innerText = "NEW";
tag.style.cssText = `     position:absolute;
    top:10px;
    right:10px;
    background:red;
    color:white;
    padding:3px 6px;
    font-size:10px;
    border-radius:4px;
    `;
card.appendChild(tag);
}
});

console.log("🚀 Extra features loaded successfully!");

// =============================
// IMAGE HOVER ZOOM
// =============================
document.querySelectorAll(".pro img").forEach(img=>{
img.style.transition="0.3s";
img.addEventListener("mousemove",(e)=>{
img.style.transform="scale(1.2)";
});
img.addEventListener("mouseleave",()=>{
img.style.transform="scale(1)";
});
});

// =============================
// QUANTITY BUTTONS (ON PRODUCT CLICK)
// =============================
document.querySelectorAll(".pro").forEach(card=>{
const qtyBox = document.createElement("div");
qtyBox.style.marginTop="8px";

const minus=document.createElement("button");
const plus=document.createElement("button");
const count=document.createElement("span");

minus.innerText="-";
plus.innerText="+";
count.innerText="1";

[minus,plus].forEach((b)=>{

    b.style.cssText = `
        width:36px;
        height:36px;
        border:none;
        border-radius:8px;
        background:#f3f3f3;
        font-size:18px;
        cursor:pointer;
        transition:0.3s ease;
    `;

});

minus.onclick=()=>{ if(count.innerText>1) count.innerText--; };
plus.onclick=()=>{ count.innerText++; };

qtyBox.append(minus,count,plus);
card.appendChild(qtyBox);
});

// =============================
// COMPARE PRODUCTS
// =============================
let compare=[];

document.querySelectorAll(".pro").forEach(card=>{
const btn=document.createElement("button");
btn.innerHTML = `
    <i class="fas fa-balance-scale"></i>
    Compare
`;
btn.style.marginTop="6px";
card.appendChild(btn);

btn.onclick=(e)=>{
e.stopPropagation();
const name=card.querySelector("h5").innerText;

```
if(compare.includes(name)){
  compare=compare.filter(p=>p!==name);
  showToast("Removed from Compare");
}else{
  if(compare.length>=3) return showToast("Max 3 items");
  compare.push(name);
  showToast("Added to Compare");
}
```

};
});

// =============================
// RECENTLY VIEWED SECTION UI
// =============================
const viewedBox=document.createElement("div");
viewedBox.style.cssText="padding:40px;background:#f5f5f5";
viewedBox.innerHTML="<h2>Recently Viewed</h2><div id='recent'></div>";
document.body.appendChild(viewedBox);

function renderViewed(){
const rec=document.getElementById("recent");
if(!rec) return;
rec.innerHTML="";
viewed.forEach(v=>{
const p=document.createElement("p");
p.innerText=v;
rec.appendChild(p);
});
}
renderViewed();

// =============================
// FAKE PAYMENT MODAL
// =============================
window.openPayment=function(){
const modal=document.createElement("div");
modal.style.cssText=`
  position:fixed;inset:0;background:rgba(0,0,0,.7);
  display:flex;align-items:center;justify-content:center;z-index:9999`;

const box=document.createElement("div");
box.style.cssText="background:white;padding:20px;border-radius:10px;text-align:center";

box.innerHTML=`

  <h2>Secure Payment</h2>
  <input placeholder="Card Number"><br><br>
  <input placeholder="MM/YY"><br><br>
  <input placeholder="CVV"><br><br>
  <button id="payNow">Pay Now</button>
  `;

modal.appendChild(box);
document.body.appendChild(modal);

document.getElementById("payNow").onclick=()=>{
modal.remove();
showToast("Payment Successful 🎉");
};

modal.onclick=e=>{if(e.target===modal)modal.remove();}
};

// =============================
// LAZY IMAGE LOADING (PERFORMANCE)
// =============================
const lazyImgs=document.querySelectorAll("img");

const lazyObserver=new IntersectionObserver((entries)=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
const img=entry.target;
img.src=img.src;
lazyObserver.unobserve(img);
}
});
});

lazyImgs.forEach(img=>lazyObserver.observe(img));

console.log("🧠 Advanced ecommerce features loaded!");
// =======================================================
// 🚀 ULTRA FINAL ECOMMERCE ENGINE
// =======================================================


// =============================
// CART DRAWER SYSTEM
// =============================
const cartDrawer = document.createElement("div");
cartDrawer.style.cssText = `
position:fixed;
top:0;
right:-400px;
width:350px;
height:100vh;
background:white;
box-shadow:-5px 0 20px rgba(0,0,0,.2);
padding:20px;
overflow-y:auto;
transition:0.4s;
z-index:99999;
`;
document.body.appendChild(cartDrawer);

function renderCartDrawer() {
  cartDrawer.innerHTML = "<h2>Your Cart</h2>";
  
  if(cart.length === 0){
    cartDrawer.innerHTML += "<p>Cart is Empty</p>";
    return;
  }

  let subtotal = 0;

  cart.forEach((item, index)=>{
    const price = parseInt(item.price.replace(/\D/g,""));
    subtotal += price * item.qty;

    const div = document.createElement("div");
    div.style.marginBottom="15px";
    div.innerHTML = `
      <strong>${item.name}</strong><br>
      ₹${price} x ${item.qty}
      <button onclick="removeItem(${index})">Remove</button>
    `;
    cartDrawer.appendChild(div);
  });

  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  cartDrawer.innerHTML += `
    <hr>
    <p>Subtotal: ₹${subtotal}</p>
    <p>Tax (18%): ₹${tax.toFixed(2)}</p>
    <h3>Total: ₹${total.toFixed(2)}</h3>

    <input
      type="text"
      id="coupon-code"
      placeholder="Enter Coupon Code"
      style="
        width:100%;
        padding:10px;
        margin:10px 0;
        border:1px solid #ccc;
        border-radius:6px;
      "
    >

    <button onclick="applyCoupon()">
      Apply Coupon
    </button>

    <button onclick="placeOrder()">
      Checkout
    </button>

    <button onclick="clearCart()">
      Clear Cart
    </button>
  `;
}

function applyCoupon(){

    const input =
        document.getElementById(
            "coupon-code"
        );

    if(!input) return;

    const code =
        input.value.trim();

    if(code === "MOHIT50"){

        showToast(
            "50% Discount Applied 🎉"
        );

    }else if(
        code === "WELCOME10"
    ){

        showToast(
            "10% Discount Applied 🎉"
        );

    }else{

        showToast(
            "Invalid Coupon ❌"
        );

    }

}

function openCart(){
  renderCartDrawer();
  cartDrawer.style.right="0";
}
function closeCart(){
  cartDrawer.style.right="-400px";
}
document.querySelector(".fa-shopping-bag")?.parentElement.addEventListener("click",(e)=>{
  e.preventDefault();
  openCart();
});
cartDrawer.addEventListener("mouseleave",closeCart);

function removeItem(index){
  cart.splice(index,1);
  localStorage.setItem("cart",JSON.stringify(cart));
  renderCartDrawer();
  updateCartCount();
}
function clearCart(){
  cart=[];
  localStorage.removeItem("cart");
  renderCartDrawer();
  updateCartCount();
}


// =============================
// ORDER HISTORY + INVOICE
// =============================
let orders = JSON.parse(localStorage.getItem("orders")) || [];

function placeOrder(){
  if(cart.length===0) return showToast("Cart Empty");

  const order={
    id:"ORD"+Date.now(),
    items:cart,
    date:new Date().toLocaleString()
  };

  orders.push(order);
  localStorage.setItem("orders",JSON.stringify(orders));

  generateInvoice(order);

  cart=[];
  localStorage.removeItem("cart");
  updateCartCount();
  closeCart();
}

function generateInvoice(order){
  const invoice=document.createElement("div");
  invoice.style.cssText="position:fixed;inset:0;background:white;padding:30px;overflow:auto;z-index:999999";

  let html=`<h1>Invoice</h1><p>Order ID: ${order.id}</p><p>Date: ${order.date}</p><hr>`;
  order.items.forEach(i=>{
    html+=`<p>${i.name} - ${i.price} x ${i.qty}</p>`;
  });
  html+="<hr><button onclick='this.parentElement.remove()'>Close</button>";

  invoice.innerHTML=html;
  document.body.appendChild(invoice);
}


// =============================
// CLICKABLE STAR RATING
// =============================
document.querySelectorAll(".star").forEach(starContainer=>{
  const stars=starContainer.querySelectorAll("i");
  stars.forEach((star,index)=>{
    star.style.cursor="pointer";
    star.onclick=()=>{
      stars.forEach((s,i)=>{
        s.style.color = i<=index ? "gold" : "#ccc";
      });
    };
  });
});


// =============================
// PRODUCT REVIEWS
// =============================
document.querySelectorAll(".pro").forEach(card=>{
  const reviewBtn=document.createElement("button");
  reviewBtn.innerHTML = `
      <i class="fas fa-star"></i>
      Add Review
  `;
  card.appendChild(reviewBtn);

  reviewBtn.onclick=(e)=>{
    e.stopPropagation();
    const text=prompt("Write your review");
    if(!text) return;

    const p=document.createElement("p");
    p.innerText="📝 "+text;
    p.style.fontSize="12px";
    card.appendChild(p);
  };
});


// =============================
// SALE COUNTDOWN TIMER
// =============================
const countdown=document.createElement("div");
countdown.style.cssText="position:fixed;top:10px;left:10px;background:red;color:white;padding:8px 12px;border-radius:6px;z-index:9999";
document.body.appendChild(countdown);

let saleTime=3600;
setInterval(()=>{
  saleTime--;
  const m=Math.floor(saleTime/60);
  const s=saleTime%60;
  countdown.innerText=`Sale Ends In ${m}:${s<10?"0"+s:s}`;
},1000);


// =============================
// STOCK SYSTEM
// =============================
document.querySelectorAll(".pro").forEach(card=>{
  let stock=Math.floor(Math.random()*10+1);
  const stockTag=document.createElement("p");
  stockTag.style.color="red";
  stockTag.innerText="Stock Left: "+stock;
  card.appendChild(stockTag);

  const cartButton =
      card.querySelector(".cart");

  if(cartButton){

      cartButton.onclick = (e) => {

          e.preventDefault();

          if(stock <= 0){

              return showToast(
                  "Out of Stock ❌"
              );

          }

          stock--;

          stockTag.innerText =
              "Stock Left: " + stock;

      };

  }
});


// =============================
// USER ANALYTICS LOG
// =============================
document.addEventListener("click",(e)=>{
  console.log("User Clicked:",e.target.tagName);
});

// =============================
// SESSION TIMER
// =============================
let sessionTime=0;
setInterval(()=>{ sessionTime++; },1000);


// =============================
// PAGE VISIT COUNTER
// =============================
let visits=parseInt(localStorage.getItem("visits")||0);
visits++;
localStorage.setItem("visits",visits);
console.log("Total Visits:",visits);

// =============================
// FPS PERFORMANCE TRACKER
// =============================
let lastTime=performance.now();
function trackFPS(){
  const now=performance.now();
  const fps=Math.round(1000/(now-lastTime));
  lastTime=now;
  requestAnimationFrame(trackFPS);
}
trackFPS();

console.log("🔥 ULTRA FINAL SYSTEM LOADED SUCCESSFULLY 🔥");

// =============================
// RECENTLY VIEWED PRODUCTS
// =============================

const recentlyViewedContainer =
    document.getElementById(
        "recently-viewed-container"
    );

if(recentlyViewedContainer){
    const recentlyViewed =
        JSON.parse(
            localStorage.getItem(
                "recentlyViewed"
            )
        ) || [];

    if(recentlyViewed.length === 0){
        recentlyViewedContainer.innerHTML = `
            <p>
                No recently viewed products yet.
            </p>
        `;

    }else{
        recentlyViewed.forEach((product) => {
            const card =
                document.createElement("div");
            card.classList.add("pro");

            card.innerHTML = `
                <img
                    src="${product.image}"
                    alt="${product.name}"
                >
                <div class="des">
                    <span>
                        ${product.brand}
                    </span>
                    <h5>
                        ${product.name}
                    </h5>
                    <h4>
                        ₹${product.price}
                    </h4>
                </div>
            `;

            card.addEventListener(
                "click",
                () => {
                    localStorage.setItem(
                        "selectedProduct",
                        JSON.stringify(product)
                    );
                    window.location.href =
                        "product.html";
                }
            );
            recentlyViewedContainer
            .appendChild(card);
        });
    }
}

// =============================
// FEATURED PRODUCTS (Backend Integration)
// =============================
const featuredProductsContainer = document.getElementById("featured-products");

async function renderFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE}/products?featured=true`);
        const data = await response.json();
        if (!data.success) throw new Error("Failed to fetch featured products");

        featuredProductsContainer.innerHTML = "";

        data.products.forEach(product => {
            const card = createProductCard(product);
            featuredProductsContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading featured products:", error);
        featuredProductsContainer.innerHTML = "<p>Unable to load featured products.</p>";
    }
}

if(featuredContainer){

    const adminProducts =
        JSON.parse(
            localStorage.getItem(
                "adminProducts"
            )
        ) || [];

    const featuredProducts =
        adminProducts.filter(
            (product) =>
                product.featured === true
        );

    if(featuredProducts.length === 0){

        featuredContainer.innerHTML = `
            <p>
                No featured products available.
            </p>
        `;

    }else{

        featuredProducts.forEach((product) => {

            const card =
                document.createElement("div");

            card.classList.add("pro");

            card.innerHTML = `
                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="des">

                    <span>
                        ${product.brand}
                    </span>

                    <h5>
                        ${product.name}
                    </h5>

                    <div class="star">

                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>

                    </div>

                    <h4>
                        ₹${product.price}
                    </h4>

                </div>
            `;

            card.addEventListener(
                "click",
                () => {

                    localStorage.setItem(
                        "selectedProduct",
                        JSON.stringify(product)
                    );

                    window.location.href =
                        "product.html";

                }
            );

            featuredContainer.appendChild(
                card
            );

        });

    }

}

// =============================
// SEARCH PRODUCTS
// =============================

const productSearch =
    document.getElementById(
        "product-search"
    );

if(productSearch){

    productSearch.addEventListener(
        "keyup",
        () => {

            const value =
                productSearch.value
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

}

// =============================
// SORT PRODUCTS
// =============================

const productSort =
    document.getElementById(
        "product-sort"
    );

if(productSort){

    productSort.addEventListener(
        "change",
        () => {

            let sorted =
                [...allProducts];

            if(
                productSort.value
                === "low-high"
            ){

                sorted.sort(
                    (a, b) =>
                        a.price - b.price
                );

            }

            if(
                productSort.value
                === "high-low"
            ){

                sorted.sort(
                    (a, b) =>
                        b.price - a.price
                );

            }

            renderProducts(sorted);

        }
    );

}