// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("mobile-menu");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  menu.hidden = open;
});
menu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    menu.hidden = true;
  })
);

// Tools marquee (list duplicated so the loop is seamless)
const marquee = document.getElementById("marquee");
[...TOOLS, ...TOOLS].forEach((tool, i) => {
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = tool;
  if (i >= TOOLS.length) chip.setAttribute("aria-hidden", "true");
  marquee.appendChild(chip);
});

// Projects
const grid = document.getElementById("project-grid");
const filters = document.getElementById("filters");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function renderProjects(category) {
  const list = category === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === category);
  grid.innerHTML = list
    .map((p) => {
      const index = PROJECTS.indexOf(p);
      const media = p.image
        ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`
        : `<div class="ph"></div><span class="ph-label">${p.placeholder ? "coming soon" : "no preview"}</span>`;
      return `
        <button class="card reveal${p.placeholder ? " is-placeholder" : ""}" data-index="${index}">
          <div class="card-media">${media}</div>
          <div class="card-body">
            <span class="card-cat">${esc(p.category)}</span>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.summary)}</p>
            <div class="tags">${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          </div>
        </button>`;
    })
    .join("");
  grid.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function renderFilters() {
  const cats = ["All", ...new Set(PROJECTS.map((p) => p.category))];
  filters.innerHTML = cats
    .map((c, i) => `<button class="filter" role="tab" aria-selected="${i === 0}" data-cat="${esc(c)}">${esc(c)}</button>`)
    .join("");
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    filters.querySelectorAll(".filter").forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
    renderProjects(btn.dataset.cat);
  });
}

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const p = PROJECTS[card.dataset.index];
  modalContent.innerHTML = `
    ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}">` : ""}
    <div class="modal-body">
      <span class="card-cat">${esc(p.category)}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.details || p.summary)}</p>
      <div class="tags">${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      ${p.link ? `<a class="btn btn-primary" href="${esc(p.link)}" target="_blank" rel="noopener">View project →</a>` : ""}
    </div>`;
  modal.showModal();
});
modal.querySelector(".modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); observer.unobserve(en.target); }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll(".section-head, .service, .about-photo, .about-copy, .contact-card, .stats")
  .forEach((el) => { el.classList.add("reveal"); observer.observe(el); });

renderFilters();
renderProjects("All");

// Typed role rotation
const roles = ["Automation & AI Specialist", "Workflow Builder", "AI Agent Developer", "CRM Architect"];
const typed = document.getElementById("typed");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) {
  let r = 0, c = roles[0].length, deleting = true;
  setTimeout(function tick() {
    const word = roles[r];
    c += deleting ? -1 : 1;
    typed.textContent = word.slice(0, c);
    let delay = deleting ? 35 : 70;
    if (!deleting && c === word.length) { deleting = true; delay = 2200; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
    setTimeout(tick, delay);
  }, 2600);
}

// Animated dot-grid background
const canvas = document.getElementById("grid-bg");
const ctx = canvas.getContext("2d");
let w, h, dots = [];
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = canvas.clientWidth; h = canvas.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  dots = [];
  const gap = 34;
  for (let x = gap / 2; x < w; x += gap)
    for (let y = gap / 2; y < h; y += gap) dots.push({ x, y, p: Math.random() * Math.PI * 2 });
}
let mouse = { x: -999, y: -999 };
window.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
function draw(t) {
  ctx.clearRect(0, 0, w, h);
  for (const d of dots) {
    const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
    const glow = Math.max(0, 1 - dist / 160);
    const a = 0.08 + 0.06 * Math.sin(t / 1400 + d.p) + glow * 0.7;
    ctx.fillStyle = glow > 0.05 ? `rgba(0,229,255,${a})` : `rgba(139,160,200,${a})`;
    ctx.fillRect(d.x, d.y, 1.5 + glow * 1.5, 1.5 + glow * 1.5);
  }
  if (!reduceMotion) requestAnimationFrame(draw);
}
resize();
window.addEventListener("resize", resize);
requestAnimationFrame(draw);
