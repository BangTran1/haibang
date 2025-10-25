// Galaxy Special Effects
// Author: Bang Tran

class GalaxyEffects {
  constructor() {
    this.init();
  }

  init() {
    this.createShootingStars();
    this.createConstellationLines();
    this.createPulsingStars();
    this.createGalaxyRotation();
  }

  createShootingStars() {
    const shootingStarContainer = document.createElement('div');
    shootingStarContainer.className = 'shooting-stars';
    shootingStarContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(shootingStarContainer);

    // Create shooting stars periodically
    setInterval(() => {
      this.createShootingStar(shootingStarContainer);
    }, 3000 + Math.random() * 5000); // Random interval between 3-8 seconds
  }

  createShootingStar(container) {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: linear-gradient(45deg, #fff, #ddd1e9);
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd1e9;
      top: ${Math.random() * 50}%;
      left: ${Math.random() * 100}%;
      animation: shootingStar 2s linear forwards;
    `;

    // Add CSS animation
    if (!document.querySelector('#shooting-star-style')) {
      const style = document.createElement('style');
      style.id = 'shooting-star-style';
      style.textContent = `
        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateX(200px) translateY(200px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    container.appendChild(star);

    // Remove star after animation
    setTimeout(() => {
      if (star.parentNode) {
        star.parentNode.removeChild(star);
      }
    }, 2000);
  }

  createConstellationLines() {
    const constellationContainer = document.createElement('div');
    constellationContainer.className = 'constellation-lines';
    constellationContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.3;
    `;
    document.body.appendChild(constellationContainer);

    // Create constellation patterns
    const constellations = [
      { x1: 20, y1: 20, x2: 40, y2: 30, x3: 60, y3: 25 },
      { x1: 80, y1: 15, x2: 85, y2: 35, x3: 90, y3: 20 },
      { x1: 15, y1: 70, x2: 25, y2: 80, x3: 35, y3: 75 },
      { x1: 70, y1: 60, x2: 80, y2: 70, x3: 90, y3: 65 }
    ];

    constellations.forEach((constellation, index) => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      `;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', `${constellation.x1}%`);
      line.setAttribute('y1', `${constellation.y1}%`);
      line.setAttribute('x2', `${constellation.x2}%`);
      line.setAttribute('y2', `${constellation.y2}%`);
      line.setAttribute('stroke', '#ddd1e9');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('opacity', '0.4');

      const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line2.setAttribute('x1', `${constellation.x2}%`);
      line2.setAttribute('y1', `${constellation.y2}%`);
      line2.setAttribute('x2', `${constellation.x3}%`);
      line2.setAttribute('y2', `${constellation.y3}%`);
      line2.setAttribute('stroke', '#ddd1e9');
      line2.setAttribute('stroke-width', '1');
      line2.setAttribute('opacity', '0.4');

      svg.appendChild(line);
      svg.appendChild(line2);
      constellationContainer.appendChild(svg);

      // Add pulsing animation
      svg.style.animation = `constellationPulse ${3 + index}s ease-in-out infinite`;
    });

    // Add CSS animation
    if (!document.querySelector('#constellation-style')) {
      const style = document.createElement('style');
      style.id = 'constellation-style';
      style.textContent = `
        @keyframes constellationPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  createPulsingStars() {
    const pulsingContainer = document.createElement('div');
    pulsingContainer.className = 'pulsing-stars';
    pulsingContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(pulsingContainer);

    // Create pulsing stars
    for (let i = 0; i < 20; i++) {
      const star = document.createElement('div');
      star.className = 'pulsing-star';
      star.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: #ddd1e9;
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        box-shadow: 0 0 ${Math.random() * 10 + 5}px #ddd1e9;
        animation: starPulse ${Math.random() * 3 + 2}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
      `;
      pulsingContainer.appendChild(star);
    }

    // Add CSS animation
    if (!document.querySelector('#pulsing-star-style')) {
      const style = document.createElement('style');
      style.id = 'pulsing-star-style';
      style.textContent = `
        @keyframes starPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  createGalaxyRotation() {
    // Add subtle rotation to the entire galaxy background
    const galaxyBackground = document.querySelector('.galaxy-background');
    if (galaxyBackground) {
      galaxyBackground.style.animation = 'galaxyRotate 300s linear infinite';
    }

    // Add CSS animation
    if (!document.querySelector('#galaxy-rotation-style')) {
      const style = document.createElement('style');
      style.id = 'galaxy-rotation-style';
      style.textContent = `
        @keyframes galaxyRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Initialize galaxy effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on desktop for performance
  const shouldInitialize = 
    window.innerWidth > 768 && 
    !window.performanceMonitor?.isLowEnd();
  
  if (shouldInitialize) {
    new GalaxyEffects();
  }
});

