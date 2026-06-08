import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { observeElement, watchPageVisibility } from '../../utils/useVisibilityPause';

export const ProfileScene = ({ theme }) => {
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

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2));
      renderer.setClearColor(0x000000, 0);

      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);

      camera.position.z = 3;

      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 1500;
      const posArray = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 8;
        posArray[i + 1] = (Math.random() - 0.5) * 8;
        posArray[i + 2] = (Math.random() - 0.5) * 8;
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

      let targetRotationX = 0;
      let targetRotationY = 0;
      let currentRotationX = 0;
      let currentRotationY = 0;
      let isMoving = false;
      let moveTimeout;

      const smoothingFactor = 0.1;

      const handleMouseMove = (e) => {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        targetRotationX = mouseY * 0.5;
        targetRotationY = mouseX * 0.5;
        isMoving = true;
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => { isMoving = false; }, 1000);
      };

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('resize', handleResize);

      let frameId = null;
      let isVisible = true;
      let isInViewport = false;

      const startLoop = () => {
        if (!frameId && isVisible && isInViewport) loop();
      };
      const stopLoop = () => {
        if (frameId) { cancelAnimationFrame(frameId); frameId = null; }
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

      const cleanupPageVis = watchPageVisibility(
        () => { isVisible = true; startLoop(); },
        () => { isVisible = false; stopLoop(); }
      );
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

  return <div ref={mountRef} className="absolute inset-0" data-testid="profile-webgl-canvas" />;
};
