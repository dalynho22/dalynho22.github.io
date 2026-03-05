

/* Your images are here:
   /images/digitalportfolio/<filename>
*/
const IMG_BASE = "../images/digitalportfolio/";

/* Project groups (click -> project page) */
const PROJECTS = [
  {
    id: "teatimewthi",
    title: "Teatimewthi — Depop Logo + Branding",
    category: "branding",
    href: "./teatimewthi.html",
    cover: IMG_BASE + "teatimewthiDEPOP.png",
    description:
      "Logo/branding for a Depop clothing seller. Main element: a tea pot bunny I painted.",
    tags: ["Canva", "Branding", "Logo"]
  },
  {
    id: "dejavuvtg",
    title: "Dejavuvtg — Instagram Profile Branding",
    category: "branding",
    href: "./dejavuvtg.html",
    cover: IMG_BASE + "dejavuvtgPFP.png",
    description:
      "Instagram profile picture created for a vintage clothing seller using Canva.",
    tags: ["Canva", "Social Branding", "PFP"]
  },
  {
    id: "instastories",
    title: "Instagram Stories — Personal Story Designs",
    category: "social",
    href: "./instastories.html",
    cover: IMG_BASE + "instaStory1.jpg",
    description:
      "A set of Instagram story designs I like to create when posting.",
    tags: ["Social", "Stories", "Layout"]
  },
  {
    id: "scrapbook",
    title: "Scrapbook — Physical Collage Work",
    category: "hobby",
    href: "./scrapbook.html",
    cover: IMG_BASE + "scrap1.jpg",
    description:
      "My biggest hobby — physical scrapbook spreads (grouped as one project).",
    tags: ["Hobby", "Composition", "Collage"]
  },
  {
    id: "parkingapp",
    title: "UCF Parking App Design — UI Concept (Figma)",
    category: "uiux",
    href: "./parking-app.html",
    cover: IMG_BASE + "parkingAppDesign.png",
    description:
      "Figma concept from Foundations of HCI: application proposal idea to help UCF parking issues.",
    tags: ["Figma", "UI/UX", "HCI"]
  }
];

/* =========================
   App
========================= */
const state = {
  filter: "all",
  query: "",
  items: PROJECTS,
  filtered: PROJECTS
};

const gridEl = document.getElementById("projectGrid");
const emptyEl = document.getElementById("emptyState");
const yearEl = document.getElementById("year");

const filterButtons = Array.from(document.querySelectorAll(".chip"));
const searchInput = document.getElementById("searchInput");
const themeBtn = document.getElementById("themeBtn");

const emailLink = document.getElementById("emailLink");

if (yearEl) yearEl.textContent = new Date().getFullYear();


/* Theme */
loadTheme();
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("portfolioTheme", next);
    themeBtn.textContent = next === "dark" ? "☾" : "☀";
  });
}

function loadTheme() {
  const saved = localStorage.getItem("portfolioTheme");
  const theme = saved || "dark";
  document.documentElement.setAttribute("data-theme", theme);
  if (themeBtn) themeBtn.textContent = theme === "dark" ? "☾" : "☀";
}

/* Filters */
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.filter = btn.dataset.filter;
    applyFilters();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    applyFilters();
  });
}

function applyFilters() {
  const q = state.query;

  state.filtered = state.items.filter((p) => {
    const matchesFilter = state.filter === "all" || p.category === state.filter;

    const haystack = [
      p.title,
      p.description,
      p.category,
      ...(p.tags || [])
    ].join(" ").toLowerCase();

    const matchesSearch = !q || haystack.includes(q);
    return matchesFilter && matchesSearch;
  });

  render();
}

/* Render */
render();

function render() {
  if (!gridEl) return;
  gridEl.innerHTML = "";

  if (!state.filtered.length) {
    if (emptyEl) emptyEl.hidden = false;
    return;
  }
  if (emptyEl) emptyEl.hidden = true;

  state.filtered.forEach((p) => {
    const a = document.createElement("a");
    a.className = "project-card";
    a.href = p.href;

    a.innerHTML = `
      <img class="thumb" src="${escapeHtml(p.cover)}" alt="${escapeHtml(p.title)}" loading="lazy" />
      <div class="project-body">
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-desc">${escapeHtml(p.description)}</p>
        <div class="tag-row">
          ${(p.tags || []).slice(0, 3).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
        </div>
      </div>
    `;

    gridEl.appendChild(a);
  });
}


/* Helper */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
