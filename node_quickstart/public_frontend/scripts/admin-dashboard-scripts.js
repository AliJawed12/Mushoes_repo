"use strict";

// shortcut to grabbing elements by id from dom
const $id = id => document.getElementById(id);


// when window loads automatically add eventlistener
window.onload = function() {
  // display the content for selected operation
  const uploadListing = $id("upload_listing");
  const deleteListing = $id("delete_listing");
  const adminOperations = $id("admin_operation");

  // When the dropdown selection changes, these operations will occur
  adminOperations.addEventListener("change", function() {
    const adminOp = adminOperations.value;

    if (adminOp === "Select Operation") {
      uploadListing.style.display = "none";
      deleteListing.style.display = "none";
    }
    else if (adminOp === "Upload Listing") {
      uploadListing.style.display = "block";
      deleteListing.style.display = "none";
    }
    else if (adminOp === "Delete Listing") {
      deleteListing.style.display = "block";
      uploadListing.style.display = "none";
      viewAllListings();
    }

  });
  

  // Add button functionality to submit_button, on click runs submitListing function
  const submitButton = $id("submit_button");
  if (submitButton) {
    submitButton.addEventListener("click", submitListing);
  }

}


// submitListing function which grabs data from submit form, compile data into FormData, then parse into upload_listing route
async function submitListing(e) {

  // disable submit button while awaiting 
  $id("submit_button").disabled = true;

  e.preventDefault(); // Prevent form submission / page reload

  // check if the values in the form are valid before continuing with this function
  if (!formValidation()) {
    $id("submit_button").disabled = false;
    return;
  }

  // Grab all values
  const shoeData = {
    name: $id("shoe_name").value,
    brand: $id("shoe_brand").value,
    size: parseFloat($id("shoe_size").value),
    gender: $id("gender").value.toUpperCase(),
    color: $id("shoe_color").value
      .split(",")
      .map(c => c.trim())
      .filter(c => c.length > 0) // remove empty entries from trailing commas
      .sort((a, b) => a.localeCompare(b)),
    //color: $id("shoe_color").value.split(",").map(c => c.trim()), // array of colors
    condition: $id("condition").value,
    price: parseFloat($id("price").value),
    stock: parseInt($id("stock").value),
    description: $id("description").value
  };

  // Build FormData (Using this to process images using multer, otherwise JSON would be sufficient)
  const formData = new FormData();
  formData.append("listing", JSON.stringify(shoeData));

  const files = $id("shoe_images").files;
  // Append image files
  for (const file of files) {
    formData.append("images", file);
  }

  // send data to endpoint here
  try {
    const res = await fetch("/admin/dashboard/upload_listing", {
      method: "POST",
      body: formData, // No headers needed since not JSON
    });

    const data = await res.json();
    console.log("Upload result:", data);
    alert("Shoe uploaded successfully!");
    $id("submit_button").disabled = false;
  } catch (err) {
    console.error(err);
    alert("Upload failed. Check console.");
    $id("submit_button").disabled = false;
  }

}

// helper function to check user entry validation for submit listings
function formValidation() {

  if ($id("shoe_name").value.trim() === "") {
    alert("Shoe name cannot be empty.");
    return false;
  }

  if ($id("shoe_brand").value.trim() === "") {
    alert("Brand name cannot be empty.");
    return false;
  }

  const size = parseFloat($id("shoe_size").value);
  if (isNaN(size)) {
    alert("Shoe size must be a number.");
    return false;
  }

  const gender = $id("gender").value.trim().toUpperCase();
  if (gender.length !== 1 || (gender !== "M" && gender !== "F")) {
    alert("Gender must be exactly 'M' or 'F'.");
    return false;
  }

  if ($id("condition").value.trim() === "") {
    alert("Condition cannot be empty. Please choose one of the options.");
    return false;
  }

  const price = parseFloat($id("price").value);
  if (isNaN(price)) {
    alert("Price must be a valid number in cents.");
    return false;
  }

  const stock = parseInt($id("stock").value);
  if (isNaN(stock)) {
    alert("Stock must be a valid number.");
    return false;
  }
  if (stock <= 0) {
    alert("Stock must be at least 1.");
    return false;
  }

  return true; // all checks passed
}

// method which connects to get '/admin/dashboard/view_deletable_listings' endpoint and displays all listings in the MongoDB database
async function viewAllListings() {

  try {
    const res = await fetch('/admin/dashboard/view_deletable_listings', {
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

    itemsHTML += `
      <div class="item-listing delete-item-listing" data-id="${product._id}">
        <div class="item-listing-image">
          <img src="${imgSrc}" alt="${product.name}">
        </div>

        <div class="item-listing-description">
          <div class="item-description-details">
            <div class="item-listing-des-brand">${product.brand}</div>
            <div class="item-listing-des-name">${product.name}</div>
            <div class="item-listing-des-price">$${(product.price/100).toFixed(2)} USD</div>
            <div class="item-listing-des-size">Size: ${product.size || 'N/A'}</div>
            <div class="item-listing-des-gender">Gender: ${product.gender || 'N/A'}</div>
            <div class="item-listing-des-condition">Condition: ${product.condition || 'N/A'}</div>
            <div class="item-listing-des-stock">Stock: ${product.stock || 'N/A'}</div>
          </div>

          <div class="item-color-description">${product.color.join(', ')}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = itemsHTML;

  // is ran every time, should not cause issues because acutal code in function requires clicking of a listing to enable deletion
  listingDeletionFunctionality();
}


// add delete functionality to all listings, on click allows option to delete
function listingDeletionFunctionality(){
  document.querySelectorAll(".delete-item-listing").forEach(listing => {
    listing.addEventListener("click", () => {

      if (confirm("Do you want to delete this listing?")) {
        const listingUniqueMongoDBID = listing.dataset.id;
        // call to async function to delete the listing
        deleteListingRequest(listingUniqueMongoDBID);
        // call to viewAllListings to update the page on the client side
        viewAllListings();
        console.log("Deleting Item: ", listingUniqueMongoDBID);
        alert("Listing Deleted!");
      }
      else {
        alert("Deletion Canceled!");
      }
      
    });
  });
}


// Route function for deleting a listing. Called when a listing is selected and confirmed to be deleted. 
// Takes in the listing mongoDB id, parses to endpoint, where endpoint deletes it
async function deleteListingRequest(mongoID) {

  try {

    const res = await fetch("/admin/dashboard/delete_listing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mongoID: mongoID }),
    });

    const data = await res.json();
    console.log(data.message);

  }
  catch (err) {
    console.error(err);
    alert("Error with fetch post request in admin_dashboard_scripts.js");
  }
}