// Universe Special Effects
// Author: Bang Tran

class UniverseEffects {
  constructor() {
    this.init();
  }

  init() {
    this.createStarField();
    this.createMeteorShower();
    this.createAurora();
    this.createSpaceDust();
    this.createConstellations();
    this.createPulsars();
  }

  createStarField() {
    const starFieldContainer = document.createElement('div');
    starFieldContainer.className = 'star-field';
    starFieldContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(starFieldContainer);

    // Tạo ngôi sao với hiệu ứng mờ dần
    for (let i = 0; i < 200; i++) {
      const star = document.createElement('div');
      star.className = 'star-field-star';
      
      const size = Math.random() * 4 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const distance = Math.random() * 100;
      const opacity = Math.max(0.1, 1 - (distance / 100));
      const delay = Math.random() * 5;
      const duration = Math.random() * 3 + 2;
      
      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, #fff 0%, #ddd1e9 50%, transparent 100%);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        opacity: ${opacity};
        box-shadow: 0 0 ${size * 3}px #ddd1e9;
        animation: starTwinkle ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
      `;
      
      starFieldContainer.appendChild(star);
    }

    // Thêm CSS animation
    if (!document.querySelector('#star-field-animations')) {
      const style = document.createElement('style');
      style.id = 'star-field-animations';
      style.textContent = `
        @keyframes starTwinkle {
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

  createMeteorShower() {
    const meteorContainer = document.createElement('div');
    meteorContainer.className = 'meteor-shower';
    meteorContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(meteorContainer);

    // Tạo sao băng ngẫu nhiên
    setInterval(() => {
      this.createMeteor(meteorContainer);
    }, 1000 + Math.random() * 3000);

    // Thêm CSS animation
    if (!document.querySelector('#meteor-animations')) {
      const style = document.createElement('style');
      style.id = 'meteor-animations';
      style.textContent = `
        @keyframes meteorFall {
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
        
        .meteor {
          position: absolute;
          width: 3px;
          height: 3px;
          background: radial-gradient(circle, #fff 0%, #ddd1e9 50%, transparent 100%);
          border-radius: 50%;
          box-shadow: 0 0 15px #ddd1e9;
        }
        
        .meteor::after {
          content: '';
          position: absolute;
          top: 1.5px;
          left: -60px;
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ddd1e9, #fff);
          border-radius: 2px;
        }
      `;
      document.head.appendChild(style);
    }
  }

  createMeteor(container) {
    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    
    const startX = Math.random() * 50;
    const startY = Math.random() * 50;
    
    meteor.style.cssText = `
      left: ${startX}%;
      top: ${startY}%;
      animation: meteorFall 3s linear forwards;
    `;
    
    container.appendChild(meteor);
    
    // Xóa meteor sau animation
    setTimeout(() => {
      if (meteor.parentNode) {
        meteor.parentNode.removeChild(meteor);
      }
    }, 3000);
  }

  createAurora() {
    const auroraContainer = document.createElement('div');
    auroraContainer.className = 'aurora';
    auroraContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      background: 
        radial-gradient(ellipse at 20% 20%, rgba(0, 255, 150, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(150, 0, 255, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 10%, rgba(0, 150, 255, 0.1) 0%, transparent 50%);
      animation: auroraMove 15s ease-in-out infinite;
    `;
    document.body.appendChild(auroraContainer);

    // Thêm CSS animation
    if (!document.querySelector('#aurora-animations')) {
      const style = document.createElement('style');
      style.id = 'aurora-animations';
      style.textContent = `
        @keyframes auroraMove {
          0%, 100% { 
            transform: translateX(0) translateY(0) scale(1);
            opacity: 0.3;
          }
          25% { 
            transform: translateX(20px) translateY(-10px) scale(1.1);
            opacity: 0.6;
          }
          50% { 
            transform: translateX(-10px) translateY(20px) scale(0.9);
            opacity: 0.8;
          }
          75% { 
            transform: translateX(15px) translateY(10px) scale(1.05);
            opacity: 0.5;
          }
        }
      `;
      document.head.appendChild(style);
    }
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
        radial-gradient(1px 1px at 20px 30px, rgba(221, 209, 233, 0.4), transparent),
        radial-gradient(1px 1px at 40px 70px, rgba(168, 149, 201, 0.3), transparent),
        radial-gradient(1px 1px at 90px 40px, rgba(221, 209, 233, 0.3), transparent),
        radial-gradient(1px 1px at 130px 80px, rgba(168, 149, 201, 0.4), transparent),
        radial-gradient(1px 1px at 160px 30px, rgba(221, 209, 233, 0.3), transparent),
        radial-gradient(1px 1px at 200px 60px, rgba(168, 149, 201, 0.4), transparent),
        radial-gradient(1px 1px at 240px 20px, rgba(221, 209, 233, 0.3), transparent),
        radial-gradient(1px 1px at 280px 50px, rgba(168, 149, 201, 0.4), transparent),
        radial-gradient(1px 1px at 320px 80px, rgba(221, 209, 233, 0.3), transparent),
        radial-gradient(1px 1px at 360px 40px, rgba(168, 149, 201, 0.4), transparent);
      background-repeat: repeat;
      background-size: 300px 300px;
      animation: dustMove 80s linear infinite;
    `;
    document.body.appendChild(dustContainer);

    // Thêm CSS animation
    if (!document.querySelector('#dust-animations')) {
      const style = document.createElement('style');
      style.id = 'dust-animations';
      style.textContent = `
        @keyframes dustMove {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-300px) translateY(-300px); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  createConstellations() {
    const constellationContainer = document.createElement('div');
    constellationContainer.className = 'constellations';
    constellationContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.4;
    `;
    document.body.appendChild(constellationContainer);

    // Tạo các chòm sao
    const constellations = [
      { x1: 15, y1: 20, x2: 25, y2: 30, x3: 35, y3: 25 },
      { x1: 75, y1: 15, x2: 80, y2: 35, x3: 85, y3: 20 },
      { x1: 10, y1: 70, x2: 20, y2: 80, x3: 30, y3: 75 },
      { x1: 70, y1: 60, x2: 80, y2: 70, x3: 90, y3: 65 },
      { x1: 50, y1: 10, x2: 55, y2: 25, x3: 60, y3: 15 },
      { x1: 25, y1: 50, x2: 35, y2: 60, x3: 45, y3: 55 }
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
      line.setAttribute('opacity', '0.6');

      const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line2.setAttribute('x1', `${constellation.x2}%`);
      line2.setAttribute('y1', `${constellation.y2}%`);
      line2.setAttribute('x2', `${constellation.x3}%`);
      line2.setAttribute('y2', `${constellation.y3}%`);
      line2.setAttribute('stroke', '#ddd1e9');
      line2.setAttribute('stroke-width', '1');
      line2.setAttribute('opacity', '0.6');

      svg.appendChild(line);
      svg.appendChild(line2);
      constellationContainer.appendChild(svg);

      // Thêm animation
      svg.style.animation = `constellationPulse ${4 + index}s ease-in-out infinite`;
    });

    // Thêm CSS animation
    if (!document.querySelector('#constellation-animations')) {
      const style = document.createElement('style');
      style.id = 'constellation-animations';
      style.textContent = `
        @keyframes constellationPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  createPulsars() {
    const pulsarContainer = document.createElement('div');
    pulsarContainer.className = 'pulsars';
    pulsarContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(pulsarContainer);

    // Tạo pulsars
    for (let i = 0; i < 8; i++) {
      const pulsar = document.createElement('div');
      pulsar.className = 'pulsar';
      
      const size = Math.random() * 6 + 3;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 3;
      const duration = Math.random() * 2 + 1;
      
      pulsar.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, #fff 0%, #ddd1e9 50%, transparent 100%);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        box-shadow: 0 0 ${size * 4}px #ddd1e9;
        animation: pulsarPulse ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
      `;
      
      pulsarContainer.appendChild(pulsar);
    }

    // Thêm CSS animation
    if (!document.querySelector('#pulsar-animations')) {
      const style = document.createElement('style');
      style.id = 'pulsar-animations';
      style.textContent = `
        @keyframes pulsarPulse {
          0%, 100% { 
            opacity: 0.2; 
            transform: scale(1);
          }
          50% { 
            opacity: 1; 
            transform: scale(2);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Initialize universe effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on desktop for performance
  const shouldInitialize = 
    window.innerWidth > 768 && 
    !window.performanceMonitor?.isLowEnd();
  
  if (shouldInitialize) {
    new UniverseEffects();
  }
});

