// Scroll-triggered animations and interactions
class ScrollAnimator {
  constructor() {
    this.sections = document.querySelectorAll('section');
    this.stages = document.querySelectorAll('.stage');
    this.heroElements = document.querySelectorAll('.hero-title .word, .hero-subtitle, .hero-cta');
    this.navItems = document.querySelectorAll('.nav-link');
    this.ctaButtons = document.querySelectorAll('.cta-button');
    this.showcaseStages = document.querySelectorAll('.showcase-stages .stage');
    
    this.observers = [];
    this.currentSection = 0;
    this.isScrolling = false;
    
    this.init();
  }
  
  init() {
    this.setupScrollObserver();
    this.setupHeroAnimation();
    this.setupStageObserver();
    this.setupShowcaseObserver();
    this.setupNavObserver();
    this.setupCTAButtons();
    this.setupSmoothScroll();
    this.setupParallax();
    
    // Initial hero animation
    this.animateHero();
  }
  
  setupScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.updateActiveNav(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '-50px 0px -50px 0px'
    });
    
    this.sections.forEach(section => observer.observe(section));
    this.observers.push(observer);
  }
  
  setupHeroAnimation() {
    // Initial hero animation
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    
    if (heroTitle) {
      const words = heroTitle.querySelectorAll('.word');
      words.forEach((word, i) => {
        word.style.opacity = '0';
        word.style.transform = 'translateY(100%)';
        word.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;
      });
    }
    
    if (heroSubtitle) {
      heroSubtitle.style.opacity = '0';
      heroSubtitle.style.transform = 'translateY(30px)';
      heroSubtitle.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s';
    }
    
    if (heroCta) {
      heroCta.style.opacity = '0';
      heroCta.style.transform = 'translateY(30px)';
      heroCta.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s';
    }
  }
  
  animateHero() {
    const words = document.querySelectorAll('.hero-title .word');
    const subtitle = document.querySelector('.hero-subtitle');
    const cta = document.querySelector('.hero-cta');
    
    words.forEach((word, i) => {
      setTimeout(() => {
        word.style.opacity = '1';
        word.style.transform = 'translateY(0)';
      }, i * 100);
    });
    
    setTimeout(() => {
      if (subtitle) {
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'translateY(0)';
      }
    }, 400);
    
    setTimeout(() => {
      if (cta) {
        cta.style.opacity = '1';
        cta.style.transform = 'translateY(0)';
      }
    }, 600);
  }
  
  setupStageObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });
    
    this.stages.forEach(stage => observer.observe(stage));
    this.observers.push(observer);
  }
  
  setupShowcaseObserver() {
    const showcase = document.querySelector('.showcase');
    if (!showcase) return;
    
    let activeStage = 0;
    const stages = document.querySelectorAll('.showcase-stages .stage');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progress = entry.intersectionRatio;
          const stageIndex = Math.floor(progress * stages.length);
          
          if (stageIndex !== activeStage && stageIndex < stages.length) {
            stages.forEach((s, i) => {
              s.classList.toggle('active', i === stageIndex);
            });
            activeStage = stageIndex;
          }
        }
      });
    }, {
      threshold: Array.from({ length: 20 }, (_, i) => i / 20),
      rootMargin: '0px'
    });
    
    observer.observe(showcase);
    this.observers.push(observer);
  }
  
  setupNavObserver() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '-50% 0px -50% 0px'
    });
    
    this.sections.forEach(section => observer.observe(section));
    this.observers.push(observer);
  }
  
  updateActiveNav(section) {
    const id = section.id;
    this.navItems.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  }
  
  setupCTAButtons() {
    this.ctaButtons.forEach(button => {
      button.addEventListener('mouseenter', (e) => {
        this.createRipple(e, button);
      });
      
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const href = button.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            this.smoothScrollTo(target);
          }
        }
      });
    });
  }
  
  createRipple(event, button) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }
  
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          this.smoothScrollTo(target);
        }
      });
    });
  }
  
  smoothScrollTo(target) {
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
  
  setupParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const grid = document.querySelector('.hero-grid');
    
    if (!hero || !heroContent) return;
    
    let ticking = false;
    
    const updateParallax = () => {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;
      const progress = Math.min(scrollY / heroHeight, 1);
      
      if (progress < 1) {
        heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
        heroContent.style.opacity = 1 - progress * 0.5;
        
        if (grid) {
          grid.style.transform = `translateY(${scrollY * 0.15}px)`;
        }
      }
      
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }
  
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
  }
}

