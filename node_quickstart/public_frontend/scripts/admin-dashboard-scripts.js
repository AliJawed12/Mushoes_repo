"use strict";

const $id = id => document.getElementById(id);



window.onload = function() {
  // Make sure you provide the ID of the element you want to target
  const submitButton = $id("submit_button"); // Replace "myButton" with your element's id
  if (submitButton) {
    submitButton.addEventListener("click", submitListing);
  }
}


async function submitListing(e) {

  e.preventDefault(); // Prevent form submission / page reload

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
    description: $id("description").value,
    images: []// FileList object
    // for now for images just sending empty string
  };

  console.log(shoeData);
  alert("Shoe Submitted");

  // Example: you can now send this data via fetch() or do something else

  const res = await fetch('/admin/dashboard/upload_listing', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({ listing: shoeData })
  });

  console.log(await res.text());

}
