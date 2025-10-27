//testing
console.log ("jello hello");

//menu toggling. following example and adapting it to fit my needs, shoutout to mdn docs
const menu = document.querySelector(".navMain");
    //function = check in doc css for element with .navMain name
const navItems = document.querySelector(".navItem");
const menuBtn = document.querySelector(".menuBtn");
const closeMenu = document.querySelector(".closeMenu");
const openMenu = document.querySelector(".openMenu");

function toggleMenu() {
    if (menu.classList.contains("showMenu")) {
        menu.classList.remove("showMenu");
        closeMenu.style.display = "none";
        openMenu.style.display = "block";
    } else {
        menu.classList.add("showMenu");
        closeMenu.style.display = "block";
        openMenu.style.display = "none";
    }
}

menuBtn.addEventListener("click", toggleMenu);