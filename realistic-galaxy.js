// Realistic Galaxy Background with Three.js
// Author: Bang Tran

class RealisticGalaxy {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.galaxy = null;
    this.planets = [];
    this.nebula = [];
    this.stars = null;
    this.animationId = null;
    this.mouse = { x: 0, y: 0 };
    this.clock = new THREE.Clock();
    
    this.init();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createStars();
    this.createGalaxy();
    this.createPlanets();
    this.createNebula();
    this.createLights();
    this.animate();
    this.setupEventListeners();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 50, 500);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 0, 100);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const background = document.createElement('div');
    background.className = 'realistic-galaxy';
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
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a large sphere
      const radius = Math.random() * 1000 + 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Star colors - mostly white/blue with some yellow/red
      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        // White/blue stars
        colors[i3] = 0.9 + Math.random() * 0.1;
        colors[i3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i3 + 2] = 1.0;
      } else if (colorChoice < 0.8) {
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

      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  createGalaxy() {
    // Create spiral galaxy
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyCount = 8000;
    const positions = new Float32Array(galaxyCount * 3);
    const colors = new Float32Array(galaxyCount * 3);
    const sizes = new Float32Array(galaxyCount);

    for (let i = 0; i < galaxyCount; i++) {
      const i3 = i * 3;
      
      // Spiral galaxy pattern
      const radius = Math.random() * 150 + 20;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 30;
      
      // Spiral arms
      const spiralAngle = angle + radius * 0.1;
      const armOffset = Math.sin(spiralAngle * 2) * 20;
      
      positions[i3] = Math.cos(angle) * (radius + armOffset);
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * (radius + armOffset);

      // Galaxy colors - center is brighter and whiter
      const distanceFromCenter = radius / 150;
      const colorIntensity = 1 - distanceFromCenter;
      
      if (distanceFromCenter < 0.3) {
        // Center - bright white/yellow
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.9 + colorIntensity * 0.1;
        colors[i3 + 2] = 0.8 + colorIntensity * 0.2;
      } else if (distanceFromCenter < 0.7) {
        // Arms - blue/white
        colors[i3] = 0.7 + colorIntensity * 0.3;
        colors[i3 + 1] = 0.8 + colorIntensity * 0.2;
        colors[i3 + 2] = 1.0;
      } else {
        // Outer arms - purple/pink
        colors[i3] = 0.8 + colorIntensity * 0.2;
        colors[i3 + 1] = 0.4 + colorIntensity * 0.3;
        colors[i3 + 2] = 0.9 + colorIntensity * 0.1;
      }

      sizes[i] = Math.random() * 1.5 + 0.5;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const galaxyMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    this.scene.add(this.galaxy);
  }

  createPlanets() {
    // Create rocky planet (foreground)
    const rockyPlanetGeometry = new THREE.SphereGeometry(25, 32, 32);
    const rockyPlanetMaterial = new THREE.MeshLambertMaterial({
      color: 0x4a4a4a,
      transparent: true,
      opacity: 0.9
    });
    
    const rockyPlanet = new THREE.Mesh(rockyPlanetGeometry, rockyPlanetMaterial);
    rockyPlanet.position.set(-80, -40, -50);
    this.planets.push(rockyPlanet);
    this.scene.add(rockyPlanet);

    // Create gas giant
    const gasGiantGeometry = new THREE.SphereGeometry(35, 32, 32);
    const gasGiantMaterial = new THREE.MeshLambertMaterial({
      color: 0x4a6b8a,
      transparent: true,
      opacity: 0.8
    });
    
    const gasGiant = new THREE.Mesh(gasGiantGeometry, gasGiantMaterial);
    gasGiant.position.set(60, 20, -80);
    this.planets.push(gasGiant);
    this.scene.add(gasGiant);

    // Add planet details
    this.addPlanetDetails(rockyPlanet, 'rocky');
    this.addPlanetDetails(gasGiant, 'gas');
  }

  addPlanetDetails(planet, type) {
    if (type === 'rocky') {
      // Add surface details
      const surfaceGeometry = new THREE.SphereGeometry(25.1, 32, 32);
      const surfaceMaterial = new THREE.MeshLambertMaterial({
        color: 0x2a2a2a,
        transparent: true,
        opacity: 0.3
      });
      const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
      planet.add(surface);
    } else if (type === 'gas') {
      // Add atmospheric bands
      const bandGeometry = new THREE.SphereGeometry(35.1, 32, 32);
      const bandMaterial = new THREE.MeshLambertMaterial({
        color: 0x2a4a6a,
        transparent: true,
        opacity: 0.2
      });
      const bands = new THREE.Mesh(bandGeometry, bandMaterial);
      planet.add(bands);
    }
  }

  createNebula() {
    // Create multiple nebula clouds
    const nebulaCount = 8;
    
    for (let i = 0; i < nebulaCount; i++) {
      const nebulaGeometry = new THREE.SphereGeometry(
        Math.random() * 40 + 20, 
        32, 
        32
      );
      
      const hue = Math.random() * 60 + 240; // Purple to blue range
      const nebulaMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue / 360, 0.8, 0.5),
        transparent: true,
        opacity: Math.random() * 0.15 + 0.05,
        blending: THREE.AdditiveBlending
      });
      
      const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
      nebula.position.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400
      );
      
      this.nebula.push(nebula);
      this.scene.add(nebula);
    }
  }

  createLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    this.scene.add(ambientLight);

    // Directional light from galaxy center
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 0, 0);
    directionalLight.target.position.set(0, 0, -100);
    this.scene.add(directionalLight);
    this.scene.add(directionalLight.target);

    // Point lights for planets
    const planetLight1 = new THREE.PointLight(0x4a6b8a, 0.3, 100);
    planetLight1.position.set(-80, -40, -50);
    this.scene.add(planetLight1);

    const planetLight2 = new THREE.PointLight(0x8a4a6a, 0.3, 100);
    planetLight2.position.set(60, 20, -80);
    this.scene.add(planetLight2);

    // Galaxy center light
    const galaxyCenterLight = new THREE.PointLight(0xffffff, 1.0, 200);
    galaxyCenterLight.position.set(0, 0, 0);
    this.scene.add(galaxyCenterLight);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const elapsedTime = this.clock.getElapsedTime();

    // Rotate galaxy
    if (this.galaxy) {
      this.galaxy.rotation.y = elapsedTime * 0.01;
    }

    // Rotate planets
    this.planets.forEach((planet, index) => {
      planet.rotation.y += 0.005 * (index + 1);
      planet.rotation.x += 0.002 * (index + 1);
    });

    // Animate nebula
    this.nebula.forEach((nebula, index) => {
      nebula.rotation.x += 0.001 * (index + 1);
      nebula.rotation.y += 0.002 * (index + 1);
      nebula.rotation.z += 0.0005 * (index + 1);
    });

    // Mouse interaction
    this.camera.position.x += (this.mouse.x * 20 - this.camera.position.x) * 0.02;
    this.camera.position.y += (this.mouse.y * 20 - this.camera.position.y) * 0.02;
    this.camera.lookAt(this.scene.position);

    // Scroll interaction
    const scrolled = window.pageYOffset;
    this.camera.position.z = 100 + scrolled * 0.2;

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

// Initialize realistic galaxy when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if Three.js is available
  if (typeof THREE !== 'undefined') {
    new RealisticGalaxy();
  } else {
    console.log('Three.js not loaded, using fallback galaxy');
  }
});

