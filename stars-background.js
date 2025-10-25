// Modern Three.js Portfolio Background
// Advanced 3D Effects with Shaders

class Portfolio3DBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.geometry = null;
    this.animationId = null;
    this.mouse = { x: 0, y: 0 };
    this.clock = new THREE.Clock();
    
    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.error('Three.js not loaded');
      return;
    }
    
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createParticles();
    this.createLights();
    this.animate();
    this.setupEventListeners();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000011, 30, 100);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      60, // Giảm FOV để zoom in
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.z = 200; // Lùi xa để thấy toàn bộ ngân hà
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const container = document.createElement('div');
    container.className = 'portfolio-3d-background';
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

  createParticles() {
    const particleCount = 50000; // Nhiều ngôi sao hơn
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Galaxy distribution - concentrated at center
      const rand1 = Math.random();
      const rand2 = Math.random();
      const rand3 = Math.random();
      
      // Use exponential distribution for more stars near center
      const radius = Math.pow(Math.random(), 0.5) * 300; // Concentration at center, smaller galaxy
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      // Create spiral galaxy arms
      const spiralAngle = theta + radius * 0.1; // Spiral effect
      const armOffset = Math.sin(spiralAngle * 3) * radius * 0.3; // Spiral arms
      
      positions[i3] = Math.cos(theta) * (radius + armOffset);
      positions[i3 + 1] = Math.sin(theta) * (radius + armOffset) * 0.3; // Flatten galaxy
      positions[i3 + 2] = (Math.random() - 0.5) * radius * 0.2;

      // Galaxy colors - mostly white stars
      const distanceFromCenter = radius / 300;
      let color;
      if (distanceFromCenter < 0.3) {
        // Bright center - pure white
        color = new THREE.Color(1, 1, 1);
      } else if (distanceFromCenter < 0.5) {
        // Inner arms - white
        color = new THREE.Color(1, 1, 1);
      } else if (distanceFromCenter < 0.7) {
        // Middle arms - slightly blue-white
        color = new THREE.Color(0.95, 0.95, 1);
      } else if (distanceFromCenter < 0.9) {
        // Outer arms - light blue
        color = new THREE.Color(0.9, 0.9, 1);
      } else {
        // Edge - slightly blue
        color = new THREE.Color(0.85, 0.85, 1);
      }
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Use PointsMaterial with very small size for tiny stars
    this.material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: false, // Make stars same size regardless of distance
      depthWrite: false
    });

    this.particles = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particles);
  }

  createLights() {
    const light1 = new THREE.DirectionalLight(0x8888ff, 0.5);
    light1.position.set(10, 10, 10);
    this.scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xff8888, 0.5);
    light2.position.set(-10, -10, -10);
    this.scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.scene.add(ambientLight);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const elapsedTime = this.clock.getElapsedTime();

    // Rotate galaxy
    if (this.particles) {
      // Galaxy rotates around its center
      this.particles.rotation.z = elapsedTime * 0.05;
    }

    // Twinkle effect - make stars flicker
    if (this.material) {
      // Make opacity flicker like twinkling stars
      const twinkle = Math.sin(elapsedTime * 2) * 0.3 + 0.7;
      this.material.opacity = twinkle;
    }

    // Camera movement
    this.camera.position.x += (this.mouse.x * 10 - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.mouse.y * 10 - this.camera.position.y) * 0.05;

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

// Initialize when DOM and Three.js are loaded
function initBackground() {
  if (typeof THREE !== 'undefined') {
    new Portfolio3DBackground();
  } else {
    // Wait for Three.js to load
    setTimeout(initBackground, 100);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initBackground();
});

// Also try after window load
window.addEventListener('load', () => {
  if (typeof THREE !== 'undefined') {
    if (!window.portfolioBackgroundInit) {
      window.portfolioBackgroundInit = true;
      new Portfolio3DBackground();
    }
  }
});
