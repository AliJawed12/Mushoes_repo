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

  // Modal close button
  const modalCloseButton = $id("modalCloseButton");
  if (modalCloseButton) {
    modalCloseButton.addEventListener("click", closeModal);
  }

  // Close modal when clicking outside
  const confirmationModal = $id("confirmationModal");
  if (confirmationModal) {
    confirmationModal.addEventListener("click", function(e) {
      if (e.target === confirmationModal) {
        closeModal();
      }
    });
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

  // Grab image files and sort alphabetically so ja3-1 comes first
  const files = Array.from($id("shoe_images").files);
  files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
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
    
    // Remove any error messages on success
    const existingError = document.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Show success modal with product details
    showSuccessModal(shoeData, files);
    
    // Clear the form
    clearUploadForm();
    
    $id("submit_button").disabled = false;
  } catch (err) {
    console.error(err);
    showErrorMessage("Upload failed. Please check your connection and try again.");
    $id("submit_button").disabled = false;
  }

}

// helper function to check user entry validation for submit listings
function formValidation() {

  // Remove any existing error messages first
  const existingError = document.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  let errorMessage = '';

  if ($id("shoe_name").value.trim() === "") {
    errorMessage = "Shoe name cannot be empty.";
  }
  else if ($id("shoe_brand").value.trim() === "") {
    errorMessage = "Brand name cannot be empty.";
  }
  else {
    const size = parseFloat($id("shoe_size").value);
    if (isNaN(size) || size <= 0) {
      errorMessage = "Shoe size must be a valid positive number.";
    }
    else {
      const gender = $id("gender").value.trim().toUpperCase();
      if (gender.length !== 1 || (gender !== "M" && gender !== "F")) {
        errorMessage = "Gender must be exactly 'M' or 'F'.";
      }
      else if ($id("condition").value.trim() === "") {
        errorMessage = "Please select a condition from the dropdown.";
      }
      else {
        const price = parseFloat($id("price").value);
        if (isNaN(price) || price < 0) {
          errorMessage = "Price must be a valid number in cents (0 or greater).";
        }
        else {
          const stock = parseInt($id("stock").value);
          if (isNaN(stock)) {
            errorMessage = "Stock must be a valid number.";
          }
          else if (stock <= 0) {
            errorMessage = "Stock must be at least 1.";
          }
        }
      }
    }
  }

  // If there's an error, display it
  if (errorMessage) {
    showErrorMessage(errorMessage);
    return false;
  }

  return true; // all checks passed
}

