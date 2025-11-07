// Mouse Effects - Hiệu ứng chuột mượt mà nâng cao
// Author: Bang Tran

class MouseEffects {
  constructor() {
    this.mouse = { x: 0, y: 0 };
    this.cursorPos = { x: 0, y: 0 };
    this.followerPos = { x: 0, y: 0 };
    this.cursor = null;
    this.cursorFollower = null;
    this.trailContainer = null;
    this.isHovering = false;
    this.animationFrame = null;
    this.lastTrailTime = 0;
    this.trailInterval = 16; // ~60fps cho trail
    this.init();
  }

  init() {
    // Chỉ chạy trên desktop
    if (window.innerWidth < 768) return;
    
    this.createCustomCursor();
    this.createCursorTrail();
    this.addHoverEffects();
    this.addClickWaveEffect();
    this.trackMouseMovement();
    this.startAnimationLoop();
  }

  // Tạo custom cursor đẹp hơn với GPU acceleration
  createCustomCursor() {
    // Main cursor
    this.cursor = document.createElement('div');
    this.cursor.className = 'mouse-cursor';
    document.body.appendChild(this.cursor);

    // Cursor follower (cursor lớn hơn theo sau)
    this.cursorFollower = document.createElement('div');
    this.cursorFollower.className = 'mouse-cursor-follower';
    document.body.appendChild(this.cursorFollower);

    // Style cho cursor - sử dụng will-change và transform
    const style = document.createElement('style');
    style.textContent = `
      .mouse-cursor {
        position: fixed;
        width: 12px;
        height: 12px;
        border: 2px solid var(--brand);
        border-radius: 50%;
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -50%);
        will-change: transform;
        mix-blend-mode: difference;
        opacity: 0;
        transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                    height 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                    border-color 0.2s ease,
                    background 0.2s ease;
      }

      .mouse-cursor.visible {
        opacity: 1;
      }

      .mouse-cursor.hover {
        width: 40px;
        height: 40px;
        border-color: var(--brand-3);
        background: rgba(221, 209, 233, 0.1);
      }

      .mouse-cursor.click {
        width: 20px;
        height: 20px;
        border-color: var(--brand-3);
        transform: translate(-50%, -50%) scale(0.9);
      }

      .mouse-cursor-follower {
        position: fixed;
        width: 40px;
        height: 40px;
        border: 1px solid rgba(221, 209, 233, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 99998;
        transform: translate(-50%, -50%);
        will-change: transform, width, height;
        mix-blend-mode: difference;
        opacity: 0;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                    height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.3s ease;
      }

      .mouse-cursor-follower.visible {
        opacity: 0.6;
      }

      .mouse-cursor-follower.hover {
        width: 80px;
        height: 80px;
        opacity: 0.4;
      }

      @media (hover: none) {
        .mouse-cursor,
        .mouse-cursor-follower {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Tạo trail container
  createCursorTrail() {
    this.trailContainer = document.createElement('div');
    this.trailContainer.className = 'cursor-trail-container';
    this.trailContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 99997;
      will-change: contents;
    `;
    document.body.appendChild(this.trailContainer);
  }

