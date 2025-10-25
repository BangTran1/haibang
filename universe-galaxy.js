// Universe Galaxy - The Most Beautiful Galaxy Ever
// Author: Bang Tran

class UniverseGalaxy {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.galaxy = null;
    this.stars = null;
    this.nebula = [];
    this.planets = [];
    this.animationId = null;
    this.mouse = { x: 0, y: 0 };
    this.clock = new THREE.Clock();
    this.starField = [];
    this.time = 0;
    
    this.init();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createUniverse();
    this.createGalaxy();
    this.createPlanets();
    this.createNebula();
    this.createLights();
    this.animate();
    this.setupEventListeners();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 100, 2000);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    this.camera.position.set(0, 0, 150);
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
    background.className = 'universe-galaxy';
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

  createUniverse() {
    // Tạo vũ trụ với các ngôi sao mờ dần từ tâm
    const starCount = 15000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const opacities = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Tạo vị trí ngẫu nhiên trong không gian 3D
      const radius = Math.random() * 1500 + 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Tính khoảng cách từ tâm để tạo hiệu ứng mờ dần
      const distanceFromCenter = Math.sqrt(
        positions[i3] * positions[i3] + 
        positions[i3 + 1] * positions[i3 + 1] + 
        positions[i3 + 2] * positions[i3 + 2]
      );
      
      // Mờ dần từ tâm ra ngoài
      const fadeFactor = Math.max(0, 1 - (distanceFromCenter / 1500));
      const opacity = fadeFactor * fadeFactor; // Quadratic fade
      
      // Màu sắc ngôi sao dựa trên khoảng cách
      if (distanceFromCenter < 200) {
        // Trung tâm - sao sáng trắng/vàng
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i3 + 2] = 0.8 + Math.random() * 0.2;
      } else if (distanceFromCenter < 500) {
        // Vùng giữa - sao xanh/trắng
        colors[i3] = 0.8 + Math.random() * 0.2;
        colors[i3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i3 + 2] = 1.0;
      } else if (distanceFromCenter < 1000) {
        // Vùng ngoài - sao tím/xanh
        colors[i3] = 0.7 + Math.random() * 0.3;
        colors[i3 + 1] = 0.5 + Math.random() * 0.3;
        colors[i3 + 2] = 0.9 + Math.random() * 0.1;
      } else {
        // Vùng xa - sao đỏ/cam
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.4 + Math.random() * 0.4;
        colors[i3 + 2] = 0.2 + Math.random() * 0.3;
      }

      // Kích thước ngôi sao dựa trên độ sáng
      sizes[i] = (Math.random() * 3 + 1) * opacity;
      opacities[i] = opacity;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    // Tạo shader material để có hiệu ứng mờ dần tốt hơn
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        attribute vec3 color;
        varying float vOpacity;
        varying vec3 vColor;
        
        void main() {
          vOpacity = opacity;
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z) * pixelRatio;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          alpha *= vOpacity;
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  createGalaxy() {
    // Tạo spiral galaxy với hiệu ứng mờ dần
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyCount = 12000;
    const positions = new Float32Array(galaxyCount * 3);
    const colors = new Float32Array(galaxyCount * 3);
    const sizes = new Float32Array(galaxyCount);
    const opacities = new Float32Array(galaxyCount);

    for (let i = 0; i < galaxyCount; i++) {
      const i3 = i * 3;
      
      // Spiral galaxy pattern
      const radius = Math.random() * 200 + 30;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 40;
      
      // Tạo spiral arms
      const spiralAngle = angle + radius * 0.15;
      const armOffset = Math.sin(spiralAngle * 3) * 30;
      
      positions[i3] = Math.cos(angle) * (radius + armOffset);
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * (radius + armOffset);

      // Mờ dần từ tâm ra ngoài
      const distanceFromCenter = radius / 200;
      const fadeFactor = Math.max(0, 1 - distanceFromCenter);
      const opacity = fadeFactor * fadeFactor;
      
      // Màu sắc galaxy
      if (distanceFromCenter < 0.2) {
        // Trung tâm - sáng trắng/vàng
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.95 + Math.random() * 0.05;
        colors[i3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (distanceFromCenter < 0.5) {
        // Cánh tay trong - xanh/trắng
        colors[i3] = 0.8 + Math.random() * 0.2;
        colors[i3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i3 + 2] = 1.0;
      } else if (distanceFromCenter < 0.8) {
        // Cánh tay giữa - tím/xanh
        colors[i3] = 0.9 + Math.random() * 0.1;
        colors[i3 + 1] = 0.6 + Math.random() * 0.2;
        colors[i3 + 2] = 1.0;
      } else {
        // Cánh tay ngoài - hồng/tím
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.4 + Math.random() * 0.3;
        colors[i3 + 2] = 0.8 + Math.random() * 0.2;
      }

      sizes[i] = (Math.random() * 2 + 0.5) * opacity;
      opacities[i] = opacity;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    galaxyGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    const galaxyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        attribute vec3 color;
        varying float vOpacity;
        varying vec3 vColor;
        
        void main() {
          vOpacity = opacity;
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (400.0 / -mvPosition.z) * pixelRatio;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          alpha *= vOpacity;
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    this.scene.add(this.galaxy);
  }

  createPlanets() {
    // Tạo các hành tinh đẹp mắt
    const planetData = [
      { size: 30, color: 0x4a4a4a, position: [-120, -60, -80], type: 'rocky' },
      { size: 45, color: 0x4a6b8a, position: [100, 30, -120], type: 'gas' },
      { size: 20, color: 0x8a4a4a, position: [150, -40, -60], type: 'desert' },
      { size: 25, color: 0x4a8a4a, position: [-80, 80, -100], type: 'ocean' }
    ];

    planetData.forEach((data, index) => {
      const geometry = new THREE.SphereGeometry(data.size, 64, 64);
      const material = new THREE.MeshLambertMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.9
      });
      
      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(data.position[0], data.position[1], data.position[2]);
      
      // Thêm chi tiết cho hành tinh
      this.addPlanetDetails(planet, data.type);
      
      this.planets.push(planet);
      this.scene.add(planet);
    });
  }

  addPlanetDetails(planet, type) {
    if (type === 'rocky') {
      // Thêm bề mặt đá
      const surfaceGeometry = new THREE.SphereGeometry(planet.geometry.parameters.radius * 1.01, 64, 64);
      const surfaceMaterial = new THREE.MeshLambertMaterial({
        color: 0x2a2a2a,
        transparent: true,
        opacity: 0.3
      });
      const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
      planet.add(surface);
    } else if (type === 'gas') {
      // Thêm bands khí
      const bandGeometry = new THREE.SphereGeometry(planet.geometry.parameters.radius * 1.01, 64, 64);
      const bandMaterial = new THREE.MeshLambertMaterial({
        color: 0x2a4a6a,
        transparent: true,
        opacity: 0.2
      });
      const bands = new THREE.Mesh(bandGeometry, bandMaterial);
      planet.add(bands);
    } else if (type === 'desert') {
      // Thêm bề mặt sa mạc
      const surfaceGeometry = new THREE.SphereGeometry(planet.geometry.parameters.radius * 1.01, 64, 64);
      const surfaceMaterial = new THREE.MeshLambertMaterial({
        color: 0x8a4a2a,
        transparent: true,
        opacity: 0.4
      });
      const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
      planet.add(surface);
    } else if (type === 'ocean') {
      // Thêm bề mặt đại dương
      const surfaceGeometry = new THREE.SphereGeometry(planet.geometry.parameters.radius * 1.01, 64, 64);
      const surfaceMaterial = new THREE.MeshLambertMaterial({
        color: 0x2a4a8a,
        transparent: true,
        opacity: 0.3
      });
      const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
      planet.add(surface);
    }
  }

  createNebula() {
    // Tạo nhiều tinh vân đẹp mắt
    const nebulaCount = 12;
    
    for (let i = 0; i < nebulaCount; i++) {
      const nebulaGeometry = new THREE.SphereGeometry(
        Math.random() * 80 + 40, 
        32, 
        32
      );
      
      // Màu sắc tinh vân đa dạng
      const hue = Math.random() * 360;
      const nebulaMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue / 360, 0.8, 0.6),
        transparent: true,
        opacity: Math.random() * 0.2 + 0.05,
        blending: THREE.AdditiveBlending
      });
      
      const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
      nebula.position.set(
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 800
      );
      
      this.nebula.push(nebula);
      this.scene.add(nebula);
    }
  }

  createLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.scene.add(ambientLight);

    // Galaxy center light
    const galaxyCenterLight = new THREE.PointLight(0xffffff, 2.0, 300);
    galaxyCenterLight.position.set(0, 0, 0);
    this.scene.add(galaxyCenterLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 0, 0);
    directionalLight.target.position.set(0, 0, -200);
    this.scene.add(directionalLight);
    this.scene.add(directionalLight.target);

    // Planet lights
    this.planets.forEach((planet, index) => {
      const planetLight = new THREE.PointLight(
        new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
        0.5,
        150
      );
      planetLight.position.copy(planet.position);
      this.scene.add(planetLight);
    });
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    this.time = this.clock.getElapsedTime();

    // Cập nhật shader uniforms
    if (this.stars && this.stars.material.uniforms) {
      this.stars.material.uniforms.time.value = this.time;
    }
    if (this.galaxy && this.galaxy.material.uniforms) {
      this.galaxy.material.uniforms.time.value = this.time;
    }

    // Xoay galaxy
    if (this.galaxy) {
      this.galaxy.rotation.y = this.time * 0.02;
    }

    // Xoay hành tinh
    this.planets.forEach((planet, index) => {
      planet.rotation.y += 0.005 * (index + 1);
      planet.rotation.x += 0.002 * (index + 1);
    });

    // Xoay tinh vân
    this.nebula.forEach((nebula, index) => {
      nebula.rotation.x += 0.001 * (index + 1);
      nebula.rotation.y += 0.002 * (index + 1);
      nebula.rotation.z += 0.0005 * (index + 1);
    });

    // Tương tác chuột
    this.camera.position.x += (this.mouse.x * 30 - this.camera.position.x) * 0.02;
    this.camera.position.y += (this.mouse.y * 30 - this.camera.position.y) * 0.02;
    this.camera.lookAt(this.scene.position);

    // Tương tác scroll
    const scrolled = window.pageYOffset;
    this.camera.position.z = 150 + scrolled * 0.3;

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

// Initialize universe galaxy when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if Three.js is available
  if (typeof THREE !== 'undefined') {
    new UniverseGalaxy();
  } else {
    console.log('Three.js not loaded, using fallback galaxy');
  }
});

