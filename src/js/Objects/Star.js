import * as THREE from 'three';
import { starTypes } from '../Config/starDistributions.js';
import { STAR_MAX, STAR_MIN } from '../Config/renderConfig.js';
import { clamp } from '../Utils/Clamp.js';

export class Star {
    constructor(position, scene) {
        this.position = position;
        this.starType = this.getStarType();
        this.color = starTypes.color[this.starType];
        this.scene = scene;

        this.star = this.makeStar();

        this.addAllToScene();
    }

    // add all objects to scene
    addAllToScene() {
        this.scene.add(this.star);
    }

    getStarType() {
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

    makeStar() {
        const color = new THREE.Color(this.color);
        const geometry = new THREE.SphereGeometry(1);
        const material = new THREE.MeshBasicMaterial({ color: color });
		const sphere = new THREE.Mesh( geometry, material );

        sphere.position.set(...this.position);

        // 
        sphere.scale.set(STAR_MAX, STAR_MAX, STAR_MAX);

        return sphere
    }

    updateScale(camera) {
        let dist = this.position.distanceTo(camera.position) / 250;

        // update star size
        let starSize = dist * starTypes.size[this.starType]
        starSize = clamp(starSize, STAR_MIN, STAR_MAX);
        this.star.scale.copy(new THREE.Vector3(starSize, starSize, starSize));
    }
}