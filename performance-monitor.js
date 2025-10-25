// Performance Monitor & Device Detection
// Author: Bang Tran

class PerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.isLowEndDevice = false;
    this.isReducedMotion = false;
    
    this.init();
  }

  init() {
    this.detectDevice();
    this.detectReducedMotion();
    this.monitorPerformance();
    this.optimizeForDevice();
  }

  detectDevice() {
    // Detect low-end devices
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      this.isLowEndDevice = true;
      return;
    }

    // Check GPU memory and capabilities
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      // Detect integrated graphics or low-end GPUs
      if (renderer.includes('Intel') || 
          renderer.includes('Mali') || 
          renderer.includes('Adreno 3') ||
          renderer.includes('PowerVR')) {
        this.isLowEndDevice = true;
      }
    }

    // Check hardware concurrency
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      this.isLowEndDevice = true;
    }

    // Check memory (if available)
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      this.isLowEndDevice = true;
    }

    // Check connection speed
    if (navigator.connection) {
      const connection = navigator.connection;
      if (connection.effectiveType === 'slow-2g' || 
          connection.effectiveType === '2g' ||
          connection.saveData) {
        this.isLowEndDevice = true;
      }
    }
  }

  detectReducedMotion() {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  monitorPerformance() {
    const measureFPS = () => {
      this.frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;
        
        // If FPS drops below 30, consider it low performance
        if (this.fps < 30) {
          this.isLowEndDevice = true;
          this.optimizeForDevice();
        }
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    measureFPS();
  }

  optimizeForDevice() {
    if (this.isLowEndDevice || this.isReducedMotion) {
      this.disableHeavyEffects();
    }
  }

  disableHeavyEffects() {
    // Disable Three.js background
    const threeBackground = document.querySelector('.three-background');
    if (threeBackground) {
      threeBackground.style.display = 'none';
    }

    // Disable custom cursor
    const customCursor = document.querySelector('.custom-cursor');
    if (customCursor) {
      customCursor.style.display = 'none';
    }

    // Disable particle trail
    const canvas = document.querySelector('canvas');
    if (canvas && canvas.style.position === 'fixed') {
      canvas.style.display = 'none';
    }

    // Disable complex animations
    const style = document.createElement('style');
    style.textContent = `
      .card:hover { transform: translateY(-2px) !important; }
      .hero .preview:hover img { transform: scale(1.02) !important; }
      .skill, .project, .g-card, .about-card {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
      .blob { display: none !important; }
      .marquee { display: none !important; }
    `;
    document.head.appendChild(style);

    // Reduce Three.js particle count to 0
    if (window.THREE && window.ThreeJSEffects) {
      // This will be handled in three-effects.js
    }
  }

  // Public method to check if device is low-end
  isLowEnd() {
    return this.isLowEndDevice;
  }

  // Public method to check if reduced motion is preferred
  prefersReducedMotion() {
    return this.isReducedMotion;
  }

  // Get current FPS
  getFPS() {
    return this.fps;
  }
}

// Initialize performance monitor
window.performanceMonitor = new PerformanceMonitor();

