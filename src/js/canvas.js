import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import { Galaxy } from './Objects/Galaxy.js';
import { InstancedGalaxy } from './Objects/InstancedGalaxy.js';

var canvas, container, renderer, objects, scene, camera;

export function setUpCanvas(canvasRef, containerRef) {
    // Select Canvas
    canvas = canvasRef.current;
    container = containerRef.current;

    // THREE Renderer initialization
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(container.clientWidth, container.clientHeight);

    // THREE Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x050505 );

    // THREE Camera
    camera = new THREE.PerspectiveCamera(
        57,
        container.clientWidth / container.clientHeight,
        0.1,
        10000
    );
    camera.position.set(3700, 3650, 0);
    camera.lookAt(new THREE.Vector3(0, 500, 0));

    // Sets orbit control to move the camera around
    const orbit = new OrbitControls(camera, renderer.domElement);

    // Sets a 12 by 12 gird helper
    const gridHelper = new THREE.GridHelper(100, 100);
    scene.add(gridHelper);

    // Sets the x, y, and z axes with each having a length of 4
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    // box
    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(box)

    objects = makeObjects();

    // animate box
    box.rotation.x = 5;
    box.rotation.y = 5;

    function animate() {
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(render);

    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.updateProjectionMatrix();
    });
}

/*
-------------------------------------------------------
MAIN LOOP
-------------------------------------------------------
*/

function render() {
    objects["instanced_galaxy"].update(camera);
    renderer.render(scene, camera);
};

/*
-------------------------------------------------------
MAKE OBJECTS
-------------------------------------------------------
*/
function makeObjects() {
    const objs = {};
    objs["instanced_galaxy"] = new InstancedGalaxy(scene);
    return objs;
}
