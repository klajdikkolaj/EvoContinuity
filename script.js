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
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".nav");

if (topbar) {
  const syncTopbar = () => {
    topbar.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  syncTopbar();
  window.addEventListener("scroll", syncTopbar, { passive: true });
}

if (topbar && navToggle && primaryNav) {
  const setMenuState = (isOpen) => {
    topbar.classList.toggle("is-menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = topbar.classList.contains("is-menu-open");
    setMenuState(!isOpen);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      setMenuState(false);
    }
  });
}

const loopPreviewVideos = [...document.querySelectorAll("[data-loop-preview]")];

if (loopPreviewVideos.length) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const syncLoopPreview = (video, shouldPlay) => {
    if (prefersReducedMotion.matches) {
      video.pause();
      return;
    }

    if (shouldPlay) {
      const playResult = video.play();

      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(() => {});
      }
    } else {
      video.pause();
    }
  };

  const loopPreviewObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        syncLoopPreview(entry.target, entry.isIntersecting && entry.intersectionRatio > 0.45 && !document.hidden);
      });
    },
    { threshold: [0, 0.45, 0.75] }
  );

  loopPreviewVideos.forEach((video) => loopPreviewObserver.observe(video));

  document.addEventListener("visibilitychange", () => {
    loopPreviewVideos.forEach((video) => {
      const rect = video.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

      syncLoopPreview(video, isVisible && !document.hidden);
    });
  });
}
