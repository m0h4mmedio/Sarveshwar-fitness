const CONFIG = {
  phone: 'tel:+918433650068',
  whatsapp: '918433650068',
  directions: 'Sarveshwar Fitness, Kurla West, Mumbai',
  membershipPlans: [
    {
      duration: '1 Month',
      cardioPrice: 'PRICE TO BE UPDATED',
      nonCardioPrice: 'PRICE TO BE UPDATED',
      cardio: ['DETAILS TO BE UPDATED'],
      nonCardio: ['DETAILS TO BE UPDATED']
    },
    {
      duration: '3 Months',
      cardioPrice: 'PRICE TO BE UPDATED',
      nonCardioPrice: 'PRICE TO BE UPDATED',
      cardio: ['DETAILS TO BE UPDATED'],
      nonCardio: ['DETAILS TO BE UPDATED']
    },
    {
      duration: '6 Months',
      cardioPrice: 'PRICE TO BE UPDATED',
      nonCardioPrice: 'PRICE TO BE UPDATED',
      cardio: ['DETAILS TO BE UPDATED'],
      nonCardio: ['DETAILS TO BE UPDATED']
    },
    {
      duration: '12 Months',
      cardioPrice: 'PRICE TO BE UPDATED',
      nonCardioPrice: 'PRICE TO BE UPDATED',
      cardio: ['DETAILS TO BE UPDATED'],
      nonCardio: ['DETAILS TO BE UPDATED']
    }
  ]
};

const replaceBrandMarksWithLogo = () => {
  document.querySelectorAll('.mark').forEach((mark) => {
    const img = document.createElement('img');
    img.src = 'logo.png';
    img.alt = 'Sarveshwar Fitness logo';
    img.className = 'mark logo-mark';
    img.loading = 'eager';
    img.decoding = 'async';
    img.style.objectFit = 'contain';
    mark.replaceWith(img);
  });
};

const setContactLinks = () => {
  document.querySelectorAll('[data-call]').forEach((link) => {
    link.href = CONFIG.phone;
  });

  document.querySelectorAll('[data-wa]').forEach((link) => {
    link.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
      'Hi Sarveshwar Fitness, I would like to enquire about membership.'
    )}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  const directions = document.querySelector('#directions');
  if (directions) {
    directions.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      CONFIG.directions
    )}`;
  }
};

const plans = document.querySelector('#plans');

function render(type = 'cardio') {
  if (!plans) return;

  const planType = type === 'nonCardio' ? 'nonCardio' : 'cardio';
  plans.innerHTML = CONFIG.membershipPlans
    .map((plan, index) => {
      const list = plan[planType] || [];
      const price = planType === 'cardio' ? plan.cardioPrice : plan.nonCardioPrice;
      const featured = index === 3 ? 'featured' : '';
      const buttonStyle = index === 3 ? 'white' : 'dark';

      return `
        <article class="plan ${featured}">
          <div class="duration">${plan.duration}</div>
          <div class="price">${price}</div>
          <ul>${list.map((item) => `<li>+ ${item}</li>`).join('')}</ul>
          <a class="btn ${buttonStyle}" href="#contact">ENQUIRE NOW ↗</a>
        </article>`;
    })
    .join('');
}

const loadImageWithFallback = (element) => {
  const basePath = element.dataset.img || '';
  const candidates = Array.from(new Set([
    basePath,
    basePath.replace(/\.jpg$/i, '.jpg'),
    basePath.replace(/\.png$/i, '.png'),
    basePath.startsWith('equipment-') && basePath.includes('04') ? 'equipment-04.jpg' : '',
    basePath.includes('equipment-02') ? 'equipment-02.jpg.jpg' : '',
    basePath.includes('equipment-04') ? 'equipment-04.jpg' : ''
  ])).filter(Boolean);

  const tryLoad = (index = 0) => {
    if (!candidates[index]) return;

    const image = new Image();
    image.onload = () => {
      element.style.backgroundImage = `linear-gradient(#0001, #0001), url("${candidates[index]}")`;
      const placeholder = element.querySelector('span');
      if (placeholder) placeholder.style.display = 'none';
    };
    image.onerror = () => {
      if (index < candidates.length - 1) tryLoad(index + 1);
    };
    image.src = candidates[index];
  };

  tryLoad();
};

replaceBrandMarksWithLogo();
setContactLinks();
render();

document.querySelectorAll('.toggle button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.toggle button').forEach((item) => {
      item.classList.remove('active');
    });
    button.classList.add('active');
    render(button.dataset.type);
  });
});

const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener(
    'scroll',
    () => nav.classList.toggle('scrolled', window.scrollY > 40),
    { passive: true }
  );
}

const hamburger = document.querySelector('.hamb');
const mobileMenu = document.querySelector('.mobilemenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

document.querySelectorAll('[data-img]').forEach((element) => {
  loadImageWithFallback(element);
});

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox?.querySelector('img');

if (lightbox && lightboxImage) {
  document.querySelectorAll('.gallery .g').forEach((galleryItem) => {
    galleryItem.addEventListener('click', () => {
      const image = new Image();
      image.onload = () => {
        lightboxImage.src = galleryItem.dataset.img;
        lightbox.classList.add('open');
      };
      image.src = galleryItem.dataset.img;
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightboxImage.removeAttribute('src');
  };

  lightbox.querySelector('button')?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
}
