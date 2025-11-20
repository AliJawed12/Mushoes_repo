window.addEventListener("load", function() {
  getProductID();
});


// method to grab the id from the url
function getProductID() {
  // grab full url
  const url = new URLSearchParams(window.location.search);
  const id = url.get("id");
  
  // call getProductDetails and parse in the shoe id
  getProductDetails(id)
}

// fetch all data associated with that specific listing
async function getProductDetails(mongoID) {
  try {

    const res = await fetch("/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mongoID: mongoID }),
    });

    const data = await res.json();
    console.log(data.message);
    console.log(data.listing);
    
    // call to displayProductDetails to showcase lising details
    displayProductDetails(data.listing);

  }
  catch (err) {
    console.error(err);
    console.log("Error finding a listing: (product.js: getProductDetails(mongoID))")

  }
}

// method to display all the data for a listing, takes json parameter
function displayProductDetails(productDetails) {

  const cloudinaryBase = 'https://res.cloudinary.com/dasqssuki/image/upload/';

  const imagesHTML = productDetails.images
  .map(img => {
    const src = img.startsWith("http") ? img : cloudinaryBase + img;
    return `<img src="${src}" alt="${productDetails.name}">`;
  })
  .join("");


  document.querySelector(".product-page").innerHTML = `

      <div class="product-images">
      ${imagesHTML}
      </div>

      <!-- Right: Details Section -->
      <div class="product-details">
        <p class="product-brand">${productDetails.brand}</p>
        <h1 class="product-name">${productDetails.name}</h1>
        <p class="product-size">Size | ${productDetails.size}${productDetails.gender}</p>
        <!--<p class="product-price">$${(productDetails.price / 100).toFixed(2)}</p> -->
        <p class="product-condition">Condition | ${productDetails.condition}</p>
        <div class="product-description">
          <h3>Description</h3>
          <p>${productDetails.description}</p>
        </div>
        <button id="add-to-cart-button" data-id="${productDetails._id}">Buy Now · $${(productDetails.price / 100).toFixed(2)}</button>
      </div>

  `
}
