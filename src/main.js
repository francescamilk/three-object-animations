import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap'
import GUI from 'lil-gui';

// Debugger init
const gui       = new GUI({ width: 300 });
const guiObject = { 
    color: '#a778d8',
    subdivision: 2,
    imgSource: '/textures/checkerboard-1024x1024.png'
    // imgSource: '/textures/cow.jpeg'
};

window.addEventListener('keydown', (e) => {
    if(e.key === 'h')
        gui.show(gui._hidden);
});

// Canvas
const canvas = document.querySelector('canvas#webgl');

// Scene
const scene = new THREE.Scene();

// Texture(s)
//       has callbacks for different load states
const loadingMngr   = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingMngr);
const cowTexture    = textureLoader.load(guiObject.imgSource);

cowTexture.colorSpace = THREE.SRGBColorSpace;
cowTexture.wrapS      = THREE.RepeatWrapping; // x
cowTexture.wrapT      = THREE.RepeatWrapping; // y

// optimise to smaller texture
cowTexture.generateMipmaps = false;
cowTexture.minFilter = THREE.NearestFilter;

// Object(s)
// const geometry = new THREE.SphereGeometry(1, 32, 32);
// const geometry = new THREE.TorusGeometry(1, 0.35, 32, 100);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ 
    map: cowTexture, 
    color: guiObject.color 
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// &plug debugger
gui
    .add(mesh.position, 'x')
    .min(-3).max(3).step(0.01)
    .name('alignment');

gui
    .add(mesh.position, 'y')
    .min(-3).max(3).step(0.01)
    .name('elevation');

gui
    .add(mesh.position, 'z')
    .min(-3).max(3).step(0.01)
    .name('closeness');

gui
    .add(guiObject, 'subdivision')
    .min(1).max(10).step(1)
    .onFinishChange(() => {
        mesh.geometry.dispose();
        mesh.geometry = new THREE.BoxGeometry(
            1, 1, 1,
            guiObject.subdivision, guiObject.subdivision, guiObject.subdivision
        );
    });

gui
    .add(mesh, 'visible');

gui
    .add(material, 'wireframe');

gui
    .addColor(guiObject, 'color')
    .onChange(() => {
        material.color.set(guiObject.color);
    });

guiObject.spin = () => {
    //                           full circle rotation
    gsap.to(mesh.rotation, { y: (mesh.rotation.y + Math.PI * 2), duration: 3 });
}
gui
    .add(guiObject, 'spin');

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
// field of view (vertical vision angle), aspect ratio,                  _near, _far 
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);
camera.lookAt(mesh.position);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animations
const animLoop = () => {
    // to enable damping
    controls.update();

    // rerender function on next frame
    renderer.render(scene, camera);
    window.requestAnimationFrame(animLoop);
}

animLoop();