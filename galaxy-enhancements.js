// Galaxy Enhancements for Realistic Galaxy
// Author: Bang Tran

class GalaxyEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.createAsteroidField();
    this.createComet();
    this.createSpaceDust();
    this.createGalaxyGlow();
    this.createPlanetRings();
  }

  createAsteroidField() {
    const asteroidContainer = document.createElement('div');
    asteroidContainer.className = 'asteroid-field';
    asteroidContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(asteroidContainer);

    // Create asteroids
    for (let i = 0; i < 50; i++) {
      const asteroid = document.createElement('div');
      asteroid.className = 'asteroid';
      
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 20 + 10;
      
      asteroid.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: #666;
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        animation: asteroidFloat ${duration}s linear infinite;
        animation-delay: ${delay}s;
        opacity: 0.6;
      `;
      
      asteroidContainer.appendChild(asteroid);
    }

    // Add CSS animation
    if (!document.querySelector('#asteroid-animations')) {
      const style = document.createElement('style');
      style.id = 'asteroid-animations';
      style.textContent = `
        @keyframes asteroidFloat {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(100vw) translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  createComet() {
    const cometContainer = document.createElement('div');
    cometContainer.className = 'comet-container';
    cometContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(cometContainer);

    // Create comet periodically
    setInterval(() => {
      this.createCometTrail(cometContainer);
    }, 8000 + Math.random() * 12000);

    // Add CSS animation
    if (!document.querySelector('#comet-animations')) {
      const style = document.createElement('style');
      style.id = 'comet-animations';
      style.textContent = `
        @keyframes cometMove {
          0% {
            transform: translateX(-200px) translateY(-200px);
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
        
        .comet {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #fff 0%, #ddd1e9 50%, transparent 100%);
          border-radius: 50%;
          box-shadow: 0 0 20px #ddd1e9;
        }
        
        .comet::after {
          content: '';
          position: absolute;
          top: 2px;
          left: -50px;
          width: 50px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ddd1e9, #fff);
          border-radius: 2px;
        }
      `;
      document.head.appendChild(style);
    }
  }

  createCometTrail(container) {
    const comet = document.createElement('div');
    comet.className = 'comet';
    
    const startX = Math.random() * 50;
    const startY = Math.random() * 50;
    
    comet.style.cssText = `
      left: ${startX}%;
      top: ${startY}%;
      animation: cometMove 4s linear forwards;
    `;
    
    container.appendChild(comet);
    
    // Remove comet after animation
    setTimeout(() => {
      if (comet.parentNode) {
        comet.parentNode.removeChild(comet);
      }
    }, 4000);
  }

  createSpaceDust() {
    const dustContainer = document.createElement('div');
    dustContainer.className = 'space-dust';
    dustContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      background-image: 
        radial-gradient(1px 1px at 20px 30px, rgba(221, 209, 233, 0.3), transparent),
        radial-gradient(1px 1px at 40px 70px, rgba(168, 149, 201, 0.2), transparent),
        radial-gradient(1px 1px at 90px 40px, rgba(221, 209, 233, 0.2), transparent),
        radial-gradient(1px 1px at 130px 80px, rgba(168, 149, 201, 0.3), transparent),
        radial-gradient(1px 1px at 160px 30px, rgba(221, 209, 233, 0.2), transparent),
        radial-gradient(1px 1px at 200px 60px, rgba(168, 149, 201, 0.3), transparent);
      background-repeat: repeat;
      background-size: 200px 200px;
      animation: dustMove 60s linear infinite;
    `;
    document.body.appendChild(dustContainer);

    // Add CSS animation
    if (!document.querySelector('#dust-animations')) {
      const style = document.createElement('style');
      style.id = 'dust-animations';
      style.textContent = `
        @keyframes dustMove {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-200px) translateY(-200px); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  createGalaxyGlow() {
    const glowContainer = document.createElement('div');
    glowContainer.className = 'galaxy-glow';
    glowContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 600px;
      height: 600px;
      margin: -300px 0 0 -300px;
      pointer-events: none;
      z-index: -1;
      background: radial-gradient(ellipse at center, 
        rgba(221, 209, 233, 0.1) 0%, 
        rgba(168, 149, 201, 0.05) 30%, 
        transparent 70%);
      border-radius: 50%;
      animation: galaxyGlow 8s ease-in-out infinite;
    `;
    document.body.appendChild(glowContainer);

    // Add CSS animation
    if (!document.querySelector('#glow-animations')) {
      const style = document.createElement('style');
      style.id = 'glow-animations';
      style.textContent = `
        @keyframes galaxyGlow {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.1);
            opacity: 0.6;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  createPlanetRings() {
    const ringsContainer = document.createElement('div');
    ringsContainer.className = 'planet-rings';
    ringsContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(ringsContainer);

    // Create ring for gas giant
    const ring = document.createElement('div');
    ring.className = 'planet-ring';
    ring.style.cssText = `
      position: absolute;
      top: 20%;
      right: 10%;
      width: 80px;
      height: 80px;
      border: 2px solid rgba(168, 149, 201, 0.3);
      border-radius: 50%;
      animation: ringRotate 20s linear infinite;
    `;
    ringsContainer.appendChild(ring);

    // Add CSS animation
    if (!document.querySelector('#ring-animations')) {
      const style = document.createElement('style');
      style.id = 'ring-animations';
      style.textContent = `
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .planet-ring::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border: 1px solid rgba(221, 209, 233, 0.2);
          border-radius: 50%;
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Initialize galaxy enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on desktop for performance
  const shouldInitialize = 
    window.innerWidth > 768 && 
    !window.performanceMonitor?.isLowEnd();
  
  if (shouldInitialize) {
    new GalaxyEnhancements();
  }
});

