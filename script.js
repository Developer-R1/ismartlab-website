
document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const loader = document.getElementById('loader');
  const loaderText = document.querySelector('.loader-text');

  if (prefersReducedMotion) {
    loader.style.display = 'none';
  } else {
    gsap.timeline()
      .to(loaderText, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      .to(loaderText, { opacity: 1, duration: 0.4 }) // brief hold
      .to(loader, {
        opacity: 0, duration: 0.6, ease: 'power2.inOut',
        onComplete: () => { loader.style.display = 'none'; playHeroIntro(); }
      });
  }
  if (prefersReducedMotion) playHeroIntro();

  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('.nav-link-item').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  const sections = document.querySelectorAll('section[id], header[id]');
  const navItems = document.querySelectorAll('.nav-link-item');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === `#${current}`);
    });
  });

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isTouch) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'; });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, [data-tilt], .team-card').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.width = '54px'; ring.style.height = '54px'; ring.style.borderColor = 'rgba(76,201,240,0.9)'; });
      el.addEventListener('mouseleave', () => { ring.style.width = '34px'; ring.style.height = '34px'; ring.style.borderColor = 'rgba(76,201,240,0.5)'; });
    });
  }

  const canvas = document.getElementById('gridCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, t = 0;

  function resizeCanvas() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function drawGrid() {
    ctx.clearRect(0, 0, w, h);
    const spacing = 42;
    const offset = (t % spacing);
    ctx.fillStyle = 'rgba(76, 201, 240, 0.35)';
    for (let x = -spacing; x < w + spacing; x += spacing) {
      for (let y = -spacing; y < h + spacing; y += spacing) {
        const px = x + offset * 0.15;
        const py = y + offset * 0.1;
        ctx.beginPath();
        ctx.arc(px, py, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (!prefersReducedMotion) {
      t += 0.6;
      requestAnimationFrame(drawGrid);
    }
  }
  drawGrid();

  function playHeroIntro() {
    if (prefersReducedMotion) {
      gsap.set('[data-anim]', { opacity: 1, y: 0 });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('[data-anim="hero-eyebrow"]', { opacity: 0, y: 16, duration: 0.5 })
      .from('.hero-title .line', { yPercent: 120, opacity: 0, duration: 0.8, stagger: 0.12 }, '-=0.2')
      .from('[data-anim="hero-fade"]', { opacity: 0, y: 24, duration: 0.6, stagger: 0.15 }, '-=0.35');
  }

  gsap.utils.toArray('.section-head').forEach(head => {
    gsap.from(head, {
      opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: head, start: 'top 85%' }
    });
  });

  gsap.utils.toArray('.feature-grid').forEach(grid => {
    gsap.from(grid.children, {
      opacity: 0, y: 50, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top 82%' }
    });
  });

  gsap.utils.toArray('.equip-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 40, duration: 0.6, delay: (i % 6) * 0.05, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 90%', containerAnimation: undefined }
    });
  });

  gsap.utils.toArray('.team-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 50, scale: 0.96, duration: 0.7, delay: (i % 4) * 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 88%' }
    });
  });

  gsap.from('.footer-brand, .footer-links > div', {
    opacity: 0, y: 30, duration: 0.6, stagger: 0.08,
    scrollTrigger: { trigger: '.site-footer', start: 'top 90%' }
  });

  if (!isTouch && !prefersReducedMotion) {
    const tiltEls = document.querySelectorAll('[data-tilt]');
    tiltEls.forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(el, { rotateX: py * -8, rotateY: px * 8, transformPerspective: 700, duration: 0.4, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
      });
    });

    const brochureInner = document.querySelector('.brochure-card-inner');
    const brochureCard = document.getElementById('brochureCard');
    if (brochureCard) {
      brochureCard.addEventListener('mousemove', e => {
        const rect = brochureCard.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(brochureInner, { rotateX: py * -10, rotateY: px * 10, duration: 0.4, ease: 'power2.out' });
      });
      brochureCard.addEventListener('mouseleave', () => {
        gsap.to(brochureInner, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
      });
    }
  }

  if (isTouch) {
    document.querySelectorAll('.team-card').forEach(card => {
      card.addEventListener('click', () => {
        const wasOpen = card.classList.contains('is-open');
        document.querySelectorAll('.team-card.is-open').forEach(c => c.classList.remove('is-open'));
        if (!wasOpen) card.classList.add('is-open');
      });
    });
  }

});


function updateVisitCount() {

    const workspace = "civil-ismart-lab-website-v1"; 
    const key = "landing-page-views";

  fetch(`https://api.counterapi.dev/v1/civil-ismart-lab-website-v1/landing-page-views/up`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // 3. CounterAPI returns data in count format
      const visitCountElement = document.getElementById('visitCount');
      if (visitCountElement && data.count !== undefined) {
        visitCountElement.innerText = data.count.toLocaleString();
      }
    })
    .catch(error => {
      console.error('Error fetching view count:', error);
      const visitCountElement = document.getElementById('visitCount');
      if (visitCountElement) {
        visitCountElement.innerText = '1,240+'; 
      }
    });
}

document.addEventListener('DOMContentLoaded', updateVisitCount);
