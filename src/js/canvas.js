import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

var canvas, container;

export function setUpCanvas(canvasRef, containerRef) {

    canvas = canvasRef.current;
    container = containerRef.current;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(container.clientWidth, container.clientHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x050505 );
    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    // Sets orbit control to move the camera around
    const orbit = new OrbitControls(camera, renderer.domElement);

    // Camera positioning
    camera.position.set(0, 0, 5);
    camera.lookAt(new THREE.Vector3(0, 500, 0));
    orbit.update();

    // Sets a 12 by 12 gird helper
    const gridHelper = new THREE.GridHelper(12, 12);
    scene.add(gridHelper);

    // Sets the x, y, and z axes with each having a length of 4
    const axesHelper = new THREE.AxesHelper(4);
    scene.add(axesHelper);

    // box
    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(box)

    // animate box
    box.rotation.x = 5;
    box.rotation.y = 5;

    function animate() {
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.updateProjectionMatrix();
    });
}