  // Linear interpolation để smooth movement
  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  // Easing function mượt mà hơn
  easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  // Animation loop chính - sử dụng RAF để mượt mà
  startAnimationLoop() {
    const animate = () => {
      // Smooth cursor movement - cursor chính follow ngay nhưng vẫn mượt
      const cursorLerp = 0.5; // Cursor chính mượt nhưng responsive
      this.cursorPos.x = this.lerp(this.cursorPos.x, this.mouse.x, cursorLerp);
      this.cursorPos.y = this.lerp(this.cursorPos.y, this.mouse.y, cursorLerp);

      // Smooth follower với lerp nhỏ hơn để có độ trễ mượt mà
      const followerLerp = 0.12; // Follower mượt mà hơn, trễ hơn
      this.followerPos.x = this.lerp(this.followerPos.x, this.mouse.x, followerLerp);
      this.followerPos.y = this.lerp(this.followerPos.y, this.mouse.y, followerLerp);

      // Sử dụng transform thay vì left/top để GPU acceleration
      this.cursor.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0) translate(-50%, -50%)`;
      this.cursorFollower.style.transform = `translate3d(${this.followerPos.x}px, ${this.followerPos.y}px, 0) translate(-50%, -50%)`;

      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  // Theo dõi chuyển động chuột - chỉ update position
  trackMouseMovement() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      // Show cursor ngay lập tức
      if (!this.cursor.classList.contains('visible')) {
        this.cursor.classList.add('visible');
        this.cursorFollower.classList.add('visible');
        // Set initial position để tránh jump
        this.cursorPos.x = e.clientX;
        this.cursorPos.y = e.clientY;
        this.followerPos.x = e.clientX;
        this.followerPos.y = e.clientY;
        // Update ngay để tránh delay
        this.cursor.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0) translate(-50%, -50%)`;
        this.cursorFollower.style.transform = `translate3d(${this.followerPos.x}px, ${this.followerPos.y}px, 0) translate(-50%, -50%)`;
      }

