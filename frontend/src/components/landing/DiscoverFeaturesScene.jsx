import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { observeElement, watchPageVisibility } from '../../utils/useVisibilityPause';

export const DiscoverFeaturesScene = ({ theme }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });

      // Function to update renderer size based on parent section
      const updateSize = () => {
        const section = mountRef.current?.closest('section');
        if (section) {
          const width = section.offsetWidth;
          const height = section.offsetHeight;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      };

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2));
      renderer.setClearColor(0x000000, 0);

      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);

      // Initial size
      updateSize();

      camera.position.z = 3;

      // Create particles - increase spread for larger area
      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 2000;
      const posArray = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 12;
        posArray[i + 1] = (Math.random() - 0.5) * 12;
        posArray[i + 2] = (Math.random() - 0.5) * 12;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.025,
        color: new THREE.Color(theme.accent),
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
      });

      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // Mouse tracking for rotation
      let mouseX = 0;
      let mouseY = 0;
      let targetRotationX = 0;
      let targetRotationY = 0;
      let currentRotationX = 0;
      let currentRotationY = 0;
      let isMoving = false;
      let moveTimeout;

      const smoothingFactor = 0.1;

      const handleMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

        targetRotationX = mouseY * 0.5;
        targetRotationY = mouseX * 0.5;

        isMoving = true;

        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
          isMoving = false;
        }, 1000);
      };

      const handleResize = () => {
        updateSize();
      };

      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('resize', handleResize);

      // Use ResizeObserver to detect section height changes
      const section = mountRef.current?.closest('section');
      const resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      
      if (section) {
        resizeObserver.observe(section);
      }

      // Also check after a short delay to ensure content is loaded
      setTimeout(updateSize, 100);
      setTimeout(updateSize, 500);

      let frameId = null;
      let isVisible = true;
      let isInViewport = false; // start false — wait for observer

      const startLoop = () => {
        if (!frameId && isVisible && isInViewport) {
          loop();
        }
      };
      const stopLoop = () => {
        if (frameId) {
          cancelAnimationFrame(frameId);
          frameId = null;
        }
      };

      const loop = () => {
        if (isMoving) {
          currentRotationX += (targetRotationX - currentRotationX) * smoothingFactor;
          currentRotationY += (targetRotationY - currentRotationY) * smoothingFactor;
        } else {
          currentRotationX *= 0.95;
          currentRotationY *= 0.95;
        }

        particles.rotation.x = currentRotationX;
        particles.rotation.y = currentRotationY;
        particles.rotation.z += 0.0001;

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(loop);
      };

      // Pause when tab is hidden
      const cleanupPageVis = watchPageVisibility(
        () => { isVisible = true; startLoop(); },
        () => { isVisible = false; stopLoop(); }
      );

      // Only run when in viewport
      const cleanupObserver = observeElement(
        mountRef.current,
        () => { isInViewport = true; startLoop(); },
        () => { isInViewport = false; stopLoop(); }
      );

      return () => {
        stopLoop();
        clearTimeout(moveTimeout);
        cleanupPageVis();
        cleanupObserver();
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        resizeObserver.disconnect();

        particlesGeometry.dispose();
        particlesMaterial.dispose();
        renderer.dispose();

        if (mountRef.current?.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    } catch (error) {
      console.error('WebGL Error:', error);
      return () => {};
    }
  }, [theme]);

  return <div ref={mountRef} className="absolute inset-0" data-testid="discover-features-webgl-canvas" />;
};
