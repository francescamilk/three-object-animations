import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas#webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh     = new THREE.Mesh(geometry, material);

scene.add(mesh);

// Camera
const width = 800;
const height = 600;

const camera = new THREE.PerspectiveCamera(75, width / height);
camera.position.z = 3;

scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(width, height);

// Animations
let   time = Date.now();
const animLoop = () => {
    // stabilise framerate 
    const currTime  = Date.now();
    const deltaTime = currTime - time;
    time            = currTime;

    // mesh.rotation.y += 0.01;
    mesh.rotation.y += 0.001 * deltaTime;

    renderer.render(scene, camera);

    // call function on next frame
    window.requestAnimationFrame(animLoop);
}

animLoop();