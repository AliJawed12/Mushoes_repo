// ===============================
// ACCORDION FUNCTIONALITY
// ===============================
// This function toggles accordion items open/closed
// Ensures only one accordion item is open at a time
function toggleAccordion(button) {
  // Get the accordion item that contains the clicked button
  const accordionItem = button.parentElement;

  // Check if the clicked accordion item is already active
  const isActive = accordionItem.classList.contains('active');

  // Select all accordion items on the page
  const allItems = document.querySelectorAll('.accordion-item');

  // Close all accordion items
  allItems.forEach(item => {
    item.classList.remove('active');
  });

  // If the clicked item was not active, open it
  if (!isActive) {
    accordionItem.classList.add('active');
  }
}

// ===============================
// CONTACT FORM SUBMISSION HANDLING
// ===============================
// Listens for the contact form submit event
document.getElementById('contactForm').addEventListener('submit', function(e) {
  // Prevents the page from refreshing on submit
  e.preventDefault();

  // Collect user input values from the form fields
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  // Log form data to the console (for testing/debugging only)
  // In production, this is where data would be sent to a server or email service
  console.log('Form submitted:', {
    name,
    email,
    subject,
    message
  });

  // Provide feedback to the user after submission
  alert('Thank you for your message! We will get back to you soon.');

  // Clear all form fields after successful submission
  this.reset();
});
