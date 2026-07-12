/* ============================================================
   HERO ORB — small Three.js accent behind the hero photo.
   Loaded as a module; degrades silently if the CDN is blocked
   or the user prefers reduced motion.
   ============================================================ */

import * as THREE from 'three';

const canvas = document.getElementById('heroOrb');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (canvas && !prefersReducedMotion.matches && window.innerWidth > 700) {
  const wrap = canvas.parentElement;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 4.2;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Low-poly icosahedron, gently displaced per-vertex for an organic "blob" look
  const geometry = new THREE.IcosahedronGeometry(1.4, 2);
  const pos = geometry.attributes.position;
  const noiseSeeds = [];
  for (let i = 0; i < pos.count; i++) {
    noiseSeeds.push(Math.random() * Math.PI * 2);
  }

  const basePositions = pos.array.slice();

  const rootStyles = getComputedStyle(document.documentElement);
  const pinkMid = rootStyles.getPropertyValue('--pink-mid').trim() || '#de8a7c';

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(pinkMid),
    roughness: 0.35,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
    flatShading: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(2, 3, 4);
  scene.add(dirLight);

  let targetRotX = 0;
  let targetRotY = 0;

  function resize() {
    const size = wrap.clientWidth || 290;
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('mousemove', (e) => {
    targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.6;
    targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.4;
  }, { passive: true });

  let running = true;
  let clock = new THREE.Clock();

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    // Gentle organic vertex displacement
    const posArr = pos.array;
    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3;
      const nx = basePositions[ix];
      const ny = basePositions[ix + 1];
      const nz = basePositions[ix + 2];
      const wobble = 1 + Math.sin(t * 0.8 + noiseSeeds[i]) * 0.035;
      posArr[ix] = nx * wobble;
      posArr[ix + 1] = ny * wobble;
      posArr[ix + 2] = nz * wobble;
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    mesh.rotation.y += 0.0025;
    mesh.rotation.x += (targetRotX - mesh.rotation.x) * 0.03;
    mesh.rotation.y += (targetRotY - mesh.rotation.y) * 0.02;

    renderer.render(scene, camera);
  }
  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      animate();
    }
  });
}
