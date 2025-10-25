// Galaxy Fallback - Pure CSS version
// Author: Bang Tran

document.addEventListener('DOMContentLoaded', function() {
  // Tạo galaxy background với CSS thuần
  const galaxyDiv = document.createElement('div');
  galaxyDiv.className = 'galaxy-fallback';
  galaxyDiv.innerHTML = `
    <div class="stars-layer"></div>
    <div class="nebula-layer"></div>
    <div class="center-glow"></div>
  `;
  
  galaxyDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    pointer-events: none;
    background: radial-gradient(ellipse at center, 
      rgba(221, 209, 233, 0.15) 0%, 
      rgba(62, 55, 70, 0.1) 30%, 
      rgba(10, 11, 18, 0.9) 70%, 
      #0a0b12 100%);
    overflow: hidden;
  `;
  
  document.body.appendChild(galaxyDiv);
  
  // Thêm CSS cho stars và effects
  const style = document.createElement('style');
  style.textContent = `
    .galaxy-fallback .stars-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(2px 2px at 20px 30px, #ddd1e9, transparent),
        radial-gradient(2px 2px at 40px 70px, #a895c9, transparent),
        radial-gradient(1px 1px at 90px 40px, #ddd1e9, transparent),
        radial-gradient(1px 1px at 130px 80px, #a895c9, transparent),
        radial-gradient(2px 2px at 160px 30px, #ddd1e9, transparent),
        radial-gradient(1px 1px at 200px 60px, #a895c9, transparent),
        radial-gradient(2px 2px at 240px 20px, #ddd1e9, transparent),
        radial-gradient(1px 1px at 280px 50px, #a895c9, transparent),
        radial-gradient(2px 2px at 320px 80px, #ddd1e9, transparent),
        radial-gradient(1px 1px at 360px 40px, #a895c9, transparent),
        radial-gradient(2px 2px at 400px 70px, #ddd1e9, transparent),
        radial-gradient(1px 1px at 440px 30px, #a895c9, transparent),
        radial-gradient(2px 2px at 480px 60px, #ddd1e9, transparent),
        radial-gradient(1px 1px at 520px 20px, #a895c9, transparent),
        radial-gradient(2px 2px at 560px 50px, #ddd1e9, transparent),
        radial-gradient(1px 1px at 600px 80px, #a895c9, transparent),
        radial-gradient(2px 2px at 640px 30px, #ddd1e9, transparent),
        radial-gradient(1px 1px at 680px 70px, #a895c9, transparent),
        radial-gradient(2px 2px at 720px 40px, #ddd1e9, transparent),
        radial-gradient(1px 1px at 760px 10px, #a895c9, transparent);
      background-repeat: repeat;
      background-size: 800px 800px;
      animation: starsMove 100s linear infinite;
    }
    
    .galaxy-fallback .nebula-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(300px 300px at 20% 30%, rgba(221, 209, 233, 0.1), transparent),
        radial-gradient(200px 200px at 80% 70%, rgba(168, 149, 201, 0.08), transparent),
        radial-gradient(400px 400px at 50% 50%, rgba(62, 55, 70, 0.05), transparent);
      animation: nebulaFloat 20s ease-in-out infinite;
    }
    
    .galaxy-fallback .center-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 200px;
      height: 200px;
      margin: -100px 0 0 -100px;
      background: radial-gradient(circle, rgba(221, 209, 233, 0.2) 0%, transparent 70%);
      border-radius: 50%;
      animation: centerPulse 4s ease-in-out infinite;
    }
    
    @keyframes starsMove {
      0% { transform: translateX(0) translateY(0); }
      100% { transform: translateX(-800px) translateY(-800px); }
    }
    
    @keyframes nebulaFloat {
      0%, 100% { 
        transform: translate(0, 0) scale(1);
        opacity: 0.5;
      }
      50% { 
        transform: translate(20px, -20px) scale(1.1);
        opacity: 0.8;
      }
    }
    
    @keyframes centerPulse {
      0%, 100% { 
        transform: scale(1);
        opacity: 0.3;
      }
      50% { 
        transform: scale(1.2);
        opacity: 0.6;
      }
    }
  `;
  document.head.appendChild(style);
});

