import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import { DotsPlane } from './Objects/DotsPlane.js'
import { Planet } from './Objects/Planet.js'
import { Galaxy } from './Objects/Galaxy.js';
import { InstancedGalaxy } from './Objects/InstancedGalaxy.js';

var canvas, container, renderer, objects, scene, camera, oneTimeTriggers, clock, mouse, raycaster, increaseMoney, toShop, toMain, money = 0;
var ownedItems = [1, 0, 0, 0, 0, 0, 0, 0];

export function setUpCanvas(canvasRef, containerRef, oneTime, m, toShopRef, backRef, items) {
    oneTimeTriggers = oneTime
    increaseMoney = m

    toShop = toShopRef.current;
    toMain = backRef.current;

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

    // Set up mouse
    mouse = new THREE.Vector2();

    // Set up Raycaster
    raycaster = new THREE.Raycaster();

    // THREE Lighting
    const light = new THREE.HemisphereLight();
    light.intensity = 3;
    scene.add(light);

    objects = makeObjects();

    // Add Clock
    clock = new THREE.Clock();

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

    var intersectBool = false;
    window.addEventListener('mousemove', function(e) {
        if (objects != undefined) {
            mouse.set((e.clientX / container.clientWidth) * 2 - 1, -(e.clientY / container.clientHeight) * 2 + 1, 0);
            raycaster.setFromCamera(mouse, camera);
            // console.log(mouse.x, mouse.y);

            var intersects = raycaster.intersectObjects([objects["planet"].planet]);
            if (intersects.length > 0 && intersectBool == false) {
                intersectBool = true;
                objects["planet"].setScale(1.1);
                container.style.cursor = "pointer";
            } if (intersects.length == 0) {
                intersectBool = false;
                objects["planet"].setScale(1);
                container.style.cursor = "default";
            }
        }
    });

    window.addEventListener('mousedown', function(e) {
        if (intersectBool == true && (sceneTracker == 2 || sceneTracker == 4)) {
            objects["planet"].setScale(0.9);
        }
    })

    window.addEventListener('mouseup', function(e) {
        if (intersectBool == true && (sceneTracker == 2 || sceneTracker == 4)) {
            e.stopImmediatePropagation();
            objects["planet"].setScale(1.1);
            money = money + ownedItems[0];
        }
    })

    toShop.addEventListener('click', function() {
        if (sceneTracker == 2) {
            triggerNextScene();
        }
    })

    toMain.addEventListener('click', function() {
        if (sceneTracker == 4) {
            oneTimeTriggers(2);
            triggerNextScene();
        }
    })

    items[0].current.addEventListener('click', function() {
        if (sceneTracker == 4) {
            if (money >= 10) {
                money -= 10;
                ownedItems[0] += 1;
            }
        }
    })

    items[1].current.addEventListener('click', function() {
        if (sceneTracker == 4) {
            if (money >= 20) {
                money -= 20;
                ownedItems[1] += 1;
            }
        }
    })

    setInterval(() => {
        money += ownedItems[1]
    }, 1000)
}

/*
-------------------------------------------------------
MAIN LOOP
-------------------------------------------------------
*/

function render() {
    sceneController();
    objects["instanced_galaxy"].update(camera);
    // objects["plane"].applyAllYChanges();
    renderer.render(scene, camera);
    increaseMoney(money);
};

