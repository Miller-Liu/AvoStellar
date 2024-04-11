import * as THREE from 'three';
import { Star } from './Star.js';
import { gaussianRandom } from '../Utils/GaussianRandom.js';
import { CORE_X_DIST, CORE_Z_DIST, GALAXY_THICKNESS, NUM_STARS, OUTER_CORE_X_DIST, OUTER_CORE_Z_DIST, ARM_X_DIST, SPIRAL, ARM_X_MEAN, ARM_Z_DIST, ARM_Z_MEAN, ARMS, MIDDLE_CORE_X_DIST, MIDDLE_CORE_Z_DIST } from '../Config/galaxyConfig.js';

export class Galaxy {
    constructor(scene) {
        this.scene = scene;

        this.stars = this.makeStars(NUM_STARS);
    }

    spiral(x, y, z, offset) {
        let r = Math.sqrt(x**2 + z**2)
        let theta = offset
        theta += x > 0 ? Math.atan(z/x) : Math.atan(z/x) + Math.PI
        theta += (r/ARM_X_DIST) * SPIRAL
        return new THREE.Vector3(r*Math.cos(theta), y, r*Math.sin(theta))
    }

    makeStars(numStars) {
        const objects = [];

        for ( let i = 0; i < numStars / (3 + ARMS); i++){
            let pos = new THREE.Vector3(gaussianRandom(0, CORE_X_DIST), gaussianRandom(0, GALAXY_THICKNESS), gaussianRandom(0, CORE_Z_DIST));
            let obj = new Star(pos, this.scene);
            objects.push(obj)
        }

        for ( let i = 0; i < numStars / (3 + ARMS); i++){
            let pos = new THREE.Vector3(gaussianRandom(0, OUTER_CORE_X_DIST), gaussianRandom(0, GALAXY_THICKNESS), gaussianRandom(0, OUTER_CORE_Z_DIST));
            let obj = new Star(pos, this.scene);
            objects.push(obj)
        }

        for ( let i = 0; i < numStars / (3 + ARMS); i++){
            let pos = new THREE.Vector3(gaussianRandom(0, MIDDLE_CORE_X_DIST), gaussianRandom(0, GALAXY_THICKNESS), gaussianRandom(0, MIDDLE_CORE_Z_DIST));
            let obj = new Star(pos, this.scene);
            objects.push(obj)
        }

        // change this
        for (let j = 0; j < ARMS; j++) {
            for ( let i = 0; i < numStars / (3 + ARMS); i++){
                let pos = this.spiral(gaussianRandom(ARM_X_MEAN, ARM_X_DIST), gaussianRandom(0, GALAXY_THICKNESS), gaussianRandom(ARM_Z_MEAN, ARM_Z_DIST), j * 2 * Math.PI / ARMS);
                let obj = new Star(pos, this.scene);
                objects.push(obj)
            }
        }

        return objects
    }

    update(camera) {
        this.stars.forEach((star) => {
            star.updateScale(camera)
        })
    }
}
