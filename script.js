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
var THEME_LABELS = { system: "Auto", light: "Light", dark: "Dark" };
var THEME_ORDER = ["system", "light", "dark"];

function applyTheme(theme) {
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
  themeBtn.textContent = THEME_LABELS[theme];
  themeBtn.title = "Theme: " + THEME_LABELS[theme] + " (click to change)";
}

var storedTheme = localStorage.getItem("theme") || "system";
applyTheme(storedTheme);

themeBtn.addEventListener("click", function () {
  var current = localStorage.getItem("theme") || "system";
  var next = THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length];
  localStorage.setItem("theme", next);
  applyTheme(next);
});

// Translate: proposes the browser's language via Google Translate, always offers English back.
var translateBtn = document.getElementById("translate-toggle");

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

  if (activeLang) {
    translateBtn.hidden = false;
    translateBtn.textContent = "English";
    translateBtn.title = "Show original (English)";
    translateBtn.addEventListener("click", function () {
      setGoogTransLang(null);
    });
    return;
  }

  if (sysLang === "en") {
    return;
  }

  var label = sysLang;
  try {
    label = new Intl.DisplayNames([sysLang], { type: "language" }).of(sysLang);
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } catch (e) {}

  translateBtn.hidden = false;
  translateBtn.textContent = label;
  translateBtn.title = "Translate to " + label;
  translateBtn.addEventListener("click", function () {
    setGoogTransLang(sysLang);
  });
})();

document.getElementById("print-btn").addEventListener("click", function () {
  window.print();
});
