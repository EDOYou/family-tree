import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import familyTreeData from "../../data/familyTreeData.json";

const TreeVisualization: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);

    // Orbit controls for better interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    
    // Array to hold sphere references for animation
    const spheres: THREE.Mesh[] = [];

    // Calculate the offset to center the spheres
    const midpointOffset = (familyTreeData.length - 1) * 1; // Assuming each step is 2

    // Create geometry for each family member
    familyTreeData.forEach((member, index) => {
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(geometry, material);

      // Position spheres in a line, centered around the origin
      sphere.position.x = index * 2 - midpointOffset;
      scene.add(sphere);
      spheres.push(sphere);
    });

    // Camera position and orientation
    camera.position.z = 20;
    camera.position.y = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the origin

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Adding directional light
    directionalLight.position.set(0, 1, 1); // Positioned above and behind the camera
    scene.add(ambientLight);
    scene.add(directionalLight);

    // Animation loop
    const animate = function () {
      requestAnimationFrame(animate);

      // Update each sphere's rotation
      spheres.forEach((sphere) => {
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resizing
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      controls.update();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default TreeVisualization;
