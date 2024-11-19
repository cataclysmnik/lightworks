// Get the button:
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    mybutton.classList.add("show");
  } else {
    mybutton.classList.remove("show");
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: "smooth" // Enables smooth scrolling
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll("img");
  let loadedImages = 0;

  images.forEach((img) => {
      // Attach load event to each image
      img.onload = () => {
          loadedImages++;
          // Check if all images are loaded
          if (loadedImages === images.length) {
              document.getElementById("loading-screen").style.display = "none";
          }
      };

      // For cached images
      if (img.complete) {
          img.onload();
      }
  });
});
