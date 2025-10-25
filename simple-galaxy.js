// Simple Galaxy Background - Fallback version
// Author: Bang Tran

class SimpleGalaxy {
  constructor() {
    this.init();
  }

  init() {
    this.createGalaxyBackground();
    this.createStars();
    this.createNebula();
    this.createShootingStars();
    this.animate();
  }

  createGalaxyBackground() {
    // Tạo container cho galaxy
    this.galaxyContainer = document.createElement('div');
    this.galaxyContainer.className = 'simple-galaxy';
    this.galaxyContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
      pointer-events: none;
      background: radial-gradient(ellipse at center, 
        rgba(221, 209, 233, 0.1) 0%, 
        rgba(62, 55, 70, 0.05) 30%, 
        rgba(10, 11, 18, 0.8) 70%, 
        #0a0b12 100%);
      overflow: hidden;
    `;
    document.body.appendChild(this.galaxyContainer);
  }

  createStars() {
    // Tạo nhiều ngôi sao với CSS
    const starCount = window.innerWidth > 768 ? 200 : 100;
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 3;
      const duration = Math.random() * 2 + 2;
      
      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: #ddd1e9;
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        box-shadow: 0 0 ${size * 2}px #ddd1e9;
        animation: twinkle ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        opacity: ${Math.random() * 0.8 + 0.2};
      `;
      
      this.galaxyContainer.appendChild(star);
    }

    // Thêm CSS animation
    if (!document.querySelector('#star-animations')) {
      const style = document.createElement('style');
      style.id = 'star-animations';
      style.textContent = `
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2);
          }
        }
        
        @keyframes shootingStar {
          0% {
            transform: translateX(-100px) translateY(-100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(100vh);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  createShootingStars() {
    // Tạo sao băng
    setInterval(() => {
      this.createShootingStar();
    }, 2000 + Math.random() * 3000);
  }

  createShootingStar() {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    
    const startX = Math.random() * 50;
    const startY = Math.random() * 50;
    
    shootingStar.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: linear-gradient(45deg, #fff, #ddd1e9);
      border-radius: 50%;
      left: ${startX}%;
      top: ${startY}%;
      box-shadow: 0 0 10px #ddd1e9;
      animation: shootingStar 2s linear forwards;
    `;
    
    this.galaxyContainer.appendChild(shootingStar);
    
    // Xóa sau animation
    setTimeout(() => {
      if (shootingStar.parentNode) {
        shootingStar.parentNode.removeChild(shootingStar);
      }
    }, 2000);
  }

  createNebula() {
    // Tạo tinh vân với CSS
    const nebulaCount = 3;
    
    for (let i = 0; i < nebulaCount; i++) {
      const nebula = document.createElement('div');
      nebula.className = 'nebula';
      
      const size = Math.random() * 300 + 200;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const hue = Math.random() * 60 + 240; // Purple to blue
      
      nebula.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, 
          hsla(${hue}, 70%, 60%, 0.1) 0%, 
          hsla(${hue + 20}, 50%, 40%, 0.05) 50%, 
          transparent 100%);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        animation: nebulaFloat ${Math.random() * 10 + 15}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      
      this.galaxyContainer.appendChild(nebula);
    }

    // Thêm CSS animation cho nebula
    if (!document.querySelector('#nebula-animations')) {
      const style = document.createElement('style');
      style.id = 'nebula-animations';
      style.textContent = `
        @keyframes nebulaFloat {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: translate(20px, -20px) scale(1.1);
            opacity: 0.6;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  animate() {
    // Animation loop đơn giản
    const animate = () => {
      // Có thể thêm các hiệu ứng khác ở đây
      requestAnimationFrame(animate);
    };
    animate();
  }
}

// Initialize ngay lập tức
document.addEventListener('DOMContentLoaded', () => {
  new SimpleGalaxy();
});
