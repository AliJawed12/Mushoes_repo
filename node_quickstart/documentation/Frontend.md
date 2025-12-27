# Frontend

Documentation of General Frontend practices. Additionally specific page by page documentaion included as well.


## Overview

Frontend was built on top of the backend, supporting/allowing the key operations that can take place. The approach taken to build the frontend was functionality of backend and simplicity.

### Frontend Division

Frontend is split into two different parts: Customer Facing Frontend and Client Facing Frontend.

- [See Customer-Side Functionality Here](Overview.md#customer-uses)

Customer facing any indivudal can access. Client facing is locked behind express-basic-auth. 

- [See Client-Side Functionality Here](Overview.md#client-uses)


### Frontend Development Practices

All Frontend pages at their root consist of a header and footer. This header and footer allow for navigation to different pages. (Pictured Below)

Header
![Image of MuShoes Header](images/header.png)

Footer
![Image of MuShoes Footer](images/footer.png)

Between the header and the footer is where all the content of the page goes

``` html
<body>

  <div class="header"></div>

  <!-- All Page Specific Content Goes Here -->

  <div class="footer"></div>

</body>
```

Furthermore each page also includes these basics:

1. Styles for Header and Footer in HTML Head
``` html
<!-- Page Head -->
<link rel="stylesheet" href="styles/header-footer.css">
```

2. Cloudinary Import 
``` html
<!-- Page Head -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
```

3. Imported Fonts from Google Fonts
``` html
<!-- Imported Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
```

4. Hamburger Menu Functionality JavaScript inside HTML Body
``` html
<!-- Page Body -->
<script src="/scripts/hamburger-menu.js"></script>
```
See [hamburger-menu.js] documentation here

## 1. Index.html

This is the first page shown when visiting MuShoes.

### Index.html Architecure

``` html
<html>
  <head>

  </head>

  <body>
    <div class="header"></div>

    <!-- Hero Section: -->
     <!-- Centerpiece Image accompanied with About Us button redirecting to About.html page -->

    <div class="footer"></div>
  </body>
</html>
```

### Index.html Functionalities
1. Navigation to different .html pages using Header and Footer
2. Navigation to About.html when clicking "About Us" button


### Related Files

1. index.css - Styling for Centerpiece
   ``` html
   <link rel="stylesheet" href="styles/index.css">
   ```

### Code Documentation / Decision Making

Simple Code no need to document here

## 2. About.html

### About.html Architecture

``` html
<html>
  <head>

  </head>

  <body>
    <div class="header"></div>

    <section class="about-hero"></section>
    <section class="service-section"></section>
    <section class="vision-section"></section>
    <section class="contact-section"></section>

    <div class="footer"></div>
  </body>
</html>
```

### About.html Functionalities

1. Navigation to different .html pages using Header and Footer.
2. Toggling/Untoggling of Accordion Blocks to see brand specific information.
3. Contact Form allowing Customers to reach out to Client (Contact Form currently does not send or save data anywhere).

### Related Files
1. About.css
2. About.js
   - Contains documented code for Accordion Block and Contact Form functionality.

### Code Documentation / Decision Making

#### Services-Section

Accordion Block to showcase Brand Specific info

#### Contact-Section

Basic Contact Form

NOTE: Contact Form currently able to do everything besides send or save data somewhere.