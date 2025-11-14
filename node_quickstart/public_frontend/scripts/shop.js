/* Shop.js */

window.addEventListener("load", function() {
  console.log("Running!!!!!!!!!!!!!!!!");
  fetchListingsFromMongoDB();
});

// Method which retreives all listings from MongoDB in json data format
async function fetchListingsFromMongoDB() {

  try {
    const res = await fetch('/fetch_all_listings', {
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

// Method to showcase all listings on shop.js

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