      // Throttle trail particles để không tạo quá nhiều
      const now = performance.now();
      if (now - this.lastTrailTime > this.trailInterval) {
        this.createTrailParticle(e.clientX, e.clientY);
        this.lastTrailTime = now;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      this.cursor.classList.remove('visible');
      this.cursorFollower.classList.remove('visible');
    });

    // Click effect với transform
    document.addEventListener('mousedown', () => {
      this.cursor.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
      this.cursor.classList.remove('click');
    });
  }

  // Tạo particle cho trail - tối ưu hơn
  createTrailParticle(x, y) {
    const particle = document.createElement('div');
    const size = 3 + Math.random() * 2;
    
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: var(--brand);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      opacity: 0.9;
      will-change: transform, opacity;
      z-index: 99996;
    `;
    
    this.trailContainer.appendChild(particle);

    // Sử dụng RAF để animate
    let startTime = performance.now();
    const duration = 400 + Math.random() * 200;
    const startX = x;
    const startY = y;
    const velocityX = (Math.random() - 0.5) * 20;
    const velocityY = (Math.random() - 0.5) * 20;

    const animateParticle = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = this.easeOutQuart(progress);

      const currentX = startX + velocityX * progress;
      const currentY = startY + velocityY * progress;
      const scale = 1 - progress;
      const opacity = 0.9 * (1 - progress);

      particle.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${scale})`;
      particle.style.opacity = opacity;

      if (progress < 1) {
        requestAnimationFrame(animateParticle);
      } else {
        particle.remove();
      }
    };

    requestAnimationFrame(animateParticle);
  }

  // Thêm hiệu ứng hover cho các elements
  addHoverEffects() {
    // Hover cho links và buttons
    const hoverElements = document.querySelectorAll('a, button, .btn, .card, .logo, .nav-links a');
    
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.isHovering = true;
        this.cursor.classList.add('hover');
        this.cursorFollower.classList.add('hover');
      }, { passive: true });

      el.addEventListener('mouseleave', () => {
        this.isHovering = false;
        this.cursor.classList.remove('hover');
        this.cursorFollower.classList.remove('hover');
      }, { passive: true });
    });

    // Hover cho images với transform
    const images = document.querySelectorAll('img, .g-card, .project .thumb');
    images.forEach(img => {
      img.style.willChange = 'transform';
      img.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.05) translateZ(0)';
      }, { passive: true });

      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1) translateZ(0)';
      }, { passive: true });
    });
  }

  // Tạo vòng tròn hover effect - sử dụng transform
  createHoverRing(element) {
    const rect = element.getBoundingClientRect();
    const ring = document.createElement('div');
    const size = Math.max(rect.width, rect.height);
    
    ring.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      width: ${size}px;
      height: ${size}px;
      border: 2px solid var(--brand-3);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
      will-change: transform, opacity;
      z-index: 99995;
      mix-blend-mode: difference;
    `;
    
    document.body.appendChild(ring);

    // Animate với RAF
    let startTime = performance.now();
    const duration = 400;

    const animateRing = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (progress < 0.5) {
        // Scale up
        const scale = this.easeOutQuart(progress * 2) * 1.5;
        const opacity = this.easeOutQuart(progress * 2) * 0.6;
        ring.style.transform = `translate(-50%, -50%) scale(${scale})`;
        ring.style.opacity = opacity;
        requestAnimationFrame(animateRing);
      } else {
        // Fade out
        const fadeProgress = (progress - 0.5) * 2;
        const scale = 1.5 + fadeProgress * 0.5;
        const opacity = 0.6 * (1 - fadeProgress);
        ring.style.transform = `translate(-50%, -50%) scale(${scale})`;
        ring.style.opacity = opacity;
        
        if (progress < 1) {
          requestAnimationFrame(animateRing);
        } else {
          ring.remove();
        }
      }
    };

    requestAnimationFrame(animateRing);
  }

  // Hiệu ứng sóng khi click - mượt mà hơn
  addClickWaveEffect() {
    document.addEventListener('click', (e) => {
      // Tạo vòng tròn lan tỏa với transform
      const wave = document.createElement('div');
      wave.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 0;
        height: 0;
        border: 2px solid var(--brand);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        opacity: 0.8;
        will-change: transform, opacity, width, height;
        z-index: 99994;
        mix-blend-mode: difference;
      `;
      
      document.body.appendChild(wave);

      // Animate với RAF
      let startTime = performance.now();
      const duration = 600;
      const maxSize = 200;

      const animateWave = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = this.easeOutQuart(progress);
        
        const size = maxSize * ease;
        const opacity = 0.8 * (1 - progress);
        const borderWidth = 2 - (progress * 1);

        wave.style.width = `${size}px`;
        wave.style.height = `${size}px`;
        wave.style.opacity = opacity;
        wave.style.borderWidth = `${borderWidth}px`;

        if (progress < 1) {
          requestAnimationFrame(animateWave);
        } else {
          wave.remove();
        }
      };

      requestAnimationFrame(animateWave);

      // Tạo particles khi click - ít hơn nhưng mượt hơn
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          this.createClickParticle(e.clientX, e.clientY, i);
        }, i * 20);
      }
    }, { passive: true });
  }

  // Tạo particles khi click - sử dụng transform
  createClickParticle(x, y, index) {
    const particle = document.createElement('div');
    const angle = (Math.PI * 2 * index) / 6;
    const distance = 60 + Math.random() * 40;
    const size = 5 + Math.random() * 3;
    
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: var(--brand-3);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      opacity: 1;
      will-change: transform, opacity;
      z-index: 99993;
      box-shadow: 0 0 10px var(--brand);
    `;
    
    document.body.appendChild(particle);

    const targetX = x + Math.cos(angle) * distance;
    const targetY = y + Math.sin(angle) * distance;

    // Animate với RAF
    let startTime = performance.now();
    const duration = 700;

    const animateParticle = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = this.easeOutQuart(progress);
      
      const currentX = x + (targetX - x) * ease;
      const currentY = y + (targetY - y) * ease;
      const scale = 1 - progress;
      const opacity = 1 - progress;

      particle.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${scale})`;
      particle.style.opacity = opacity;

      if (progress < 1) {
        requestAnimationFrame(animateParticle);
      } else {
        particle.remove();
      }
    };

    requestAnimationFrame(animateParticle);
  }

  // Cleanup khi component bị destroy
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.cursor) this.cursor.remove();
    if (this.cursorFollower) this.cursorFollower.remove();
    if (this.trailContainer) this.trailContainer.remove();
  }
}

// Initialize mouse effects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Kiểm tra xem có phải mobile không
  if (window.innerWidth >= 768 && !('ontouchstart' in window)) {
    window.mouseEffects = new MouseEffects();
  }
});

// Re-initialize on resize (nếu chuyển từ mobile sang desktop)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.mouseEffects) {
      window.mouseEffects.destroy();
      window.mouseEffects = null;
    }
    if (window.innerWidth >= 768 && !('ontouchstart' in window)) {
      window.mouseEffects = new MouseEffects();
    }
  }, 300);
});
