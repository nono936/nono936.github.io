const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
const sceneButton = document.querySelector('.scene-button');
const languageButton = document.querySelector('.language-button');
const copyButton = document.querySelector('.copy-button');
const toast = document.querySelector('.toast');
const clock = document.querySelector('#live-clock');

const updateClock = () => {
  clock.textContent = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(new Date());
};
updateClock();
window.setInterval(updateClock, 1000);

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
  document.body.classList.toggle('day-scene');
  sceneButton.textContent = document.body.classList.contains('day-scene') ? '◐' : '☼';
});
languageButton.addEventListener('click', () => {
  const english = languageButton.dataset.mode === 'en';
  languageButton.dataset.mode = english ? 'zh' : 'en';
  languageButton.innerHTML = english ? '<span>◎</span> 繁' : '<span>◎</span> EN';
});

copyButton.addEventListener('click', async () => {
  const email = copyButton.dataset.email;
  try { await navigator.clipboard.writeText(email); toast.textContent = '信箱已複製'; }
  catch { toast.textContent = email; }
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2200);
});

document.querySelector('#year').textContent = new Date().getFullYear();

const navLinks = [...document.querySelectorAll('.nav a')];
const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-40% 0px -50%', threshold: 0 });
document.querySelectorAll('main section[id]').forEach((section) => activeSectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
