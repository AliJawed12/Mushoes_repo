
window.onload = function() {
  
  const openButton = document.getElementById("cart-text-button");
  const closeButton = document.getElementById("cart-close-button");
  const cartSideBar = document.getElementById("cart-sidebar");

  openButton.addEventListener("click", () => {
    cartSideBar.classList.add("open");
    document.body.classList.add("no-scroll");
    console.log("Opening");
  });

  closeButton.addEventListener("click", () => {
    cartSideBar.classList.remove("open");
    document.body.classList.remove("no-scroll");
  });


};