"use strict";

const $id = id => document.getElementById(id);


// when window loads automatically add eventlistener
window.onload = function() {
  // display the content for selected operation
  const uploadListing = $id("upload_listing");
  const deleteListing = $id("delete_listing");
  //uploadListing.style.display = "none";

  const adminOperations = $id("admin_operation");

  // When dropdown changes
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
    }

  });
  

  // Make sure you provide the ID of the element you want to target
  const submitButton = $id("submit_button");
  if (submitButton) {
    submitButton.addEventListener("click", submitListing);
  }

  // adding event handler for delte button
  const deleteButton = $id("delete_button");
  if (deleteButton) {
    deleteButton.addEventListener("click", viewAllListings);
  }

  
}


async function submitListing(e) {

  e.preventDefault(); // Prevent form submission / page reload

  if (!formValidation()) {
    return;
  }

  // Grab all values
  const shoeData = {
    name: $id("shoe_name").value,
    brand: $id("shoe_brand").value,
    size: parseFloat($id("shoe_size").value),
    gender: $id("gender").value.toUpperCase(),
    color: $id("shoe_color").value.split(",").map(c => c.trim()), // array of colors
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

  try {
    const res = await fetch("/admin/dashboard/upload_listing", {
      method: "POST",
      body: formData, // No headers needed since not JSON
    });

    const data = await res.json();
    console.log("Upload result:", data);
    alert("Shoe uploaded successfully!");
  } catch (err) {
    console.error(err);
    alert("Upload failed. Check console.");
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

// method which for now immediatlly connects to get route

async function viewAllListings() {

  try {
    const res = await fetch('/admin/dashboard/delete_listing', {
      method: 'GET'
  });
    const data = await res.json();
    console.log("This is all from the frontend")
    console.log(data);
  } catch (err) {
    console.error("Fetch error:", err);
  }

}