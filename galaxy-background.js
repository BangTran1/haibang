// Galaxy Background with Three.js
// Author: Bang Tran

class GalaxyBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.stars = null;
    this.nebula = null;
    this.galaxy = null;
    this.animationId = null;
    this.mouse = { x: 0, y: 0 };
    this.clock = new THREE.Clock();
    this.frameCount = 0;
    
    this.init();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createStars();
    this.createNebula();
    this.createGalaxy();
    this.createLights();
    this.animate();
    this.setupEventListeners();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x0a0a0a, 50, 300);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      60, // Giảm FOV để galaxy gần hơn
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 30; // Gần hơn để thấy rõ galaxy
    this.camera.position.y = 5; // Nâng lên một chút
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    
    // Add to background
    const background = document.createElement('div');
    background.className = 'galaxy-background';
    background.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
      pointer-events: none;
    `;
    background.appendChild(this.renderer.domElement);
    document.body.appendChild(background);
  }

  createStars() {
    const starCount = window.innerWidth > 1200 ? 4000 : window.innerWidth > 768 ? 2000 : 800;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Concentrate stars in center area for better visibility
      const radius = Math.random() * 150 + 50; // Closer to center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Star colors - mostly white/blue with some yellow/red
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        // White/blue stars
        colors[i3] = 0.9 + Math.random() * 0.1;
        colors[i3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i3 + 2] = 1.0;
      } else if (colorChoice < 0.9) {
        // Yellow stars
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i3 + 2] = 0.6 + Math.random() * 0.2;
      } else {
        // Red stars
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.4 + Math.random() * 0.3;
        colors[i3 + 2] = 0.2 + Math.random() * 0.3;
      }

      sizes[i] = Math.random() * 3 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 3, // Tăng kích thước sao
      vertexColors: true,
      transparent: true,
      opacity: 1.0, // Tăng độ trong suốt
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  createNebula() {
    // Create multiple nebula clouds
    const nebulaCount = 5;
    
    for (let i = 0; i < nebulaCount; i++) {
      const geometry = new THREE.SphereGeometry(
        Math.random() * 30 + 20, 
        32, 
        32
      );
      
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(
          Math.random() * 0.2 + 0.6, // Purple to blue range
          Math.random() * 0.3 + 0.7, // High saturation
          Math.random() * 0.2 + 0.1  // Low lightness
        ),
        transparent: true,
        opacity: Math.random() * 0.1 + 0.05,
        blending: THREE.AdditiveBlending
      });
      
      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400
      );
      
      this.scene.add(nebula);
    }
  }

  createGalaxy() {
    // Create spiral galaxy effect - more concentrated in center
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyCount = 3000; // Tăng số lượng
    const positions = new Float32Array(galaxyCount * 3);
    const colors = new Float32Array(galaxyCount * 3);
    const sizes = new Float32Array(galaxyCount);

    for (let i = 0; i < galaxyCount; i++) {
      const i3 = i * 3;
      
      // Spiral galaxy pattern - more concentrated in center
      const radius = Math.random() * 80 + 10; // Gần trung tâm hơn
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 15; // Thấp hơn
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * radius;

      // Galaxy colors - purple to blue gradient
      const colorIntensity = 1 - (radius / 120);
      colors[i3] = 0.5 + colorIntensity * 0.5;     // Red
      colors[i3 + 1] = 0.2 + colorIntensity * 0.3; // Green
      colors[i3 + 2] = 0.8 + colorIntensity * 0.2; // Blue

      sizes[i] = Math.random() * 2 + 0.5;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const galaxyMaterial = new THREE.PointsMaterial({
      size: 2.5, // Tăng kích thước
      vertexColors: true,
      transparent: true,
      opacity: 0.9, // Tăng độ trong suốt
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    this.scene.add(this.galaxy);
  }

  createLights() {
    // Ambient light for overall illumination - tăng độ sáng
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.scene.add(ambientLight);

    // Directional light for depth - tăng cường
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(50, 50, 50);
    this.scene.add(directionalLight);

    // Point lights for galaxy center - sáng hơn và gần hơn
    const centerLight = new THREE.PointLight(0x4a4a8a, 1.0, 100);
    centerLight.position.set(0, 0, 0);
    this.scene.add(centerLight);

    // Colored point lights for nebula - gần trung tâm hơn
    const nebulaLight1 = new THREE.PointLight(0x8a4a8a, 0.6, 80);
    nebulaLight1.position.set(30, 20, -20);
    this.scene.add(nebulaLight1);

    const nebulaLight2 = new THREE.PointLight(0x4a8a8a, 0.6, 80);
    nebulaLight2.position.set(-30, -20, 20);
    this.scene.add(nebulaLight2);

    // Thêm ánh sáng trung tâm mạnh hơn
    const brightCenter = new THREE.PointLight(0xddd1e9, 0.8, 60);
    brightCenter.position.set(0, 0, 0);
    this.scene.add(brightCenter);

    // Tạo một vùng sáng trung tâm đặc biệt
    this.centerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(15, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xddd1e9,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending
      })
    );
    this.centerGlow.position.set(0, 0, 0);
    this.scene.add(this.centerGlow);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const elapsedTime = this.clock.getElapsedTime();

    // Rotate stars slowly
    if (this.stars) {
      this.stars.rotation.y = elapsedTime * 0.01;
      this.stars.rotation.x = elapsedTime * 0.005;
    }

    // Rotate galaxy
    if (this.galaxy) {
      this.galaxy.rotation.y = elapsedTime * 0.02;
    }

    // Animate nebula clouds
    this.scene.children.forEach(child => {
      if (child instanceof THREE.Mesh && child.geometry.type === 'SphereGeometry') {
        child.rotation.x += 0.001;
        child.rotation.y += 0.002;
        child.rotation.z += 0.0005;
      }
    });

    // Animate center glow
    if (this.centerGlow) {
      this.centerGlow.rotation.x += 0.005;
      this.centerGlow.rotation.y += 0.01;
      this.centerGlow.material.opacity = 0.1 + Math.sin(elapsedTime * 2) * 0.05;
    }

    // Mouse interaction - subtle movement
    this.camera.position.x += (this.mouse.x * 10 - this.camera.position.x) * 0.02;
    this.camera.position.y += (this.mouse.y * 10 - this.camera.position.y) * 0.02;
    this.camera.lookAt(this.scene.position);

    // Scroll interaction
    const scrolled = window.pageYOffset;
    this.camera.position.z = 50 + scrolled * 0.1;

    this.renderer.render(this.scene, this.camera);
  }

  setupEventListeners() {
    // Mouse movement
    let mouseTimeout;
    window.addEventListener('mousemove', (event) => {
      if (mouseTimeout) return;
      mouseTimeout = setTimeout(() => {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouseTimeout = null;
      }, 16);
    });

    // Window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (resizeTimeout) return;
      resizeTimeout = setTimeout(() => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        resizeTimeout = null;
      }, 100);
    });
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.scene) {
      this.scene.clear();
    }
  }
}

// Initialize galaxy background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check performance monitor and device capabilities
  const shouldInitialize = 
    window.innerWidth > 768 && 
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !window.performanceMonitor?.isLowEnd();
  
  if (shouldInitialize) {
    new GalaxyBackground();
  }
});
