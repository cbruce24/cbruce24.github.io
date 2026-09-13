const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.project, .timeline article, .about-copy').forEach((el) => {
  el.style.opacity = '0'; el.style.transform = 'translateY(24px)'; el.style.transition = 'opacity .6s ease, transform .6s ease'; reveal.observe(el);
});
const style = document.createElement('style');
style.textContent = '.visible{opacity:1!important;transform:none!important}';
document.head.appendChild(style);
