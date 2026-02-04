// ========================================
// Hero Full-Width Image Slider
// ========================================
class HeroSlider {
  constructor() {
    this.currentIndex = 0;
    this.slides = document.querySelectorAll(".hero-slide");
    this.dots = document.querySelectorAll(".hero-dot");
    this.prevBtn = document.querySelector(".hero-prev");
    this.nextBtn = document.querySelector(".hero-next");
    this.hero = document.querySelector(".hero");

    this.autoplayInterval = null;
    this.autoplayDuration = 5000; // 2 seconds
    this.isHovered = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.minSwipeDistance = 50;

    if (this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    // Navigation buttons
    this.prevBtn?.addEventListener("click", () => this.prevSlide());
    this.nextBtn?.addEventListener("click", () => this.nextSlide());

    // Dot indicators
    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prevSlide();
      if (e.key === "ArrowRight") this.nextSlide();
    });

    // Pause on hover, resume on leave
    this.hero?.addEventListener("mouseenter", () => {
      this.isHovered = true;
      this.stopAutoplay();
    });

    this.hero?.addEventListener("mouseleave", () => {
      this.isHovered = false;
      this.startAutoplay();
    });

    // Touch swipe support
    this.hero?.addEventListener(
      "touchstart",
      (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    this.hero?.addEventListener(
      "touchend",
      (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      },
      { passive: true },
    );

    // Start autoplay
    this.startAutoplay();

    console.log("Hero slider initialized with", this.slides.length, "slides");
  }

  showSlide(index) {
    // Ensure index is within bounds (circular)
    this.currentIndex = (index + this.slides.length) % this.slides.length;

    // Update slides
    this.slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === this.currentIndex);
    });

    // Update dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === this.currentIndex);
    });
  }

  nextSlide() {
    this.showSlide(this.currentIndex + 1);
    this.resetAutoplay();
  }

  prevSlide() {
    this.showSlide(this.currentIndex - 1);
    this.resetAutoplay();
  }

  goToSlide(index) {
    this.showSlide(index);
    this.resetAutoplay();
  }

  handleSwipe() {
    const swipeDistance = this.touchEndX - this.touchStartX;

    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe right - go to previous slide
        this.prevSlide();
      } else {
        // Swipe left - go to next slide
        this.nextSlide();
      }
    }
  }

  startAutoplay() {
    if (!this.isHovered && !this.autoplayInterval) {
      this.autoplayInterval = setInterval(
        () => this.nextSlide(),
        this.autoplayDuration,
      );
    }
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}

// ========================================
// Three.js Animated Background
// ========================================
class ThreeBackground {
  constructor() {
    this.canvas = document.getElementById("bg");
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particleSystem = null;
    this.particles = null;
    this.particleCount = 2000;

    // Check for WebGL support
    if (!this.checkWebGLSupport()) {
      this.createFallbackBackground();
      return;
    }

    // Auto-throttle on small devices
    if (window.innerWidth < 768) {
      this.particleCount = 800;
    }

    this.init();
    this.animate();
    this.handleResize();
  }

  checkWebGLSupport() {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  }

  createFallbackBackground() {
    // Fallback to CSS gradient if WebGL not supported
    this.canvas.style.background =
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    console.warn("WebGL not supported, using CSS fallback background");
  }

  init() {
    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000,
    );
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: window.innerWidth > 768, // Disable antialias on mobile for performance
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance

    // Create particle field
    this.createParticleField();

    // Store reference globally for parallax
    window.threeScene = this;
  }

  createParticleField() {
    // Geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);

    // Color palette (purple/blue gradient)
    const color1 = new THREE.Color(0x667eea);
    const color2 = new THREE.Color(0x764ba2);
    const color3 = new THREE.Color(0x00d4ff);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Positions - spread in 3D space
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      // Colors - gradient between palette colors
      const mixRatio = Math.random();
      const color =
        mixRatio < 0.33
          ? color1.clone()
          : mixRatio < 0.66
            ? color2.clone()
            : color3.clone();

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Sizes - random variation
      sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Material
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    // Particle system
    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);

    // Store positions for animation
    this.particles = positions;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Gentle rotation and drift
    if (this.particleSystem) {
      this.particleSystem.rotation.y += 0.0005;
      this.particleSystem.rotation.x += 0.0002;

      // Subtle wave motion on particles
      const positions = this.particleSystem.geometry.attributes.position.array;
      const time = Date.now() * 0.0001;

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];

        // Create gentle wave effect
        positions[i + 1] += Math.sin(time + x * 0.5) * 0.002;
        positions[i] += Math.cos(time + z * 0.3) * 0.001;
      }

      this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    // Render
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  handleResize() {
    window.addEventListener("resize", () => {
      if (!this.camera || !this.renderer || !this.canvas) return;

      // Update camera
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }
}

// ========================================
// Mobile Navigation (Legacy - Now handled by header component)
// ========================================
// Navigation is now initialized by components/header.js
// This class is kept for backward compatibility but not used

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ========================================
// Initialize All Components
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize hero slider
  new HeroSlider();

  // Initialize mobile navigation
  new MobileNav();

  // Initialize smooth scroll
  initSmoothScroll();

  console.log("✨ Enterprise website with full-width hero slider initialized");
});

// ========================================
// Performance Monitoring (Development)
// ========================================
if (window.performance && console.table) {
  window.addEventListener("load", () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    console.table({
      "Page Load Time": `${pageLoadTime}ms`,
      "Server Response": `${connectTime}ms`,
      "DOM Render": `${renderTime}ms`,
    });
  });
}
