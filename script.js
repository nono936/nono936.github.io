const body = document.body;
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
const sceneButton = document.querySelector('.scene-button');
const copyButton = document.querySelector('.copy-button');
const toast = document.querySelector('.toast');
const clock = document.querySelector('#live-clock');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateClock = () => {
  clock.textContent = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(new Date());
};
updateClock();
setInterval(updateClock, 1000);
document.querySelector('#year').textContent = new Date().getFullYear();

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}));
sceneButton.addEventListener('click', () => {
  body.classList.toggle('day-scene');
  sceneButton.textContent = body.classList.contains('day-scene') ? '◐' : '☼';
});
copyButton.addEventListener('click', async () => {
  const email = copyButton.dataset.email;
  try { await navigator.clipboard.writeText(email); toast.textContent = '信箱已複製'; }
  catch { toast.textContent = email; }
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});

const navLinks = [...document.querySelectorAll('.nav a')];
const dotLinks = [...document.querySelectorAll('.chapter-dots a')];
const observedSections = [...document.querySelectorAll('.story-section[id]')];
const chapterObserver = new IntersectionObserver((entries) => {
  const current = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
  if (!current) return;
  const id = `#${current.target.id}`;
  navLinks.forEach((link) => link.classList.toggle('active', link.hash === id || (id === '#home' && link.hash === '#overworld')));
  dotLinks.forEach((link) => link.classList.toggle('active', link.hash === id));
}, { threshold: [.25,.5,.7] });
observedSections.forEach((section) => chapterObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

let ticking = false;
const paintScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  const ratio = max > 0 ? scrollY / max : 0;
  document.documentElement.style.setProperty('--progress', `${ratio * 100}%`);
  if (!reducedMotion) {
    document.querySelectorAll('[data-parallax]').forEach((scene) => {
      const section = scene.parentElement;
      const rect = section.getBoundingClientRect();
      const offset = Math.max(-1, Math.min(1, rect.top / innerHeight));
      scene.style.transform = `translate3d(0, ${offset * 5}%, 0) scale(1.04)`;
    });
  }
  ticking = false;
};
addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(paintScroll); ticking = true; }
}, { passive: true });
paintScroll();

const canvas = document.querySelector('#starfield');
const context = canvas.getContext('2d');
let stars = [];
const resizeStars = () => {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(canvas.clientWidth * ratio);
  canvas.height = Math.round(canvas.clientHeight * ratio);
  stars = Array.from({ length: Math.floor(canvas.clientWidth / 7) }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 1.4 * ratio + .2, a: Math.random() * .65 + .2
  }));
  context.clearRect(0,0,canvas.width,canvas.height);
  stars.forEach((star) => { context.beginPath(); context.arc(star.x,star.y,star.r,0,Math.PI*2); context.fillStyle=`rgba(255,255,255,${star.a})`; context.fill(); });
};
resizeStars();
addEventListener('resize', resizeStars);
