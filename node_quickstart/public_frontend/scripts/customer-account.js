// Customer Account Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Tab Switching Functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab
            button.classList.add('active');

            // Show corresponding content
            const tabName = button.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabName}-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });

    // Logout Button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // TODO: Implement actual logout logic
            if (confirm('Are you sure you want to logout?')) {
                console.log('Logging out...');
                // Redirect to login page or home
                window.location.href = 'account.html';
            }
        });
    }

    // Account Details Form Submission
    const accountDetailsForm = document.getElementById('account-details-form');
    if (accountDetailsForm) {
        accountDetailsForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('customer-name').value;
            const email = document.getElementById('customer-email').value;
            const phone = document.getElementById('customer-phone').value;

            // TODO: Send data to backend
            console.log('Saving account details:', { name, email, phone });

            // Show success message
            showMessage('details-message', 'Account details updated successfully!', 'success');

            // Hide message after 3 seconds
            setTimeout(() => {
                hideMessage('details-message');
            }, 3000);
        });
    }

    // Password Change Form Submission
    const passwordChangeForm = document.getElementById('password-change-form');
    if (passwordChangeForm) {
        passwordChangeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validate passwords match
            if (newPassword !== confirmPassword) {
                showMessage('password-message', 'New passwords do not match!', 'error');
                setTimeout(() => hideMessage('password-message'), 3000);
                return;
            }

            // Validate password length
            if (newPassword.length < 8) {
                showMessage('password-message', 'Password must be at least 8 characters!', 'error');
                setTimeout(() => hideMessage('password-message'), 3000);
                return;
            }

            // TODO: Send data to backend for password change
            console.log('Changing password...');

            // Show success message
            showMessage('password-message', 'Password updated successfully!', 'success');

            // Clear form
            passwordChangeForm.reset();

            // Hide message after 3 seconds
            setTimeout(() => {
                hideMessage('password-message');
            }, 3000);
        });
    }

    // Email Preferences Form Submission
    const emailPreferencesForm = document.getElementById('email-preferences-form');
    if (emailPreferencesForm) {
        emailPreferencesForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const promoEmails = document.getElementById('promo-emails').checked;
            const orderEmails = document.getElementById('order-emails').checked;
            const newsletterEmails = document.getElementById('newsletter-emails').checked;

            // TODO: Send preferences to backend
            console.log('Saving email preferences:', { promoEmails, orderEmails, newsletterEmails });

            // Show success message
            showMessage('preferences-message', 'Email preferences saved successfully!', 'success');

            // Hide message after 3 seconds
            setTimeout(() => {
                hideMessage('preferences-message');
            }, 3000);
        });
    }

    // View Order Details Buttons
    const viewOrderButtons = document.querySelectorAll('.view-order-btn');
    viewOrderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            // TODO: Navigate to order details page or show modal
            console.log('Viewing order:', orderId);
            alert(`Order details for #${orderId} - Coming soon!`);
        });
    });

    // Remove from Wishlist Buttons
    const removeWishlistButtons = document.querySelectorAll('.remove-wishlist-btn');
    removeWishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const wishlistItem = this.closest('.wishlist-item');

            if (confirm('Remove this item from your wishlist?')) {
                // TODO: Send removal request to backend
                console.log('Removing from wishlist:', productId);

                // Remove from DOM with animation
                wishlistItem.style.opacity = '0';
                wishlistItem.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    wishlistItem.remove();

                    // Check if wishlist is empty
                    const remainingItems = document.querySelectorAll('.wishlist-item');
                    if (remainingItems.length === 0) {
                        document.querySelector('.wishlist-grid').style.display = 'none';
                        document.querySelector('.no-wishlist').style.display = 'block';
                    }
                }, 300);
            }
        });
    });

    // View Product Buttons in Wishlist
    const viewProductButtons = document.querySelectorAll('.view-product-btn');
    viewProductButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            // TODO: Navigate to product page
            console.log('Viewing product:', productId);
            // window.location.href = `product.html?id=${productId}`;
            alert(`Product page for ID ${productId} - Coming soon!`);
        });
    });

    // Delete Account Button
    const deleteAccountButton = document.getElementById('delete-account-btn');
    const deleteModal = document.getElementById('delete-confirmation-modal');
    const cancelDeleteButton = document.getElementById('cancel-delete-btn');
    const confirmDeleteButton = document.getElementById('confirm-delete-btn');

    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', function() {
            deleteModal.style.display = 'flex';
        });
    }

    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', function() {
            deleteModal.style.display = 'none';
        });
    }

    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', function() {
            // TODO: Send delete account request to backend
            console.log('Deleting account...');
            alert('Account deletion functionality - Coming soon!');
            deleteModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === deleteModal) {
                deleteModal.style.display = 'none';
            }
        });
    }

    // Helper Functions
    function showMessage(elementId, message, type) {
        const messageBox = document.getElementById(elementId);
        const messageText = document.getElementById(`${elementId}-text`);
        
        if (messageBox && messageText) {
            messageText.textContent = message;
            messageBox.className = `message-box ${type}`;
            messageBox.style.display = 'block';
        }
    }

    function hideMessage(elementId) {
        const messageBox = document.getElementById(elementId);
        if (messageBox) {
            messageBox.style.display = 'none';
        }
    }

    // Add transition effect for wishlist items removal
    const style = document.createElement('style');
    style.textContent = `
        .wishlist-item {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});
