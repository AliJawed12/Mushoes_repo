"use strict";

// shortcut to grabbing elements by id from dom
const $id = id => document.getElementById(id);


// when window loads automatically add eventlistener
window.onload = function() {
  viewAllListings();


  
  /* Code from cart.js */
  const openButton = document.getElementById("cart-text-button");
  const closeButton = document.getElementById("cart-close-button");
  const cartSideBar = document.getElementById("cart-sidebar");

  openButton.addEventListener("click", () => {
    cartSideBar.classList.add("open");
    document.body.classList.add("no-scroll");
  });

  closeButton.addEventListener("click", () => {
    cartSideBar.classList.remove("open");
    document.body.classList.remove("no-scroll");
  });

   /* Code from cart.js end here*/

}


// method which connects to get '/admin/dashboard/view_deletable_listings' endpoint and displays all listings in the MongoDB database
async function viewAllListings() {

  try {
    const res = await fetch('/admin/dashboard/view_all_listings', {
      method: 'GET'
  });
    const data = await res.json();
    console.log("This is all from the frontend")
    console.log(data);
    showcaseListings(data.listings);
  } catch (err) {
    console.error("Fetch error:", err);
  }

}

// Helper function for viewAllListings, takes listings JSON parameter which has a Array of all listings and data from MongoDB
// this function generates HTML to display
function showcaseListings(listings) {
  const container = document.querySelector('.products-grid');
  let itemsHTML = '';

  const cloudinaryBase = 'https://res.cloudinary.com/dasqssuki/image/upload/';

  listings.forEach(product => {
    const imgSrc = product.images?.[0]
      ? (product.images[0].startsWith('http') ? product.images[0] : cloudinaryBase + product.images[0])
      : 'images/placeholder.png';

      /* For now the class in itemsHTML: add_to_cart on click opens stripe, but later can add to actual button title buy now when data starts to get stroed in cart*/

    itemsHTML += `
      <div class="item-listing add_to_cart" data-id="${product._id}">
        <div class="item-listing-image" data-image="${imgSrc}">
          <img src="${imgSrc}" alt="${product.name}">
        </div>

        <div class="item-listing-description">
          <div class="item-description-details">
            <div class="item-listing-des-brand" data-brand="${product.brand}">${product.brand}</div>
            <div class="item-listing-des-name" data-name="${product.name}">${product.name}</div>
            <div class="item-listing-des-price" data-price="${product.price}">$${(product.price/100).toFixed(2)} USD</div>
            <div class="item-listing-des-size" data-size="${product.size}">Size: ${product.size || 'N/A'}</div>
            <div class="item-listing-des-gender" data-gender="${product.gender}">Gender: ${product.gender || 'N/A'}</div>
            <div class="item-listing-des-condition">Condition: ${product.condition || 'N/A'}</div>
            <div class="item-listing-des-stock" data-stock="${product.stock}">Stock: ${product.stock || 'N/A'}</div>
          </div>

          <div class="item-color-description">${product.color.join(', ')}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = itemsHTML;
}

// add on click add to cart functionality to page
function addToCartFunctionality() {
  document.querySelectorAll(".add_to_cart").forEach(listing => {
    listing.addEventListener("click", () => {

      const productId = listing.dataset.id;

      if(!productId) return;

      console.log(`Product Id: ${productId}`);

      if (confirm("Do you want to add this shoe to your cart?")) {

        /*

         // Get existing cart from localStorage, or start empty
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Add product ID only if it's not already in the cart
        if (!cart.includes(productId)) {
          cart.push(productId);
          localStorage.setItem("cart", JSON.stringify(cart));
          alert("Added to cart!");
        } else {
          alert("This product is already in your cart!");
        }

        console.log("Current cart:", cart); // For debugging

        */
        

        alert("Added to cart!");
      }
      

    });
  });
}


