import * as THREE from 'three';
import { gaussianRandom } from '../Utils/GaussianRandom.js';
import { CORE_X_DIST, CORE_Z_DIST, GALAXY_THICKNESS, NUM_STARS, OUTER_CORE_X_DIST, OUTER_CORE_Z_DIST, ARM_X_DIST, SPIRAL, ARM_X_MEAN, ARM_Z_DIST, ARM_Z_MEAN, ARMS, MIDDLE_CORE_X_DIST, MIDDLE_CORE_Z_DIST } from '../Config/galaxyConfig.js';
import { starTypes } from '../Config/starDistributions.js';
import { STAR_MAX, STAR_MIN } from '../Config/renderConfig.js';
import { clamp } from '../Utils/Clamp.js';


export class InstancedGalaxy {
    constructor(scene) {
        this.scene = scene;

        this.stars = [];
        this.positions = [];
        this.objects = this.makeStars(NUM_STARS);
    }

    spiral(x, y, z, offset) {
        let r = Math.sqrt(x**2 + z**2)
        let theta = offset
        theta += x > 0 ? Math.atan(z/x) : Math.atan(z/x) + Math.PI
        theta += (r/ARM_X_DIST) * SPIRAL
        return new THREE.Vector3(r*Math.cos(theta), y, r*Math.sin(theta))
    }

    makeStars(numStars) {
        const geometry = new THREE.SphereGeometry(1);
        const material = new THREE.MeshBasicMaterial();
		const objects = new THREE.InstancedMesh( geometry, material, numStars );
        this.scene.add(objects);

        for ( let i = 0; i < numStars / (3 + ARMS); i++){
            this.stars.push(getStarType());
            this.positions.push(new THREE.Vector3(gaussianRandom(0, CORE_X_DIST), gaussianRandom(0, GALAXY_THICKNESS), gaussianRandom(0, CORE_Z_DIST)));
        }

        for ( let i = 0; i < numStars / (3 + ARMS); i++){
            this.stars.push(getStarType());
            this.positions.push(new THREE.Vector3(gaussianRandom(0, OUTER_CORE_X_DIST), gaussianRandom(0, GALAXY_THICKNESS), gaussianRandom(0, OUTER_CORE_Z_DIST)));
        }

        for ( let i = 0; i < numStars / (3 + ARMS); i++){
            this.stars.push(getStarType());
            this.positions.push(new THREE.Vector3(gaussianRandom(0, MIDDLE_CORE_X_DIST), gaussianRandom(0, GALAXY_THICKNESS), gaussianRandom(0, MIDDLE_CORE_Z_DIST)));
        }

        // change this
        for (let j = 0; j < ARMS; j++) {
            for ( let i = 0; i < numStars / (3 + ARMS); i++){
                this.stars.push(getStarType());
                this.positions.push(this.spiral(gaussianRandom(ARM_X_MEAN, ARM_X_DIST), gaussianRandom(0, GALAXY_THICKNESS), gaussianRandom(ARM_Z_MEAN, ARM_Z_DIST), j * 2 * Math.PI / ARMS));
            }
        }

        const dummy = new THREE.Object3D();

        for (let i = 0; i < this.stars.length; i++) {
            objects.setColorAt(i, new THREE.Color(starTypes.color[this.stars[i]]));
        }

        return objects
    }

    update(camera) {
        const dummy = new THREE.Object3D();
        for (let i = 0; i < this.stars.length; i++) {
            let dist = this.positions[i].distanceTo(camera.position) / 250;

            // update star size
            let starSize = dist * starTypes.size[this.stars[i]]
            starSize = clamp(starSize, STAR_MIN, STAR_MAX);
            
            dummy.position.set(this.positions[i].x, this.positions[i].y, this.positions[i].z);
            dummy.scale.set(starSize, starSize, starSize);
            dummy.updateMatrix();
            this.objects.setMatrixAt(i, dummy.matrix);
        }
        this.objects.instanceMatrix.needsUpdate = true;
    }
}

function getStarType() {
    let num = Math.random() * 100.0;
    const pct = starTypes.percentage;
    for (let i = 0; i < pct.length; i++) {
        num -= pct[i]
        if (num < 0) {
            return i
        }
    }
    return 0
}