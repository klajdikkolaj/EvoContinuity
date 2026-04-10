const params = new URLSearchParams(window.location.search);
const revealNodes = [...document.querySelectorAll("[data-reveal]")];

revealNodes.forEach((node) => node.classList.add("reveal-ready"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
);

revealNodes.forEach((node) => revealObserver.observe(node));

if (params.has("revealAll")) {
  revealNodes.forEach((node) => node.classList.add("visible"));
}

const previewTarget = params.get("preview");

if (previewTarget) {
  window.addEventListener("load", () => {
    const section = document.getElementById(previewTarget);

    if (section) {
      section.scrollIntoView({ behavior: "auto", block: "start" });
    }
  });
}

const hero = document.querySelector(".hero");

if (hero) {
  const setHeroGlow = (clientX, clientY) => {
    const rect = hero.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    hero.style.setProperty("--pointer-x", `${x.toFixed(2)}%`);
    hero.style.setProperty("--pointer-y", `${y.toFixed(2)}%`);
  };

  hero.addEventListener("pointermove", (event) => {
    setHeroGlow(event.clientX, event.clientY);
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--pointer-x", "74%");
    hero.style.setProperty("--pointer-y", "28%");
  });
}

const topbar = document.querySelector(".topbar");

if (topbar) {
  const syncTopbar = () => {
    topbar.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  syncTopbar();
  window.addEventListener("scroll", syncTopbar, { passive: true });
}
