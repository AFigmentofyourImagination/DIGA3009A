const filterButtons = document.querySelectorAll(".filter-btn");
const items = document.querySelectorAll(".item");
// Loop through buttons
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove("active"));
    // Add active class to clicked button
    button.classList.add("active");

    const filter = button.getAttribute("dataFilter");

    // Loop through all items
    items.forEach(item => {
      if (filter === "all" || item.classList.contains(filter)) {
        item.classList.remove("hide");
      } else {
        item.classList.add("hide");
      }
    });
  });
});