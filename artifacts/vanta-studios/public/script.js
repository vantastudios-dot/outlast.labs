document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // --- 1. Mobile Navigation Drawer ---
  const menuBtn = document.getElementById('menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const labelVisible = document.querySelector('.MenuToggleButton-module-scss-module__qv1k1W__plainLabelVisible');
  const labelHidden = document.querySelector('.MenuToggleButton-module-scss-module__qv1k1W__plainLabelHidden');
  const menuIcon = document.querySelector('.MenuToggleButton-module-scss-module__qv1k1W__plainArrowClip');

  if (menuBtn && mobileDrawer) {
    const toggleMenu = () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      if (isOpen) {
        labelVisible.style.transform = 'translateY(-100%)';
        labelHidden.style.transform = 'translateY(-100%)';
        menuIcon.style.transform = 'rotate(45deg)';
      } else {
        labelVisible.style.transform = 'translateY(0)';
        labelHidden.style.transform = 'translateY(100%)';
        menuIcon.style.transform = 'rotate(0)';
      }
    };
    
    menuBtn.addEventListener('click', toggleMenu);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', toggleMenu);
    
    // Close menu when links are clicked
    const drawerLinks = document.querySelectorAll('.Nav-module-scss-module__Ui4UsW__drawerLink');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('open')) toggleMenu();
      });
    });
  }

  // --- 2. Preloader Animation & Entrance Flow ---
  const preloaderWhiteLogo = document.querySelector('.Preloader-module-scss-module__EOTTSG__whiteLogo');
  const preloaderRoot = document.querySelector('.Preloader-module-scss-module__EOTTSG__root');
  const preloaderBackdrop = document.querySelector('.Preloader-module-scss-module__EOTTSG__backdrop');
  const mainPage = document.querySelector('.HomePage-module-scss-module__vQrwUa__page');

  let loadProgress = 0;
  
  const simulateLoading = () => {
    const interval = setInterval(() => {
      loadProgress += Math.floor(Math.random() * 10) + 5;
      if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(interval);
        
        // Update clip path to show full white logo
        if (preloaderWhiteLogo) {
          preloaderWhiteLogo.style.clipPath = `inset(0% 0 0 0)`;
        }
        
        // Let logo sit for 300ms before fading out preloader
        setTimeout(triggerPageReveal, 350);
      } else {
        if (preloaderWhiteLogo) {
          preloaderWhiteLogo.style.clipPath = `inset(${100 - loadProgress}% 0 0 0)`;
        }
      }
    }, 60);
  };

  const triggerPageReveal = () => {
    // 1. Fade/Blur out preloader elements
    gsap.to([preloaderRoot, preloaderBackdrop], {
      opacity: 0,
      filter: 'blur(16px)',
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        if (preloaderRoot) preloaderRoot.style.display = 'none';
        if (preloaderBackdrop) preloaderBackdrop.style.display = 'none';
        
        // Remove preloading flag to start page motion
        if (mainPage) mainPage.removeAttribute('data-preloading');
        
        // Trigger Hero entrance timeline
        triggerHeroEntrance();
      }
    });
  };

  simulateLoading();

  // --- 3. Hero Entrance Animations ---
  const triggerHeroEntrance = () => {
    const heroTl = gsap.timeline();
    
    // Animate lines in heading
    heroTl.fromTo('#hero .heading [data-text-reveal-inner]', 
      { filter: 'blur(14px)', opacity: 0, y: 30 },
      { filter: 'blur(0px)', opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15 }
    );
    
    // Fade in subtitle and button
    heroTl.fromTo(['#hero .subtitle', '#hero .button-wrap'], 
      { filter: 'blur(8px)', opacity: 0, y: 16 },
      { filter: 'blur(0px)', opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 },
      '-=0.6'
    );
    
    // Fade in hero grid footer content
    heroTl.fromTo('#hero .footer-wrap', 
      { filter: 'blur(8px)', opacity: 0, y: 12 },
      { filter: 'blur(0px)', opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    );
  };

  // --- 4. Lenis Smooth Scrolling ---
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1.0,
    smoothTouch: false,
    touchMultiplier: 2.0,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // --- 4.5. Custom Scroll-Linked Parallax & Layout Animations ---

  // Hero Scroll Parallax
  const heroSection = document.getElementById('hero');
  const heroContent = document.querySelector('#hero .content');
  if (heroSection) {
    gsap.to(heroSection, {
      y: 500,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }
  if (heroContent) {
    gsap.to(heroContent, {
      y: -180,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Approach Section Cards Horizontal Translation
  const mm = gsap.matchMedia();
  mm.add("(min-width: 1025px)", () => {
    const approachSection = document.getElementById('approach');
    const cardsContainer = document.querySelector('#approach .cards');
    if (approachSection && cardsContainer) {
      const getShiftWidth = () => {
        return approachSection.offsetWidth * 0.9;
      };

      gsap.fromTo(cardsContainer,
        { x: () => getShiftWidth() },
        {
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: approachSection,
            start: '30% 70%',
            end: '50% 50%',
            scrub: true,
            invalidateOnRefresh: true
          }
        }
      );
    }
  });

  // Mobile/Tablet Approach Cards Fallback Stagger/Fade
  mm.add("(max-width: 1024px)", () => {
    const revealCards = document.querySelectorAll('#approach .reveal-card');
    revealCards.forEach((card) => {
      gsap.fromTo(card,
        { y: 40, opacity: 0.8 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'top 75%',
            scrub: true
          }
        }
      );
    });
  });

  // Dedicated Section Pills Orbiting Scroll Animation (Spinning when scrolling)
  const dedicatedSection = document.getElementById('dedicated');
  const pillsContainer = document.querySelector('#dedicated .container.dedicated-oval .pills');
  if (dedicatedSection && pillsContainer) {
    const pills = pillsContainer.querySelectorAll('.pill');
    let containerWidth = pillsContainer.offsetWidth;
    let containerHeight = pillsContainer.offsetHeight;

    const updateContainerDimensions = () => {
      containerWidth = pillsContainer.offsetWidth;
      containerHeight = pillsContainer.offsetHeight;
    };
    window.addEventListener('resize', updateContainerDimensions);

    // Position all pills at center initially (JS mode)
    pills.forEach(pill => {
      pill.style.left = '50%';
      pill.style.top = '50%';
    });

    const dedicatedTrigger = ScrollTrigger.create({
      trigger: '#dedicated',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    });

    let clockVal = 0;
    let lastTime = performance.now();

    function animatePills(timestamp) {
      let delta = timestamp - lastTime;
      lastTime = timestamp;

      // Only update positions if window active and section visible
      if (document.visibilityState !== 'hidden' && containerWidth > 0) {
        clockVal += delta;

        let g = dedicatedTrigger ? dedicatedTrigger.progress : 0;
        let rx = 0.55 * containerWidth;
        let ry = 0.34 * containerHeight;

        let v = g * 2.25 * Math.PI;
        let N = 1.15 * v * (1 + 0.45 * g);
        let b = clockVal * 0.000095;
        let orbitPhase = b + N;

        pills.forEach((pill, index) => {
          let baseAngle = (index / pills.length) * 2 * Math.PI - Math.PI / 2;
          let angle = baseAngle + orbitPhase;
          let px = Math.cos(angle) * rx;
          let py = Math.sin(angle) * ry;

          // Custom drift and rotation physics
          let c = 3.2 * Math.sin(0.00105 * clockVal + 2.4 * baseAngle) + 1.2 * Math.sin(0.00062 * clockVal + 1.1 * baseAngle);
          let u = 2.8 * Math.cos(0.00098 * clockVal + 1.85 * baseAngle) + 1.1 * Math.cos(0.00055 * clockVal + 3.2 * baseAngle);
          let h = 2.4 * Math.sin(0.00078 * clockVal + 3.6 * baseAngle) + 1.1 * Math.cos(0.00045 * clockVal + baseAngle);

          pill.style.transform = `translate(-50%, -50%) translate(${px + c}px, ${py + u}px) rotate(${h}deg)`;
        });
      }

      requestAnimationFrame(animatePills);
    }

    requestAnimationFrame(animatePills);
  }

  // Stats Card Staggered Parallax
  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statCards = statsSection.querySelectorAll('.stat-card');
    const startY = [40, 60, 80, 100];
    statCards.forEach((card, index) => {
      gsap.fromTo(card,
        { y: startY[index] || 40 },
        {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: statsSection,
            start: 'top bottom',
            end: 'center center',
            scrub: true
          }
        }
      );
    });
  }

  // --- 5. Scroll-Linked Text Reveals (Consolidated Selector) ---
  const textReveals = document.querySelectorAll('[data-text-reveal-inner]');
  textReveals.forEach((element) => {
    // Avoid triggering hero text since it is handled by the entrance timeline
    if (element.closest('#hero')) return;
    
    gsap.fromTo(element,
      { filter: 'blur(14px)', opacity: 0, y: 22 },
      {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // --- 6. Scroll-Linked Background Theme Switcher ---
  // Sections toggle the light class on the body
  ScrollTrigger.create({
    trigger: '#approach',
    start: 'top 50%',
    end: 'bottom 50%',
    onEnter: () => document.body.classList.add('light-theme'),
    onLeaveBack: () => document.body.classList.remove('light-theme'),
  });

  ScrollTrigger.create({
    trigger: '#dedicated',
    start: 'top 50%',
    end: 'bottom 50%',
    onEnter: () => document.body.classList.add('light-theme'),
    onLeaveBack: () => document.body.classList.add('light-theme'), // stays light
  });

  ScrollTrigger.create({
    trigger: '#whyus',
    start: 'top 50%',
    end: 'bottom 50%',
    onEnter: () => document.body.classList.remove('light-theme'),
    onLeaveBack: () => document.body.classList.add('light-theme'),
  });

  ScrollTrigger.create({
    trigger: '#work',
    start: 'top 50%',
    end: 'bottom 50%',
    onEnter: () => document.body.classList.remove('light-theme'),
    onLeaveBack: () => document.body.classList.add('light-theme'),
  });

  ScrollTrigger.create({
    trigger: '#stats',
    start: 'top 50%',
    end: 'bottom 50%',
    onEnter: () => document.body.classList.add('light-theme'),
    onLeaveBack: () => document.body.classList.remove('light-theme'),
  });

  // Keep it light for stats, pricing, cta
  ScrollTrigger.create({
    trigger: '#cta',
    start: 'bottom 50%',
    onEnter: () => document.body.classList.remove('light-theme'), // Reverts to dark for footer plax
    onLeaveBack: () => document.body.classList.add('light-theme'),
  });

  // --- 7. Dedicated Team Mobile Marquee ---
  const mobileMarqueeWrap = document.querySelector('.dedicated-marquee-wrap');
  if (mobileMarqueeWrap) {
    const desktopPills = document.querySelectorAll('.dedicated-oval .pill');
    const marqueeContainer = document.createElement('div');
    marqueeContainer.className = 'rfm-marquee-container';
    
    // We duplicate the list of pills multiple times to make sure it fills screen width and loops seamlessly
    let marqueeHTML = '<div class="rfm-marquee" style="display: flex; gap: 0.75rem; white-space: nowrap; animation: mobile-marquee-scroll 15s linear infinite;">';
    
    const appendPillList = () => {
      desktopPills.forEach(pill => {
        const bg = pill.style.backgroundColor;
        marqueeHTML += `<div class="pill" style="background-color: ${bg}">${pill.textContent}</div>`;
      });
    };
    
    appendPillList();
    appendPillList();
    appendPillList(); // duplicate three times
    
    marqueeHTML += '</div>';
    marqueeContainer.innerHTML = marqueeHTML;
    mobileMarqueeWrap.appendChild(marqueeContainer);
  }

  // --- 8. Infinite Draggable Brand Marquee (Footer of Dedicated) ---
  const marqueeList = document.querySelector('.draggable-marquee__list');

  if (marqueeList) {
    let xPos = 0;
    const speed = 1.2; // px per frame
    let isDragging = false;
    let lastMouseX = 0;
    let velocity = 0;
    let halfWidth = 0;

    // Compute halfWidth lazily so images are loaded
    const getHalfWidth = () => {
      if (!halfWidth) halfWidth = marqueeList.scrollWidth / 2;
      return halfWidth;
    };

    gsap.ticker.add(() => {
      const hw = getHalfWidth();
      if (!isDragging) {
        xPos -= speed + velocity;
        velocity *= 0.9;
      }
      // Seamless wrap at the halfway point
      if (xPos <= -hw) xPos += hw;
      if (xPos > 0) xPos -= hw;
      gsap.set(marqueeList, { x: xPos });
    });

    const onMouseDown = (e) => {
      isDragging = true;
      lastMouseX = e.clientX;
      velocity = 0;
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastMouseX;
      xPos += dx;
      velocity = dx * 0.3;
      lastMouseX = e.clientX;
    };
    const onMouseUp = () => { isDragging = false; };

    marqueeList.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support
    marqueeList.addEventListener('touchstart', (e) => {
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      velocity = 0;
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - lastMouseX;
      xPos += dx;
      velocity = dx * 0.3;
      lastMouseX = e.touches[0].clientX;
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
  }

  // --- 9. FAQ Accordion Toggle Logic ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      if (isOpen) {
        // Animate open
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        // Animate closed
        answer.style.maxHeight = '0';
      }
      
      // Close other open FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });
    });
  });

  // --- 10. Sticky Footer Parallax Fading ---
  const footerOverlay = document.querySelector('.Footer-module-scss-module__JLT4gq__overlay');
  if (footerOverlay) {
    gsap.to(footerOverlay, {
      opacity: 0,
      scrollTrigger: {
        trigger: '#footer-plax',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true
      }
    });
  }

  // Animate bottom footer logotype in
  gsap.fromTo('.Footer-module-scss-module__JLT4gq__logotype-wrap',
    { yPercent: 100 },
    {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#footer-plax',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true
      }
    }
  );

  // --- 12. Unicorn Studio WebGL Initialization ---
  if (window.UnicornStudio) {
    const sceneEl = document.getElementById('unicorn-BX9TXhOJpVNQUH431cnU');
    if (sceneEl) {
      sceneEl.style.opacity = 1;
    }
    window.UnicornStudio.init({ scale: 1, dpi: 1.5 })
      .then(scenes => {
        console.log('Unicorn Studio initialized scenes:', scenes);
      })
      .catch(err => {
        console.error('Failed to initialize Unicorn Studio WebGL player:', err);
      });
  }

  // --- 13. Dynamic Porto Clock ---
  const updatePortoTime = () => {
    const timeSpan = document.querySelector('.location span span');
    if (timeSpan) {
      const options = {
        timeZone: 'Europe/Lisbon',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      timeSpan.textContent = formatter.format(new Date());
    }
  };
  updatePortoTime();
  setInterval(updatePortoTime, 60000);

  // --- 14. Work Card Page Transitions ---
  const pageOverlay = document.getElementById('page-transition-overlay');
  document.querySelectorAll('.work-card-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      if (pageOverlay) {
        pageOverlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 620);
      } else {
        window.location.href = href;
      }
    });
  });

});