// Mouse trail effect
class MouseTrail {
  constructor() {
    this.trails = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.maxTrails = 20;
    
    this.init();
  }
  
  init() {
    this.createTrails();
    this.bindEvents();
    this.animate();
  }
  
  createTrails() {
    for (let i = 0; i < this.maxTrails; i++) {
      const trail = document.createElement('div');
      trail.className = 'mouse-trail';
      trail.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent);
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0);
        transition: opacity 0.1s ease, transform 0.1s ease;
      `;
      document.body.appendChild(trail);
      this.trails.push({
        element: trail,
        x: 0,
        y: 0,
        delay: i * 0.02
      });
    }
  }
  
  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }
  
  animate() {
    this.trails.forEach((trail, index) => {
      const targetX = this.mouseX;
      const targetY = this.mouseY;
      
      trail.x += (targetX - trail.x) * 0.15;
      trail.y += (targetY - trail.y) * 0.15;
      
      trail.element.style.transform = `translate(${trail.x}px, ${trail.y}px) scale(${1 - index * 0.04})`;
      trail.element.style.opacity = `${0.8 - index * 0.035}`;
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Text reveal animation
class TextReveal {
  constructor() {
    this.elements = document.querySelectorAll('[data-reveal]');
    this.init();
  }
  
  init() {
    this.elements.forEach(el => this.setupElement(el));
    this.observe();
  }
  
  setupElement(el) {
    const text = el.textContent;
    const type = el.dataset.reveal || 'word';
    
    el.innerHTML = '';
    el.style.overflow = 'hidden';
    
    if (type === 'word') {
      const words = text.split(' ');
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(100%)';
        span.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`;
        span.textContent = word + (i < words.length - 1 ? ' ' : '');
        el.appendChild(span);
      });
    } else if (type === 'char') {
      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(100%)';
        span.style.transition = `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.02}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.02}s`;
        span.textContent = char === ' ' ? '\u00A0' : char;
        el.appendChild(span);
      });
    }
  }
  
  observe() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const spans = entry.target.querySelectorAll('span');
          spans.forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    this.elements.forEach(el => observer.observe(el));
  }
}

// Floating orbs background
class FloatingOrbs {
  constructor() {
    this.orbs = [];
    this.container = null;
    this.init();
  }
  
  init() {
    this.container = document.createElement('div');
    this.container.className = 'floating-orbs';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    `;
    
    document.body.prepend(this.container);
    this.createOrbs();
    this.animate();
  }
  
  createOrbs() {
    const colors = [
      'var(--accent)',
      '#8b5cf6',
      '#ec4899',
      '#06b6d4'
    ];
    
    for (let i = 0; i < 8; i++) {
      const orb = document.createElement('div');
      const size = Math.random() * 300 + 200;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      orb.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, ${color}40, transparent 70%);
        filter: blur(80px);
        opacity: ${Math.random() * 0.3 + 0.1};
        animation: float ${Math.random() * 20 + 20}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      
      this.container.appendChild(orb);
      this.orbs.push(orb);
    }
    
    // Add keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(100px, -50px) scale(1.1); }
        50% { transform: translate(-50px, 100px) scale(0.9); }
        75% { transform: translate(-100px, -100px) scale(1.05); }
      }
    `;
    document.head.appendChild(style);
  }
  
  animate() {
    // Orbs animate via CSS
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Theming (light/dark) is now handled entirely by the
  // @media (prefers-color-scheme) rules in styles.css — no JS needed.

  // Initialize components
  const scrollAnimator = new ScrollAnimator();
  const textReveal = new TextReveal();
  const floatingOrbs = new FloatingOrbs();
  
  // Optional: Mouse trail (can be disabled for performance)
  // const mouseTrail = new MouseTrail();
  
  // Handle reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
  }
});

// Scroll progress indicator
(function() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), #8b5cf6);
    z-index: 10000;
    transform-origin: left;
    transform: scaleX(0);
    box-shadow: 0 0 20px var(--accent);
  `;
  document.body.appendChild(progressBar);
  
  let ticking = false;
  
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;
    progressBar.style.transform = `scaleX(${progress})`;
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
})();