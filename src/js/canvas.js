import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import { Galaxy } from './Objects/Galaxy.js';
import { InstancedGalaxy } from './Objects/InstancedGalaxy.js';

var canvas, container, renderer, objects, scene, camera, oneTimeTriggers, clock;

export function setUpCanvas(canvasRef, containerRef, oneTime) {
    oneTimeTriggers = oneTime

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
    // const orbit = new OrbitControls(camera, renderer.domElement);

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

    // Add Clock
    clock = new THREE.Clock();

    // animate box
    box.rotation.x = 5;
    box.rotation.y = 5;

    function animate() {
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(render);

    // Event Listeners
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.updateProjectionMatrix();
    });

    document.body.onkeyup = function(e) {
        if (sceneTracker == 0) {
            if (e.key == " " || e.code == "Space") {
                triggerNextScene();
            }
        }
    }
}

/*
-------------------------------------------------------
MAIN LOOP
-------------------------------------------------------
*/

function render() {
    sceneController();
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

/*
-------------------------------------------------------
SCENES CODE
-------------------------------------------------------
*/

let sceneTracker = 0;
let sceneStartTime = 0, sceneEndTime = 0;
const sceneList = [scene1];

function sceneController() {
    if (sceneTracker % 2 == 0) {
        sceneList[sceneTracker](clock.getElapsedTime() - sceneStartTime);
    } else if (sceneTracker % 2 == 1) {
        sceneList[sceneTracker](clock.getElapsedTime(), sceneEndTime);
    }
}

function triggerNextScene() {
    sceneTracker += 1;
    if (sceneTracker == 1 || sceneTracker == 3 || sceneTracker == 5) { 
        sceneEndTime = clock.getElapsedTime();
    } else if (sceneTracker == 2) {
        sceneStartTime = clock.getElapsedTime();
        oneTimeTriggers(2);
    } else if (sceneTracker == 6) {
        sceneTracker = 2;
    }
    
    if (sceneTracker == 1) { oneTimeTriggers(1); }
    if (sceneTracker == 4) { oneTimeTriggers(3); }
}

function scene1(time) {
    const period = 25, radius = 3700, angle = 2 * Math.PI * time / period;
    const [x, z] = [radius * Math.cos(angle), radius * Math.sin(angle)];
    camera.position.set(x, camera.position.y, z);
    camera.lookAt(new THREE.Vector3(0, 500, 0));
}