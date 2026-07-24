var body = document.body;
var toggleBtn = document.getElementById("sidebar-toggle");
var mobileQuery = window.matchMedia("(max-width: 720px)");

function setSidebarHidden(hidden) {
  body.classList.toggle("sidebar-hidden", hidden);
  toggleBtn.setAttribute("aria-expanded", String(!hidden));
  toggleBtn.textContent = hidden ? "›" : "‹";
}

toggleBtn.addEventListener("click", function () {
  setSidebarHidden(!body.classList.contains("sidebar-hidden"));
});

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

    if (mobileQuery.matches) {
      setSidebarHidden(true);
    }
  });
});
