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

// Theme: cycles system -> light -> dark -> system, persisted.
var themeBtn = document.getElementById("theme-toggle");
var THEME_NAMES = { system: "Auto", light: "Light", dark: "Dark" };
var THEME_ICONS = { system: "◐", light: "☀", dark: "☾" };
var THEME_ORDER = ["system", "light", "dark"];

function applyTheme(theme) {
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
  themeBtn.textContent = THEME_ICONS[theme];
  themeBtn.title = "Theme: " + THEME_NAMES[theme] + " (click to change)";
}

var storedTheme = localStorage.getItem("theme") || "system";
applyTheme(storedTheme);

themeBtn.addEventListener("click", function () {
  var current = localStorage.getItem("theme") || "system";
  var next = THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length];
  localStorage.setItem("theme", next);
  applyTheme(next);
});

// Translate: dropdown always offers English; adds the browser's language if it differs.
var translateSelect = document.getElementById("translate-select");

function getGoogTransLang() {
  var match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
  return match ? match[1] : null;
}

function setGoogTransLang(lang) {
  var expiry = "; expires=Thu, 01 Jan 2099 00:00:00 UTC; path=/";
  if (lang) {
    document.cookie = "googtrans=/en/" + lang + expiry;
  } else {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  }
  location.reload();
}

function detectSystemLang() {
  var candidates = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"];
  for (var i = 0; i < candidates.length; i++) {
    var code = candidates[i].split("-")[0].toLowerCase();
    if (code !== "en") {
      return code;
    }
  }
  return "en";
}

(function initTranslate() {
  var sysLang = detectSystemLang();
  var activeLang = getGoogTransLang();

  if (sysLang !== "en") {
    var opt = document.createElement("option");
    opt.value = sysLang;
    opt.textContent = sysLang.toUpperCase();
    translateSelect.appendChild(opt);
  }

  var enOpt = document.createElement("option");
  enOpt.value = "en";
  enOpt.textContent = "EN";
  translateSelect.appendChild(enOpt);

  translateSelect.value = activeLang || "en";

  translateSelect.addEventListener("change", function () {
    setGoogTransLang(translateSelect.value === "en" ? null : translateSelect.value);
  });
})();

document.getElementById("print-btn").addEventListener("click", function () {
  window.print();
});
