import * as THREE from 'three';
import { SimplexNoise } from '../Utils/SimplexNoise.js';

export class DotsPlane {
    constructor(gapDistance, y, dimensions, scene) {
        // initialize properties
        this.sideLength = gapDistance;
        this.initialY = y;
        this.scene = scene;
        this.dimensions = dimensions;
        
        // Noise
        this.noise = new SimplexNoise();
        this.time = 0;

        // objects
        this.pointCoords = this.makeCoordinates();
        this.points = this.makePoints();
        this.grid = this.makeGrid();

        // yCoordinate changes
        this.forces = [];
        this.yChanges = Array.apply(null, Array(this.points.length)).map((u, i) => 0);

        // add all objects to scene
        // this.addAllToScene();
    }

    // add all objects to scene
    addAllToScene() {
        this.points.forEach((point) => this.scene.add(point));
        this.scene.add(this.grid);
    }

    // returns the coordinates of the vertices
    makeCoordinates() {
        const points = [], xDim = this.dimensions[0], yDim = this.dimensions[1];
        // there are xDim * yDim sides; there are (xDim + 1) * (yDim + 1) points
        for (let i = 0; i < (xDim + 1) * (yDim + 1); i++) {
            let xCoord = (i % (xDim + 1)) * this.sideLength;
            let yCoord = Math.floor(i / (xDim + 1)) * this.sideLength;
            // adjust x and y coordintes by half the width and half the height, respectively
            xCoord -= xDim * this.sideLength / 2;
            yCoord -= yDim * this.sideLength / 2;
            // add coordinate to points array
            points.push([xCoord, this.initialY, yCoord]);
        }
        return points
    }

    // returns a list of point objects
    makePoints() {
        const pointObjs = [];
        const sphereGeometry = new THREE.SphereGeometry(0.2);
        for (let i = 0; i < this.pointCoords.length; i++) {
            const newPoint = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({color: 0xffffff}));
            newPoint.position.set(...this.pointCoords[i]);
            pointObjs.push(newPoint);
        }
        return pointObjs
    }

    // return the grid object
    makeGrid() {
        // pairs of vertices for drawing the grid
        const lineVertices = [];
        // xDim is the number of points along the "x" side, yDim is the number of points along the "y" side
        const xDim = this.dimensions[0] + 1, yDim = this.dimensions[1] + 1;
        for (let i = 0; i < xDim * yDim; i++) {
            let xCoord = i % xDim;
            let yCoord = Math.floor(i / xDim);
            if (xCoord + 1 < xDim) {
                lineVertices.push(i);
                lineVertices.push(i + 1);
            }
            if (yCoord + 1 < yDim) {
                lineVertices.push(i);
                lineVertices.push(i + xDim);
            }
        }

        const gridGeometry = new THREE.BufferGeometry();
        const positionAttribute = new THREE.Float32BufferAttribute(this.pointCoords.flat(), 3);
        gridGeometry.setAttribute("position", positionAttribute);
        gridGeometry.setIndex(lineVertices);
        return new THREE.LineSegments(gridGeometry, new THREE.LineBasicMaterial());
    }

    // cool wave effect
    applyWave() {
        for (let i = 0; i < this.points.length; i++) {
            this.yChanges[i] += this.noise.noise3d(0.05 * this.points[i].position.x, 0.05 * this.points[i].position.z, this.time)
        }
        this.time += 0.005;
    }

    // forces from other objects will morph the plane
    applySpatialMorph() {
        for (let i = 0; i < this.forces.length; i++) {
            for (let j = 0; j < this.points.length; j++) {
                const force = this.forces[i](this.points[j].position.x, this.initialY, this.points[j].position.z);
                if (force) {
                    this.yChanges[j] += force
                }
            }
        }
    }

    // apply all the Y coordinate changes
    applyAllYChanges() {
        this.applyWave();
        this.applySpatialMorph();
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].position.y = this.initialY + this.yChanges[i];
            this.grid.geometry.attributes.position.setY(i, this.initialY + this.yChanges[i]);
            this.yChanges[i] = 0
        }
        this.grid.geometry.attributes.position.needsUpdate = true;
    }
}
