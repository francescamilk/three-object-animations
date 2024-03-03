import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Canvas
const canvas = document.querySelector('canvas#webgl');

// Scene
// https://threejs.org/docs/#api/en/scenes/Scene
const scene = new THREE.Scene();

// Object(s)
// https://threejs.org/docs/#api/en/objects/Mesh
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

// Window
const sizes = { 
    width: window.innerWidth, 
    height: window.innerHeight 
};

// handle resize
window.addEventListener('resize', (e) => {
    // update sizes
    sizes.width  = window.innerWidth;
    sizes.height = window.innerHeight;

    // update camera
    camera.aspect = (sizes.width / sizes.height);
    camera.updateProjectionMatrix();

    // update renderer
    renderer.setSize(sizes.width, sizes.height);
});

// handle fullscreen
window.addEventListener('dblclick', () => {
    //                                    leave fullscreen : enter fullscreen
    document.fullscreenElement ? document.exitFullscreen() : canvas.requestFullscreen();
});

// Camera
// https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
// field of view (vertical vision angle), aspect ratio,                  _near, _far 
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;

scene.add(camera);
camera.lookAt(mesh.position);

// Controls
// https://threejs.org/docs/#examples/en/controls/OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
// https://threejs.org/docs/#api/en/renderers/WebGLRenderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animations
const animLoop = () => {
    // to enable damping
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(animLoop);
}

animLoop();