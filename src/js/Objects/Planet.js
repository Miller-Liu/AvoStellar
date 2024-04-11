import * as THREE from 'three';

export class Planet {
    constructor(planetRadius, polygonRadius, mass, position, plane) {
        // initialize properties
        this.planetRadius = planetRadius;
        this.polygonRadius = polygonRadius;
        this.mass = mass;
        this.position = position;
        this.plane = plane;
        this.scene = this.plane.scene;
        
        // objects
        this.planet = this.makePlanet();
        this.polygon = this.makePolygon();

        // add force from current object to the plane
        this.plane.forces.push(this.getForce());

        // add all objects to scene
        this.addAllToScene()
    }

    // add all objects to scene
    addAllToScene() {
        this.scene.add(this.planet);
        this.scene.add(this.polygon);
    }

    makePlanet(){
        const planetMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff
        });
        const planetGeometry = new THREE.IcosahedronGeometry(this.planetRadius, 3);
        const planetObj = new THREE.Mesh(planetGeometry, planetMaterial);
        planetObj.position.set(...this.position);

        return planetObj;
    }

    makePolygon(){
        const skeletonMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            wireframe: true,
            side: THREE.DoubleSide
        });
        const skeletonGeometry = new THREE.IcosahedronGeometry(this.polygonRadius, 1);
        const skeletonObj = new THREE.Mesh(skeletonGeometry, skeletonMaterial);
        skeletonObj.position.set(...this.position);
        
        return skeletonObj;
    }

    getForce() {
        return (x, y, z) => {
            const [x_distance, y_distance, z_distance] = [this.planet.position.x - x, this.planet.position.y - y, this.planet.position.z - z];
            return -1 * this.mass * this.polygonRadius / (y_distance * y_distance + 10) * Math.pow(Math.E, (-1 / (this.polygonRadius * this.polygonRadius) * (x_distance * x_distance + z_distance * z_distance)));
        };
    }

    setScale(s) {
        this.polygon.scale.set(s, s, s);
        this.planet.scale.set(s, s, s);
    }
}