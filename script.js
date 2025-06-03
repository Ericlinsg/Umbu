
const track = document.querySelector('.carousel-track');
const cards = document.querySelectorAll('.carousel-card');
let index = 0;
const delay = 3000;

function moveCarousel() {
  index++;
  track.style.transition = "transform 0.5s ease-in-out";
  track.style.transform = `translateX(-${index * 100}%)`;

  if (index === cards.length) {
    setTimeout(() => {
      track.style.transition = "none";
      track.style.transform = "translateX(0)";
      index = 0;
    }, 500);
  }
}

setInterval(moveCarousel, delay);
