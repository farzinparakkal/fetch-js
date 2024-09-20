// Function to load product data on index.html
function loadDatas() {
  fetch('https://fakestoreapi.com/products')
      .then((response) => {
          return response.json();
      })
      .then((parsed_response) => {
          let dataContainer = document.getElementById("datacontainer");
          let cards = "";

          for (let i = 0; i < parsed_response.length; i++) {
              cards += `
                  <div class="card" onclick="handleClick(${parsed_response[i].id})">
                      <img src="${parsed_response[i].image}" alt="${parsed_response[i].title}">
                      <h3>${parsed_response[i].title}</h3>
                      <p>${parsed_response[i].description.substring(0, 30)}...</p>
                      <div class="price">$${parsed_response[i].price}</div>
                  </div>`;
          }

          dataContainer.innerHTML = cards;
      })
      .catch((error) => {
          console.log("error : ", error);
      });
}

// Function to handle clicking on a product card
function handleClick(id) {
  window.location.href = `dashboard.html?id=${id}`;
}

// Function to load product details on dashboard.html
function loadUserDatas() {
  let location = window.location;
  let querystring = location.search;
  let urlParams = new URLSearchParams(querystring);
  let id = urlParams.get("id");

  let xhr = new XMLHttpRequest();
  xhr.open("get", `https://fakestoreapi.com/products/${id}`);
  xhr.send();

  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
              let userData = xhr.response;
              let parsed_userData = JSON.parse(userData);

              let dataContainer1 = document.getElementById("details");

              let dcards = `
                  <div class="dcard">
                      <img src="${parsed_userData.image}" alt="${parsed_userData.title}" height="500" width="500">
                      <div class="dtext">
                          <h3>${parsed_userData.title}</h3>
                          <p>Note: ${parsed_userData.description}...</p>
                          <p>Category: ${parsed_userData.category} </p>
                          <div class="price">$${parsed_userData.price}</div><br>
                          <div class="rating">Rating : ${parsed_userData.rating.rate} ⭐</div><br>
                          <div class="rating">Count : ${parsed_userData.rating.count}....</div>
                          <button id="add-to-cart-btn">Add to Cart</button>
                      </div>
                  </div>`;

              dataContainer1.innerHTML = dcards;

              // Attach event listener to the "Add to Cart" button
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

// Function to update cart count in navigation
function updateCartCount() {
  let cart = getCart();
  let count = cart.reduce((total, item) => total + item.quantity, 0);
  let cartCountElements = document.querySelectorAll('#cart-count');
  cartCountElements.forEach(elem => {
      elem.textContent = count;
  });
}

// Function to get cart from localStorage
function getCart() {
  let cart = localStorage.getItem('cart');
  if (cart) {
      return JSON.parse(cart);
  } else {
      return [];
  }
}

// Function to save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Function to add item to cart
function addToCart(product) {
  let cart = getCart();
  // Check if product already exists in cart
  let existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
      existingProduct.quantity += 1;
  } else {
      // Clone the product object to avoid mutating original data
      let productToAdd = { ...product, quantity: 1 };
      cart.push(productToAdd);
  }
  saveCart(cart);
  alert("Product added to cart!");
}

// Function to remove item from cart
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  loadCart();
}

// Function to load cart and display in cart.html
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
              <img src="${item.image}" alt="${item.title}">
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

// Function to handle checkout (placeholder)
function checkout() {
  alert("Proceeding to checkout!");
  // Implement checkout functionality here
}

// Event listener for checkout button
document.addEventListener('DOMContentLoaded', () => {
  let checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
      checkoutBtn.addEventListener('click', checkout);
  }
});

// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});
