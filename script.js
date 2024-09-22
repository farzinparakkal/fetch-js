function loadDatas() {
    fetch('https://dummyjson.com/products')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((parsed_response) => {
            let products = parsed_response.products;
            let dataContainer = document.getElementById("datacontainer");
            let cards = "";

            for (let i = 0; i < products.length; i++) {
                cards += `
                    <div class="card" onclick="handleClick(${products[i].id})">
                        <img src="${products[i].thumbnail}" alt="${products[i].title}">
                        <h3>${products[i].title}</h3>
                        <p>${products[i].description}</p>
                        <div class="price">$${products[i].price}</div>
                    </div>`;
            }
            dataContainer.innerHTML = cards;
        })
        .catch((error) => {
            console.log("error : ", error);
        });
}


function handleClick(id) {
  window.location.href = `dashboard.html?id=${id}`;
}

function loadUserDatas() {
  let location = window.location;
  let querystring = location.search;
  let urlParams = new URLSearchParams(querystring);
  let id = urlParams.get("id");

  let xhr = new XMLHttpRequest();
  xhr.open("get", `https://dummyjson.com/products/${id}`);
  xhr.send();

  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
              let userData = xhr.response;
              let parsed_userData = JSON.parse(userData);

              let dataContainer1 = document.getElementById("details");

              let dcards = `
                  <div class="dcard">
                      <div><img src="${parsed_userData.thumbnail}" alt="${parsed_userData.title}" height="500" width="500"></div>
                      <div class="dtext">
                          <h3>${parsed_userData.title}</h3>
                          <p>Note: ${parsed_userData.description}...</p>
                          <p>Category: ${parsed_userData.category} </p>
                          <div class="price">$${parsed_userData.price}</div><br>
                          <div class="rating">Rating : ${parsed_userData.rating} ⭐</div><br>
                          <div class="rating">Count : ${parsed_userData.stock} left</div><br>
                          <button id="add-to-cart-btn">Add to Cart</button>
                      </div>
                  </div>`;

              dataContainer1.innerHTML = dcards;

              document.getElementById("add-to-cart-btn").addEventListener("click", function() {
                  addToCart(parsed_userData);
              });

              return;
          } else {
              alert("Failed to load response!");
          }
      }
  };
}

function updateCartCount() {
  let cart = getCart();
  let count = cart.reduce((total, item) => total + item.quantity, 0);
  let cartCountElements = document.querySelectorAll('#cart-count');
  cartCountElements.forEach(elem => {
      elem.textContent = count;
  });
}


function getCart() {
  let cart = localStorage.getItem('cart');
  if (cart) {
      return JSON.parse(cart);
  } else {
      return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  let cart = getCart();
 
  let existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
      existingProduct.quantity += 1;
  } else {
      let productToAdd = { ...product, quantity: 1 };
      cart.push(productToAdd);
  }
  saveCart(cart);
  alert("Product added to cart!");
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  loadCart();
}

function loadCart() {
  let cart = getCart();
  let cartContainer = document.getElementById("cart-container");
  let cartSummary = document.getElementById("cart-summary");
  let totalPrice = 0;

  if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartSummary.style.display = "none";
      return;
  }

  cartSummary.style.display = "block";

  let cartItemsHTML = '';

  cart.forEach(item => {
      totalPrice += item.price * item.quantity;
      cartItemsHTML += `
          <div class="cart-item">
              <img src="${item.thumbnail}" alt="${item.title}">
              <div class="cart-item-details">
                  <h3>${item.title}</h3>
                  <p>Price: $${item.price}</p>
                  <p>Quantity: ${item.quantity}</p>
              </div>
              <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
      `;
  });

  cartContainer.innerHTML = cartItemsHTML;
  document.getElementById("total-price").textContent = totalPrice.toFixed(2);
}


function checkout() {
  alert("Proceeding to checkout!");
}


document.addEventListener('DOMContentLoaded', () => {
  let checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
      checkoutBtn.addEventListener('click', checkout);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});
