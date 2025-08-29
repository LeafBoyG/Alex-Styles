// Page transition effect
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && href.includes(window.location.origin)) {
      e.preventDefault();
      document.querySelector('.page-transition').classList.add('active');
      setTimeout(() => window.location = href, 600);
    }
  });
});

// Scroll reveal for project cards
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = `${i * 0.1}s`;
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card').forEach(card => observer.observe(card));
