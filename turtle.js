import * as THREE from 'three';

function crossProduct(vector1, vector2) {
    const x = vector1.y * vector2.z - vector1.z * vector2.y;
    const y = vector1.z * vector2.x - vector1.x * vector2.z;
    const z = vector1.x * vector2.y - vector1.y * vector2.x;
    return new THREE.Vector3(x, y, z);
}

function rotateVector(vector, axis, radians) {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const x = axis.x;
    const y = axis.y;
    const z = axis.z;
    const u = vector.x;
    const v = vector.y;
    const w = vector.z;

    const sa = new THREE.Vector3(sin * x, sin * y, sin * z);

    const result = new THREE.Vector3(
        (x * x + (1 - x * x) * cos) * u + (x * y * (1 - cos) - sa.z) * v + (x * z * (1 - cos) + sa.y) * w,
        (x * y * (1 - cos) + sa.z) * u + (y * y + (1 - y * y) * cos) * v + (y * z * (1 - cos) - sa.x) * w,
        (x * z * (1 - cos) - sa.y) * u + (y * z * (1 - cos) + sa.x) * v + (z * z + (1 - z * z) * cos) * w
    );

    return result;
}

class Turtle {
    constructor(startingRadius, startingPosition) {
        this.vertex = startingPosition;
        this.vertex.radius = startingRadius;
        this.vertex.hasLeaf = false;
        this.direction = new THREE.Vector3(0, 1, 0);
        this.up = new THREE.Vector3(0, 0, 1);
        this.right = new THREE.Vector3(1, 0, 0);
        this.stack = [];
        this.vertices = [[this.vertex]];
        this.verticesIndex = 0;
    }

    forward(distance) {
        const newVertex = new THREE.Vector3().copy(this.vertex).addScaledVector(this.direction, distance);
        newVertex.radius = this.vertex.radius;
        newVertex.hasLeaf = false;
        this.vertices[this.verticesIndex].push(newVertex);
        this.vertex = newVertex;
    }

    turnRight(angle) {
        const newDirection = rotateVector(this.direction, this.up, -angle);
        const newRight = crossProduct(newDirection, this.up);
        this.direction = newDirection;
        this.right = newRight;
    }

    turnLeft(angle) {
        const newDirection = rotateVector(this.direction, this.up, angle);
        const newRight = crossProduct(newDirection, this.up);
        this.direction = newDirection;
        this.right = newRight;
    }

    pitchUp(angle) {
        const newDirection = rotateVector(this.direction, this.right, -angle);
        const newUp = crossProduct(this.right, newDirection);
        this.direction = newDirection;
        this.up = newUp;
    }

    pitchDown(angle) {
        const newDirection = rotateVector(this.direction, this.right, angle);
        const newUp = crossProduct(this.right, newDirection);
        this.direction = newDirection;
        this.up = newUp;
    }

    rollRight(angle) {
        const newUp = rotateVector(this.up, this.direction, -angle);
        const newRight = crossProduct(this.direction, newUp);
        this.up = newUp;
        this.right = newRight;
    }

    rollLeft(angle) {
        const newUp = rotateVector(this.up, this.direction, angle);
        const newRight = crossProduct(this.direction, newUp);
        this.up = newUp;
        this.right = newRight;
    }

    turnAround() {
        this.turnRight(Math.PI);
    }

    pushState() {
        this.stack.push({
            vertex: this.vertex,
            direction: this.direction,
            up: this.up,
            right: this.right,
        });
    }

    popState() {
        const state = this.stack.pop();
        this.verticesIndex++;
        this.vertex = state.vertex;
        this.vertices[this.verticesIndex] = [this.vertex];
        this.direction = state.direction;
        this.up = state.up;
        this.right = state.right;
    }

    shrinkRadius(factor) {
        this.vertex.radius *= factor;
    }

    addLeaf() {
        this.vertex.hasLeaf = true;
    }
}

export { Turtle }