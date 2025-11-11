// account.js file

/* File contains all code for account.js. Provides functionality such as log in, registering, viwing account details such as email, password, previous orders */

const $id = id => document.getElementById(id);


// do this instead of window.onload = function() {}, otherwise overwrites previous one
window.addEventListener("load", function() {
  const loginFormSubmitBtn = $id("submit_login");

  loginFormSubmitBtn.addEventListener("click", loginFormValidation);
});


// helper function to validate passwords before checking against server
function loginFormValidation() {
  // grab user and password check if not null
  const enteredUsername = $id("user_name").value;
  const enteredUserpassword = $id("user_password").value;

  if (!enteredUsername) {
    alert("Please enter a username.");
    return false;
  }

  if (!enteredUserpassword) {
    alert("Please enter a password");
    return false;
  }

  console.log(enteredUsername);
  console.log(enteredUserpassword);

  return true;
}

async function userLogin() {
  if (!loginFormValidation) {
    console.log("Error with loginFormValidation()")
    return false;
  } 


  
}