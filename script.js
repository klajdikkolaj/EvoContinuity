const revealNodes = [...document.querySelectorAll('.card, .section-heading, .hero > *, .stat')];
revealNodes.forEach((node) => node.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealNodes.forEach((node) => observer.observe(node));
