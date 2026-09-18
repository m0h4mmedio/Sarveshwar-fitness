const CONFIG = {
  phone: 'tel:+918433650068',
  whatsapp: '918433650068',
  directions: 'Sarveshwar Fitness, Kurla West, Mumbai',
  membershipPlans: [
    { duration: '1 Month', cardioPrice: 'PRICE TO BE UPDATED', nonCardioPrice: 'PRICE TO BE UPDATED', cardio: ['DETAILS TO BE UPDATED'], nonCardio: ['DETAILS TO BE UPDATED'] },
    { duration: '3 Months', cardioPrice: 'PRICE TO BE UPDATED', nonCardioPrice: 'PRICE TO BE UPDATED', cardio: ['DETAILS TO BE UPDATED'], nonCardio: ['DETAILS TO BE UPDATED'] },
    { duration: '6 Months', cardioPrice: 'PRICE TO BE UPDATED', nonCardioPrice: 'PRICE TO BE UPDATED', cardio: ['DETAILS TO BE UPDATED'], nonCardio: ['DETAILS TO BE UPDATED'] },
    { duration: '12 Months', cardioPrice: 'PRICE TO BE UPDATED', nonCardioPrice: 'PRICE TO BE UPDATED', cardio: ['DETAILS TO BE UPDATED'], nonCardio: ['DETAILS TO BE UPDATED'] }
  ]
};

const recordEvent = (type, label) => {
  const events = JSON.parse(localStorage.getItem('sf_events') || '[]');
  events.push({ type, label, path: location.pathname, time: new Date().toISOString() });
  localStorage.setItem('sf_events', JSON.stringify(events.slice(-500)));
};

const replaceBrandMarksWithLogo = () => document.querySelectorAll('.mark').forEach((mark) => {
  const img = document.createElement('img'); img.src = 'logo.png'; img.alt = 'Sarveshwar Fitness logo'; img.className = 'mark logo-mark'; img.loading = 'eager'; img.decoding = 'async'; img.style.objectFit = 'contain'; mark.replaceWith(img);
});

const setContactLinks = () => {
  document.querySelectorAll('[data-call]').forEach((link) => { link.href = CONFIG.phone; link.addEventListener('click', () => recordEvent('call_click', 'Phone call clicked')); });
  document.querySelectorAll('[data-wa]').forEach((link) => { link.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Hi Sarveshwar Fitness, I would like to enquire about membership.')}`; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.addEventListener('click', () => recordEvent('whatsapp_click', 'WhatsApp clicked')); });
  const directions = document.querySelector('#directions');
  if (directions) { directions.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.directions)}`; directions.addEventListener('click', () => recordEvent('directions_click', 'Directions clicked')); }
};

const plans = document.querySelector('#plans');
function render(type = 'cardio') {
  if (!plans) return;
  const planType = type === 'nonCardio' ? 'nonCardio' : 'cardio';
  plans.innerHTML = CONFIG.membershipPlans.map((plan, index) => `<article class="plan ${index === 3 ? 'featured' : ''}"><div class="duration">${plan.duration}</div><div class="price">${plan[planType + 'Price']}</div><ul>${plan[planType].map(item => `<li>+ ${item}</li>`).join('')}</ul><a class="btn ${index === 3 ? 'white' : 'dark'}" href="#contact" data-plan="${plan.duration}">ENQUIRE NOW ↗</a></article>`).join('');
  plans.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => recordEvent('plan_click', `Membership plan: ${button.dataset.plan}`)));
}

const loadImageWithFallback = (element) => {
  const basePath = element.dataset.img || ''; const rootPath = basePath.replace(/^\.?\/?images\//i, '');
  const candidates = [...new Set([rootPath, basePath, rootPath.includes('equipment-02') ? 'equipment-02.jpg.jpg' : '', rootPath.includes('equipment-04') ? 'equipment-04.jpg' : ''])].filter(Boolean);
  const tryLoad = (index = 0) => { if (!candidates[index]) return; const image = new Image(); image.onload = () => { element.style.backgroundImage = `linear-gradient(#0001, #0001), url("${candidates[index]}")`; element.querySelector('span')?.style.setProperty('display', 'none'); }; image.onerror = () => tryLoad(index + 1); image.src = candidates[index]; };
  tryLoad();
};

const addVisualFixes = () => { const style = document.createElement('style'); style.textContent = `html{scroll-behavior:smooth;scroll-padding-top:82px}body{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}.heroContent h1{font-size:clamp(3.25rem,8.5vw,7.75rem)}h2{font-size:clamp(2.75rem,5.8vw,6.5rem)}p{font-size:clamp(1rem,1.15vw,1.18rem)}.section small,.heroContent small,.final small{font-size:clamp(.78rem,1vw,.95rem)}.btn{font-size:clamp(.8rem,1vw,.95rem)}@media(max-width:760px){html{scroll-padding-top:70px}.heroContent h1{font-size:clamp(3rem,14vw,4.75rem)}h2{font-size:clamp(2.4rem,11vw,4.25rem)}p{font-size:1rem}.section small,.heroContent small,.final small{font-size:.78rem}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`; document.head.appendChild(style); };

addVisualFixes(); recordEvent('page_view', 'Website page viewed'); replaceBrandMarksWithLogo(); setContactLinks(); render();
document.querySelectorAll('.toggle button').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.toggle button').forEach(item => item.classList.remove('active')); button.classList.add('active'); render(button.dataset.type); recordEvent('plan_toggle', `Plan type: ${button.dataset.type}`); }));
const nav = document.querySelector('.nav'); if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
const hamburger = document.querySelector('.hamb'); const mobileMenu = document.querySelector('.mobilemenu'); if (hamburger && mobileMenu) { hamburger.addEventListener('click', () => { const isOpen = mobileMenu.classList.toggle('open'); hamburger.setAttribute('aria-expanded', String(isOpen)); }); mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => mobileMenu.classList.remove('open'))); }
const revealElements = document.querySelectorAll('.reveal'); if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .1 }); revealElements.forEach(element => observer.observe(element)); } else revealElements.forEach(element => element.classList.add('visible'));
document.querySelectorAll('[data-img]').forEach(loadImageWithFallback);
const lightbox = document.querySelector('.lightbox'); const lightboxImage = lightbox?.querySelector('img'); if (lightbox && lightboxImage) { document.querySelectorAll('.gallery .g').forEach(item => item.addEventListener('click', () => { const image = new Image(); image.onload = () => { lightboxImage.src = item.dataset.img; lightbox.classList.add('open'); recordEvent('gallery_view', 'Gallery image opened'); }; image.src = item.dataset.img; })); const close = () => { lightbox.classList.remove('open'); lightboxImage.removeAttribute('src'); }; lightbox.querySelector('button')?.addEventListener('click', close); lightbox.addEventListener('click', event => { if (event.target === lightbox) close(); }); document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); }); }
