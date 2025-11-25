// HEADER AND FOOTER REUSABLE JAVASCRIPT
// Hamburger Menu functionality

// Get elements
const menuButton = document.getElementById('menu-button');
const menuSidebar = document.getElementById('menu-sidebar');
const menuCloseButton = document.getElementById('menu-close-button');

// Function to open the menu
function openMenu() {
  menuSidebar.classList.add('open');
  // Prevent scrolling on mobile when menu is open
  if (window.innerWidth <= 600) {
    document.body.classList.add('no-scroll');
  }
}

// Function to close the menu
function closeMenu() {
  menuSidebar.classList.remove('open');
  // Re-enable scrolling
  document.body.classList.remove('no-scroll');
}

// Event listeners
menuButton.addEventListener('click', openMenu);
menuCloseButton.addEventListener('click', closeMenu);

// Close menu when clicking outside of it
document.addEventListener('click', function(event) {
  const isClickInsideMenu = menuSidebar.contains(event.target);
  const isClickOnMenuButton = menuButton.contains(event.target);
  
  if (!isClickInsideMenu && !isClickOnMenuButton && menuSidebar.classList.contains('open')) {
    closeMenu();
  }
});

// Close menu when a link is clicked (optional, for better UX)
const menuLinks = document.querySelectorAll('.menu-link');
menuLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});
