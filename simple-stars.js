// Modern Three.js Galaxy Portfolio - Most Beautiful Ever
class ModernGalaxyPortfolio {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.galaxy = null;
    this.animationId = null;
    this.mouse = { x: 0, y: 0 };
    this.clock = new THREE.Clock();
    
    if (typeof THREE === 'undefined') {
      console.error('Three.js not loaded');
      return;
    }
    
    this.init();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createGalaxy();
    this.createNebula();
    this.animate();
    this.setupEventListeners();
  }

  createScene() {
    this.scene = new THREE.Scene();
    // Brighter fog for better visibility
    this.scene.fog = new THREE.Fog(0x000022, 200, 1000);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.z = 1500;
    this.camera.position.y = 200; // Slight offset for tilted view
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    
    const container = document.createElement('div');
    container.className = 'modern-galaxy';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
      pointer-events: none;
    `;
    container.appendChild(this.renderer.domElement);
    document.body.appendChild(container);
  }

  createGalaxy() {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 120000; // More particles for full screen
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Galaxy parameters - FULL SCREEN
    const galaxyRadius = 3000; // HUGE to fill entire screen
    const galaxyThickness = 100;
    const armCount = 4;
    const armTightness = 0.3;
    const armSpread = 0.6;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Create spiral galaxy distribution
      const rand = Math.random();
      
      // More particles near center (galaxy core)
      const radius = Math.pow(rand, 0.5) * galaxyRadius;
      
      // Angle around center
      const angle = Math.random() * Math.PI * 2;
      
      // Create spiral arms - divide into spiral arms
      const armIndex = Math.floor((angle / (Math.PI * 2)) * armCount);
      const armAngle = (angle / (Math.PI * 2)) * armCount % 1;
      
      // Spiral effect
      const spiralRotation = radius * armTightness;
      const spiralAngle = angle + spiralRotation;
      
      // Arm distribution - particles cluster along arms
      const armOffset = Math.cos(armAngle * Math.PI * 2) * armSpread * 100;
      const radialSpread = radius + armOffset;
      
      // 3D position with tilt
      const x = Math.cos(spiralAngle) * radialSpread;
      const y = Math.sin(spiralAngle) * radialSpread;
      const z = (Math.random() - 0.5) * galaxyThickness * Math.pow(1 - radius / galaxyRadius, 0.5);
      
      // Tilt galaxy at 45 degree angle for better view
      const tiltAngle = Math.PI / 6; // 30 degrees
      const tiltedX = x;
      const tiltedY = y * Math.cos(tiltAngle) - z * Math.sin(tiltAngle);
      const tiltedZ = y * Math.sin(tiltAngle) + z * Math.cos(tiltAngle);
      
      positions[i3] = tiltedX;
      positions[i3 + 1] = tiltedY;
      positions[i3 + 2] = tiltedZ;

      // Galaxy colors - MUCH brighter and more vibrant
      const distance = radius / galaxyRadius;
      
      let r, g, b;
      
      if (distance < 0.15) {
        // Galaxy core - BRIGHT white/yellow
        r = 1.0; g = 1.0; b = 0.9;
      } else if (distance < 0.3) {
        // Inner arms - bright white
        r = 1.0; g = 1.0; b = 1.0;
      } else if (distance < 0.5) {
        // Mid arms - bright blue-white
        r = 0.9; g = 0.95; b = 1.0;
      } else if (distance < 0.7) {
        // Outer arms - vibrant blue
        r = 0.8; g = 0.85; b = 1.0;
      } else {
        // Edge and beyond - add random stars throughout
        // Random bright stars scattered everywhere
        const randBrightness = Math.random();
        if (randBrightness > 0.7) {
          // Bright stars randomly placed
          r = 0.9 + Math.random() * 0.1;
          g = 0.9 + Math.random() * 0.1;
          b = 0.95 + Math.random() * 0.05;
        } else {
          r = 0.7; g = 0.75; b = 1.0;
        }
      }
      
      colors[i3] = r;
      colors[i3 + 1] = g;
      colors[i3 + 2] = b;

      // Size variation - bigger stars
      sizes[i] = Math.random() * 2.5 + 1.0;
      
      // Make center much brighter and bigger, random bright stars everywhere
      if (distance < 0.3) {
        sizes[i] *= 2.0;
      } else if (distance < 0.6) {
        sizes[i] *= 1.5;
      } else if (Math.random() > 0.85) {
        // Random bright stars throughout the galaxy
        sizes[i] *= 2.5;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false
    });

    this.galaxy = new THREE.Points(geometry, material);
    this.scene.add(this.galaxy);
  }

  createNebula() {
    for (let i = 0; i < 30; i++) {
      const geometry = new THREE.SphereGeometry(
        Math.random() * 250 + 120,
        16,
        16
      );
      
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.6),
        transparent: true,
        opacity: Math.random() * 0.3 + 0.1,
        blending: THREE.AdditiveBlending
      });
      
      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.set(
        (Math.random() - 0.5) * 4000,
        (Math.random() - 0.5) * 4000,
        (Math.random() - 0.5) * 4000
      );
      
      this.scene.add(nebula);
    }
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const elapsedTime = this.clock.getElapsedTime();

    if (this.galaxy) {
      // Slow rotation for dramatic effect
      this.galaxy.rotation.z = elapsedTime * 0.015;
      // Also rotate on X axis for tilted effect
      this.galaxy.rotation.x = Math.PI / 6; // 30 degrees tilt
    }

    // Parallax mouse effect - full screen range
    this.camera.position.x += (this.mouse.x * 80 - this.camera.position.x) * 0.04;
    this.camera.position.y += ((200 + this.mouse.y * 80) - this.camera.position.y) * 0.04;

    this.renderer.render(this.scene, this.camera);
  }

  setupEventListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE !== 'undefined') {
    new ModernGalaxyPortfolio();
  } else {
    setTimeout(() => {
      if (typeof THREE !== 'undefined') {
        new ModernGalaxyPortfolio();
      }
    }, 1000);
  }
});
