//testing
console.log ("jello hello (vine reference, anyone?)");

//menu toggling. following example and adapting it to fit my needs, shoutout to mdn docs. can i just say gsap is a pain? less than api, but still
const menu = document.querySelector(".navMain");
const navItems = document.querySelectorAll(".navItem"); // use querySelectorAll for all items
const menuBtn = document.querySelector(".menuBtn");
const closeMenu = document.querySelector(".closeMenu");
const openMenu = document.querySelector(".openMenu");

// Create GSAP timeline for nav links
const navTimeline = gsap.timeline({ paused: true, defaults: { duration: 0.5, ease: "power1.out" } });
navTimeline.to(navItems, {
  opacity: 1,
  y: 0,
  stagger: 0.2
});

function toggleMenu() {
    if (menu.classList.contains("showMenu")) {
        menu.classList.remove("showMenu");
        closeMenu.style.display = "none";
        openMenu.style.display = "block";

        // Reset nav items for next open
        gsap.set(navItems, { opacity: 0, y: -20 });

    } else {
        menu.classList.add("showMenu");
        closeMenu.style.display = "block";
        openMenu.style.display = "none";

        // Play GSAP timeline to animate nav items
        navTimeline.restart();
    }
}

menuBtn.addEventListener("click", toggleMenu);

//back to top btn
let bttButton = document.getElementById("bttBtn");
window.onscroll = function() {this.scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        bttButton.style.display = "block";
    }
    else {
        bttButton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Animate all paragraphs and lists with class scrollAnim
gsap.utils.toArray(".scrollAnim").forEach(elem => {
  gsap.to(elem, {
    opacity: 1,
    y: 0,             // move to normal position
    duration: 0.8,
    ease: "power1.out",
    scrollTrigger: {
      trigger: elem,      // element triggers animation
      start: "top 80%",   // when element top hits 80% of viewport
      toggleActions: "play none none none"
    }
  });
});

gsap.to("#logo", {
    rotation: 360,
    duration: 2, // rotate over 2 seconds
    ease: "power1.inOut"
  });