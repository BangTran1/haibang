// Advanced Interactive Effects for Portfolio
// Author: Bang Tran

class AdvancedEffects {
  constructor() {
    this.init();
  }

  init() {
    this.initMagneticButtons();
    this.initTextReveal();
    this.initImageParallax();
    this.initScrollProgress();
    this.initGlitchEffect();
    this.initParticleTrail();
    this.initSoundEffects();
  }

  // Magnetic button effect
  initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.btn, .card, .logo');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0)';
      });
    });
  }

  // Text reveal effect on scroll
  initTextReveal() {
    const textElements = document.querySelectorAll('h1, h2, h3, p');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.revealText(entry.target);
        }
      });
    }, { threshold: 0.1 });

    textElements.forEach(el => observer.observe(el));
  }

  revealText(element) {
    const text = element.textContent;
    element.innerHTML = '';
    
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.textContent = text[i];
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      span.style.transition = `all 0.1s ease ${i * 0.02}s`;
      element.appendChild(span);
      
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      }, i * 20);
    }
  }

  // Image parallax effect - tối ưu với throttling
  initImageParallax() {
    const images = document.querySelectorAll('.g-card img, .project .thumb img');
    let ticking = false;
    
    const updateImageParallax = () => {
      const scrolled = window.pageYOffset;
      
      images.forEach((img, index) => {
        const rate = scrolled * 0.05 * (index % 2 === 0 ? 1 : -1); // Giảm sensitivity
        img.style.transform = `translate3d(0, ${rate}px, 0)`;
      });
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateImageParallax);
        ticking = true;
      }
    });
  }

  // Scroll progress indicator
  initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    
    const style = document.createElement('style');
    style.textContent = `
      .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(255, 255, 255, 0.1);
        z-index: 1000;
      }
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--brand), var(--brand-3));
        width: 0%;
        transition: width 0.1s ease;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      
      progressBar.querySelector('.progress-fill').style.width = `${progress}%`;
    });
  }

  // Glitch effect for special elements
  initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.gradient-text, .logo');
    
    glitchElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.triggerGlitch(element);
      });
    });
  }

  triggerGlitch(element) {
    const originalText = element.textContent;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let iterations = 0;
    const interval = setInterval(() => {
      element.textContent = element.textContent
        .split('')
        .map((char, index) => {
          if (index < iterations) return originalText[index];
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        })
        .join('');
      
      if (iterations >= originalText.length) {
        clearInterval(interval);
        element.textContent = originalText;
      }
      
      iterations += 1 / 3;
    }, 30);
  }

  // Particle trail effect - tối ưu performance
  initParticleTrail() {
    // Chỉ chạy trên desktop và thiết bị mạnh
    if (window.innerWidth < 1024 || navigator.hardwareConcurrency < 4) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;
    document.body.appendChild(canvas);

    const particles = [];
    const mouse = { x: 0, y: 0 };
    let frameCount = 0;

    // Throttle mouse events
    let mouseTimeout;
    canvas.addEventListener('mousemove', (e) => {
      if (mouseTimeout) return;
      mouseTimeout = setTimeout(() => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Giảm số particles tạo ra
        if (particles.length < 50) {
          particles.push({
            x: mouse.x,
            y: mouse.y,
            vx: (Math.random() - 0.5) * 1, // Giảm velocity
            vy: (Math.random() - 0.5) * 1,
            life: 1,
            decay: 0.03 // Tăng decay để particles biến mất nhanh hơn
          });
        }
        mouseTimeout = null;
      }, 16);
    });

    function animate() {
      // Chỉ update mỗi 2 frame để giảm tải
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life -= particle.decay;
          
          if (particle.life > 0) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2); // Giảm kích thước
            ctx.fillStyle = `rgba(221, 209, 233, ${particle.life * 0.5})`; // Giảm opacity
            ctx.fill();
          } else {
            particles.splice(index, 1);
          }
        });
      }
      
      frameCount++;
      requestAnimationFrame(animate);
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
  }

  // Sound effects (optional)
  initSoundEffects() {
    // Only enable if user hasn't disabled audio
    if (localStorage.getItem('soundEnabled') !== 'false') {
      this.createAudioContext();
    }
  }

  createAudioContext() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create subtle sound effects for interactions
    const playTone = (frequency, duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };

    // Add sound to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        playTone(800, 0.1);
      });
    });
  }
}

// Initialize advanced effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check performance monitor and device capabilities
  const shouldInitialize = 
    window.innerWidth > 768 && 
    !window.performanceMonitor?.isLowEnd();
  
  if (shouldInitialize) {
    new AdvancedEffects();
  }
});
