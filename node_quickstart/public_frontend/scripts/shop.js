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

// Method 