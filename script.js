// Portfolio Interactive Effects & Three.js Integration
// Author: Bang Tran

class PortfolioEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initScrollEffects();
    this.initTypingEffect();
    this.initCursorEffects();
    this.initParallax();
    this.initThemeToggle();
    this.initSmoothScrolling();
    this.initLoadingAnimation();
  }

  // Smooth scrolling for navigation links
  initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Scroll-triggered animations - tối ưu performance
  initScrollEffects() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Sử dụng requestAnimationFrame để tối ưu
          requestAnimationFrame(() => {
            entry.target.classList.add('animate-in');
            
            // Special effects for different sections
            if (entry.target.classList.contains('skill')) {
              this.animateSkillBars(entry.target);
            }
            
            if (entry.target.classList.contains('project')) {
              this.animateProjectCard(entry.target);
            }
          });
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.skill, .project, .g-card, .about-card');
    elementsToAnimate.forEach(el => observer.observe(el));
  }

  // Animate skill bars on scroll
  animateSkillBars(skillElement) {
    const bar = skillElement.querySelector('.bar span');
    if (bar) {
      const percentage = bar.style.getPropertyValue('--pct');
      bar.style.setProperty('--pct', '0%');
      setTimeout(() => {
        bar.style.setProperty('--pct', percentage);
      }, 200);
    }
  }

  // Animate project cards
  animateProjectCard(projectElement) {
    projectElement.style.transform = 'translateY(30px) scale(0.95)';
    projectElement.style.opacity = '0';
    
    setTimeout(() => {
      projectElement.style.transition = 'all 0.6s cubic-bezier(0.2, 0.6, 0.2, 1)';
      projectElement.style.transform = 'translateY(0) scale(1)';
      projectElement.style.opacity = '1';
    }, 100);
  }

  // Typing effect for hero text
  initTypingEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if (!heroTitle) return;

    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    };

    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
  }

  // Custom cursor effects - Disabled (using mouse-effects.js instead)
  initCursorEffects() {
    // Cursor effects are now handled by mouse-effects.js
    // This function is kept for compatibility but does nothing
    return;
  }

  // Parallax effects - tối ưu với throttling
  initParallax() {
    const parallaxElements = document.querySelectorAll('.blob, .hero .preview');
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3; // Giảm sensitivity
      
      parallaxElements.forEach((el, index) => {
        const speed = (index + 1) * 0.05; // Giảm tốc độ
        el.style.transform = `translate3d(0, ${rate * speed}px, 0)`;
      });
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  // Theme toggle functionality
  initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', () => {
      if (themeToggle.checked) {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Loading animation
  initLoadingAnimation() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <div class="loader-text">Loading...</div>
      </div>
    `;

    const loaderStyle = document.createElement('style');
    loaderStyle.textContent = `
      .page-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
      }
      
      .loader-content {
        text-align: center;
      }
      
      .loader-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top: 3px solid var(--brand);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      }
      
      .loader-text {
        color: var(--text);
        font-weight: 600;
        letter-spacing: 1px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(loaderStyle);
    document.body.appendChild(loader);

    // Hide loader when page is loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.remove();
        }, 500);
      }, 1000);
    });
  }

  // Setup event listeners
  setupEventListeners() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) rotateX(2deg)';
        card.style.boxShadow = 'var(--shadow-lg)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0deg)';
        card.style.boxShadow = 'var(--shadow)';
      });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(rippleStyle);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioEffects();
});

// Add CSS for scroll animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  .skill, .project, .g-card, .about-card {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.2, 0.6, 0.2, 1);
  }
  
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  .hero h1 {
    overflow: hidden;
  }
  
  .hero h1 span {
    display: inline-block;
    animation: slideInUp 0.6s ease forwards;
  }
  
  @keyframes slideInUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(animationStyles);
