document.querySelectorAll(".topic-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var topic = btn.getAttribute("data-topic");

    document.querySelectorAll(".topic-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");

    document.querySelectorAll(".topic-panel").forEach(function (panel) {
      panel.classList.toggle("active", panel.id === topic);
    });
  });
});