/*
-------------------------------------------------------
MAKE OBJECTS
-------------------------------------------------------
*/
function makeObjects() {
    const objs = {};
    objs["plane"] = new DotsPlane(5, -10, [20, 20], scene);
    objs["planet"] = new Planet(10, 15, 25, [0, 0, 0], objs["plane"]);
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
const sceneList = [scene1, transition1, scene2, transition2_forward, scene3, transition2_backward];

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

function transition1(currentTime, startTime) {
    currentTime = startTime + (currentTime - startTime) ** 2;
    const period = 25;
    const targetAngle = 0;
    const startAngle = 2 * Math.PI * startTime / period, currentAngle = 2 * Math.PI * currentTime / period;
    const endTime = period / (2 * Math.PI) * (targetAngle + 2 * Math.PI - startAngle); 
    const radius = 3700 + (400 - 3700) / endTime * (currentTime - startTime);
    const height = 3650 + (-3650) / endTime * (currentTime - startTime);
    const [x, y, z] = [radius * Math.cos(currentAngle), height, radius * Math.sin(currentAngle)];
    const YViewCenter = 500 + (-500) / endTime * (currentTime - startTime);
    if (currentTime - startTime < endTime) {
        camera.position.set(x, y, z);
        camera.lookAt(new THREE.Vector3(0, YViewCenter, 0));
    } else {
        triggerNextScene()
    }
}

function scene2(time) {
    const targetPlanet = objects["planet"];
    const period = 35, radius = 75, angle = 2 * Math.PI * time / period;
    const [x, y, z] = [radius * Math.cos(angle) + targetPlanet.position[0], targetPlanet.position[1], radius * Math.sin(angle) + targetPlanet.position[2]];
    camera.position.set(x, y, z);
    camera.lookAt(new THREE.Vector3(targetPlanet.position[0], targetPlanet.position[1], targetPlanet.position[2]));
}

function transition2_forward(currentTime, startTime) {
    const targetPlanet = objects["planet"];
    const period = 35, startRadius = 75, radius = startRadius - 3 * (currentTime - startTime), angle = 2 * Math.PI * (currentTime - sceneStartTime) / period;
    const finalRadius = 70;
    if (radius >= finalRadius) {
        const [x, y, z] = [radius * Math.cos(angle) + targetPlanet.position[0], targetPlanet.position[1], radius * Math.sin(angle) + targetPlanet.position[2]];
        const [lookX, lookY, lookZ] = [radius / 2 * Math.cos(angle - (Math.PI / 2) * (startRadius - radius) / (startRadius - finalRadius)) + targetPlanet.position[0], targetPlanet.position[1], radius / 2 * Math.sin(angle - (Math.PI / 2) * (startRadius - radius) / (startRadius - finalRadius)) + targetPlanet.position[2]]
        camera.position.set(x, y, z);
        camera.lookAt(new THREE.Vector3(lookX, lookY, lookZ));
    } else {
        triggerNextScene();
    }
}

function transition2_backward(currentTime, startTime) {
    const targetPlanet = objects["planet"];
    const period = 35, startRadius = 70, radius = startRadius + 5 * (currentTime - startTime), angle = 2 * Math.PI * (currentTime - sceneStartTime) / period;
    const finalRadius = 75;
    if (radius <= finalRadius) {
        const [x, y, z] = [radius * Math.cos(angle) + targetPlanet.position[0], targetPlanet.position[1], radius * Math.sin(angle) + targetPlanet.position[2]];
        const [lookX, lookY, lookZ] = [radius / 2 * Math.cos(angle - (Math.PI / 2) + (Math.PI / 2) * (radius - startRadius) / (finalRadius - startRadius)) + targetPlanet.position[0], targetPlanet.position[1], radius / 2 * Math.sin(angle - (Math.PI / 2) + (Math.PI / 2) * (radius - startRadius) / (finalRadius - startRadius)) + targetPlanet.position[2]]
        camera.position.set(x, y, z);
        camera.lookAt(new THREE.Vector3(lookX, lookY, lookZ));
    } else {
        triggerNextScene();
    }
}

function scene3(time) {
    const targetPlanet = objects["planet"];
    const period = 35, radius = 60, angle = 2 * Math.PI * time / period;
    const [x, y, z] = [radius * Math.cos(angle) + targetPlanet.position[0], targetPlanet.position[1], radius * Math.sin(angle) + targetPlanet.position[2]];
    const [lookX, lookY, lookZ] = [radius / 2 * Math.cos(angle - Math.PI / 2) + targetPlanet.position[0], targetPlanet.position[1], radius / 2 * Math.sin(angle - Math.PI / 2) + targetPlanet.position[2]]
    camera.position.set(x, y, z);
    camera.lookAt(new THREE.Vector3(lookX, lookY, lookZ));
}