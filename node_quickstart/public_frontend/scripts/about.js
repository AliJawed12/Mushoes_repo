// Accordion functionality
function toggleAccordion(button) {
  const accordionItem = button.parentElement;
  const isActive = accordionItem.classList.contains('active');
  
  // Close all accordion items
  const allItems = document.querySelectorAll('.accordion-item');
  allItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // If the clicked item wasn't active, open it
  if (!isActive) {
    accordionItem.classList.add('active');
  }
}

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  
  // In a real application, you would send this data to a server
  console.log('Form submitted:', { name, email, subject, message });
  
  // Show success message (you can customize this)
  alert('Thank you for your message! We will get back to you soon.');
  
  // Reset form
  this.reset();
});