// Show error message in themed box
function showErrorMessage(message) {
  const uploadForm = $id("upload_listing");
  
  // Create error message element
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${message}</span>`;
  
  // Insert at the top of the form
  uploadForm.insertBefore(errorDiv, uploadForm.firstChild);
  
  // Scroll to error message
  errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
      const listingUniqueMongoDBID = listing.dataset.id;
      
      // Extract product details from the listing element
      const productName = listing.querySelector('.item-listing-des-name').textContent;
      const productBrand = listing.querySelector('.item-listing-des-brand').textContent;
      const productPrice = listing.querySelector('.item-listing-des-price').textContent;
      const productImage = listing.querySelector('.item-listing-image img').src;
      const productSize = listing.querySelector('.item-listing-des-size').textContent;
      const productCondition = listing.querySelector('.item-listing-des-condition').textContent;
      
      // Show delete confirmation modal
      showDeleteConfirmationModal({
        id: listingUniqueMongoDBID,
        name: productName,
        brand: productBrand,
        price: productPrice,
        image: productImage,
        size: productSize,
        condition: productCondition
      });
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

// Show success modal after adding a product
function showSuccessModal(productData, imageFiles) {
  const modal = $id("confirmationModal");
  const modalIcon = $id("modalIcon");
  const modalIconSymbol = $id("modalIconSymbol");
  const modalTitle = $id("modalTitle");
  const modalBody = $id("modalBody");
  
  // Set success styling
  modalIcon.className = "confirmation-modal-icon success";
  modalIconSymbol.className = "fas fa-check";
  modalTitle.textContent = "Listing Added Successfully!";
  
  // Create image preview if files exist
  let imageHTML = '';
  if (imageFiles && imageFiles.length > 0) {
    const firstImage = URL.createObjectURL(imageFiles[0]);
    imageHTML = `<img src="${firstImage}" alt="${productData.name}" class="confirmation-product-image">`;
  }
  
  // Create product details
  modalBody.innerHTML = `
    ${imageHTML}
    <div class="confirmation-product-details">
      <div class="confirmation-detail-row">
        <span class="confirmation-detail-label">Name:</span>
        <span class="confirmation-detail-value">${productData.name}</span>
      </div>
      <div class="confirmation-detail-row">
        <span class="confirmation-detail-label">Brand:</span>
        <span class="confirmation-detail-value">${productData.brand}</span>
      </div>
      <div class="confirmation-detail-row">
        <span class="confirmation-detail-label">Price:</span>
        <span class="confirmation-detail-value">$${(productData.price / 100).toFixed(2)} USD</span>
      </div>
      <div class="confirmation-detail-row">
        <span class="confirmation-detail-label">Size:</span>
        <span class="confirmation-detail-value">${productData.size}</span>
      </div>
      <div class="confirmation-detail-row">
        <span class="confirmation-detail-label">Condition:</span>
        <span class="confirmation-detail-value">${productData.condition}</span>
      </div>
      <div class="confirmation-detail-row">
        <span class="confirmation-detail-label">Stock:</span>
        <span class="confirmation-detail-value">${productData.stock}</span>
      </div>
    </div>
  `;
  
  modal.classList.add("show");
}

// Show delete confirmation modal
function showDeleteConfirmationModal(productData) {
  const modal = $id("confirmationModal");
  const modalIcon = $id("modalIcon");
  const modalIconSymbol = $id("modalIconSymbol");
  const modalTitle = $id("modalTitle");
  const modalBody = $id("modalBody");
  const modalFooter = modal.querySelector('.confirmation-modal-footer');

  // removes delete button from submit listing confirmation pop up
  modalFooter.innerHTML = `
    <button class="confirmation-modal-button primary" onclick="closeModal()">OK</button>
  `;

  // Set delete styling
  modalIcon.className = "confirmation-modal-icon delete";
  modalIconSymbol.className = "fas fa-trash";
  modalTitle.textContent = "Delete This Listing?";
  
  // Create product details
  modalBody.innerHTML = `
    <img src="${productData.image}" alt="${productData.name}" class="confirmation-product-image">
    <div class="confirmation-product-details">
      <div class="confirmation-detail-row">
        <span class="confirmation-detail-label">Name:</span>
        <span class="confirmation-detail-value">${productData.name}</span>
      </div>
      <div class="confirmation-detail-row">
        <span class="confirmation-detail-label">Brand:</span>
        <span class="confirmation-detail-value">${productData.brand}</span>
      </div>
      <div class="confirmation-detail-row">
        <span class="confirmation-detail-label">Price:</span>
        <span class="confirmation-detail-value">${productData.price}</span>
      </div>
      <div class="confirmation-detail-row">
        <span class="confirmation-detail-label">Size:</span>
        <span class="confirmation-detail-value">${productData.size}</span>
      </div>
      <div class="confirmation-detail-row">
        <span class="confirmation-detail-label">Condition:</span>
        <span class="confirmation-detail-value">${productData.condition}</span>
      </div>
    </div>
    <p style="margin-top: 1rem; color: rgba(0,0,0,0.7); text-align: center;">This action cannot be undone.</p>
  `;
  
  // Update footer buttons for delete confirmation
  modalFooter.innerHTML = `
    <button class="confirmation-modal-button secondary" onclick="closeModal()">Cancel</button>
    <button class="confirmation-modal-button danger" onclick="confirmDelete('${productData.id}', '${productData.name}', '${productData.brand}', '${productData.image}')">Delete</button>
  `;
  
  modal.classList.add("show");
}

// Confirm and execute deletion
async function confirmDelete(mongoID, productName, productBrand, productImage) {
  // Call delete function
  await deleteListingRequest(mongoID);
  
  // Show deletion success
  showDeletionSuccessModal(productName, productBrand, productImage);
  
  // Refresh listings
  viewAllListings();
}

// Show deletion success modal
function showDeletionSuccessModal(productName, productBrand, productImage) {
  const modal = $id("confirmationModal");
  const modalIcon = $id("modalIcon");
  const modalIconSymbol = $id("modalIconSymbol");
  const modalTitle = $id("modalTitle");
  const modalBody = $id("modalBody");
  const modalFooter = modal.querySelector('.confirmation-modal-footer');
  
  // Set success styling
  modalIcon.className = "confirmation-modal-icon success";
  modalIconSymbol.className = "fas fa-check";
  modalTitle.textContent = "Listing Deleted Successfully";
  
  // Create product details
  modalBody.innerHTML = `
    <img src="${productImage}" alt="${productName}" class="confirmation-product-image">
    <div class="confirmation-product-details">
      <div class="confirmation-detail-row">
        <span class="confirmation-detail-label">Name:</span>
        <span class="confirmation-detail-value">${productName}</span>
      </div>
      <div class="confirmation-detail-row">
        <span class="confirmation-detail-label">Brand:</span>
        <span class="confirmation-detail-value">${productBrand}</span>
      </div>
    </div>
    <p style="margin-top: 1rem; color: rgba(0,0,0,0.7); text-align: center;">The listing has been removed from your inventory.</p>
  `;
  
  // Reset footer to single OK button
  modalFooter.innerHTML = `
    <button class="confirmation-modal-button primary" onclick="closeModal()">OK</button>
  `;
  
  modal.classList.add("show");
}

// Close modal
function closeModal() {
  const modal = $id("confirmationModal");
  modal.classList.remove("show");
}

// Clear the upload form after successful submission
function clearUploadForm() {
  $id("shoe_name").value = '';
  $id("shoe_brand").value = '';
  $id("shoe_size").value = '';
  $id("gender").value = '';
  $id("shoe_color").value = '';
  $id("condition").value = '';
  $id("price").value = '';
  $id("stock").value = '';
  $id("description").value = '';
  $id("shoe_images").value = '';
}