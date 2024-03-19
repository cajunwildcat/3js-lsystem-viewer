// Import Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { RULES } from './lsystem-rules.js';
import { makeLSystem } from './lsystem.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';

// Create a new scene
const scene = new THREE.Scene();

// Create a new camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth * 0.8 / window.innerHeight, 0.1, 2000);

// Create a new renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.8, window.innerHeight);
document.querySelector("#renderer").appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);

// set the target of the controls to the center of the scene
controls.target.set(0, 0, 0);

// enable damping and set the damping factor
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// add an axis helper to the scene
const axesHelper = new THREE.AxesHelper(100);

// Create a new STLExporter instance
const STLexporter = new STLExporter();
const OBJexporter = new OBJExporter();

//==================================================================================================

const genreateLSystem = (rule) => {
    scene.clear();
    scene.add(axesHelper);

    // Define the points of the path
    const points = makeLSystem(rule);

    // Create a cylinder geometry and material
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);

    // Loop through your array of 3D points and create a mesh for each cylinder
    points.forEach(branch => {
        for (let i = 0; i < branch.length - 1; i++) {
            // Determine the position and rotation of the cylinder
            const start = branch[i];
            const end = branch[i + 1];
            const cylinderGeometry = new THREE.CylinderGeometry(end.radius, start.radius, start.distanceTo(end), 16, 1, false);
            const position = new THREE.Vector3().lerpVectors(start, end, 0.5);
            const direction = new THREE.Vector3().subVectors(end, start).normalize();
            const axis = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
            const angle = Math.acos(direction.dot(new THREE.Vector3(0, 1, 0)));
            const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);

            // Create the cylinder mesh and add it to the scene
            const cylinder = new THREE.Mesh(cylinderGeometry, material);
            cylinder.position.copy(position);
            cylinder.setRotationFromQuaternion(quaternion);
            scene.add(cylinder);

            // Create a sphere mesh and add it to the scene
            if (end.hasLeaf) {
                const sphere = new THREE.Mesh(sphereGeometry, material);
                sphere.position.copy(end);
                scene.add(sphere);
            }
        }
    });

    // calculate the bounding box of all objects in the scene
    const boundingBox = new THREE.Box3().setFromObject(scene);

    // calculate the center of the bounding box
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    // calculate the size of the bounding box
    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    // calculate the distance from the camera to the center of the bounding box
    const distance = size.length() / 3;

    // create a camera and set its position and target
    camera.position.set(distance, center.y, distance);
    camera.lookAt(center);

    // set the distance of the camera from the target
    controls.distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
}

// Animate the scene
const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

const getSystemData = () => {
    const rule = RULES[document.querySelector("#lsystem-select").value];
    rule.Axiom = document.querySelector("#axiom-input").value;
    rule.Angle = +document.querySelector("#angle-input").value;
    rule.Iterations = +document.querySelector("#iterations-input").value;
    rule.LineLength = +document.querySelector("#segment-length-input").value;
    rule.StartRadius = +document.querySelector("#start-radius-input").value;
    rule.alphabet = {};
    const rows = document.querySelectorAll("#alphabet-table tbody tr");
    rows.forEach(row => {
        const symbol = row.querySelector(".symbol-input").value;
        const alpharule = row.querySelector(".rule-input").value;
        rule.alphabet[symbol] = alpharule;
    });
    return rule;
}

const setupUI = () => {
    const downloadBtn = document.querySelector("#download-btn");
    downloadBtn.onclick = downloadScene;

    const renderBtn = document.querySelector("#render-btn");

    // Get all the input fields and the render button
    const axiomInput = document.getElementById('axiom-input');
    const angleInput = document.getElementById('angle-input');
    const iterationsInput = document.getElementById('iterations-input');
    const segmentLengthInput = document.getElementById('segment-length-input');
    const startRadiusInput = document.getElementById('start-radius-input');

    // Add event listeners to the input fields
    axiomInput.addEventListener('keyup', function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            renderBtn.click();
        }
    });

    angleInput.addEventListener('keyup', function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            renderBtn.click();
        }
    });

    iterationsInput.addEventListener('keyup', function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            renderBtn.click();
        }
    });

    segmentLengthInput.addEventListener('keyup', function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            renderBtn.click();
        }
    });

    startRadiusInput.addEventListener('keyup', function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            renderBtn.click();
        }
    });

    // Get the "Add Row" button
    const addRowBtn = document.querySelector("#add-row-btn");

    // Get the table and tbody elements
    const table = document.querySelector("#alphabet-table");
    const tbody = table.querySelector("tbody");

    const removeRow = (event) => {
        const rowIndex = event.target.closest("tr").rowIndex - 1;
        tbody.deleteRow(rowIndex);
    }

    // Add a click event listener to the "Add Row" button
    addRowBtn.addEventListener("click", () => {
        // Create a new row
        const newRow = document.createElement("tr");
        const symbolTd = document.createElement("td");
        const symbolInput = document.createElement("input");
        symbolInput.classList.add("input");
        symbolInput.classList.add("symbol-input");
        symbolInput.setAttribute("type", "text");
        symbolInput.setAttribute("placeholder", "Symbol");
        symbolTd.appendChild(symbolInput);

        const ruleTd = document.createElement("td");
        const ruleInput = document.createElement("input");
        ruleInput.classList.add("input");
        ruleInput.classList.add("rule-input");
        ruleInput.setAttribute("type", "text");
        ruleInput.setAttribute("placeholder", "Rule");
        ruleTd.appendChild(ruleInput);

        const removeBtnTd = document.createElement("td");
        const removeBtn = document.createElement("button");
        removeBtn.classList.add("button", "is-danger", "is-outlined", "remove-row-btn");
        removeBtn.textContent = "Remove";
        removeBtn.onclick = removeRow;
        removeBtnTd.appendChild(removeBtn);

        newRow.appendChild(symbolTd);
        newRow.appendChild(ruleTd);
        newRow.appendChild(removeBtnTd);

        // Add the new row to the table
        tbody.appendChild(newRow);
    });

    const lsystemSelect = document.querySelector("#lsystem-select");
    for (const rule in RULES) {
        const option = document.createElement('option');
        option.value = rule;
        option.text = rule;
        lsystemSelect.appendChild(option);
    }
    lsystemSelect.onchange = () => {
        const rule = RULES[lsystemSelect.value];
        axiomInput.value = rule.Axiom;
        angleInput.value = rule.Angle;
        iterationsInput.value = rule.Iterations;
        segmentLengthInput.value = rule.LineLength;
        startRadiusInput.value = rule.StartRadius;
        tbody.innerHTML = "";
        Object.keys(rule.alphabet).forEach(symbol => {
            addRowBtn.click();
            const lastRow = tbody.lastChild;
            const alphaRule = rule.alphabet[symbol];
            const symbolInput = lastRow.querySelector(".symbol-input");
            const ruleInput = lastRow.querySelector(".rule-input");
            symbolInput.value = symbol;
            ruleInput.value = alphaRule;
        })
        genreateLSystem(rule);
    };
    lsystemSelect.dispatchEvent(new Event('change'));

    renderBtn.onclick = () => {
        genreateLSystem(getSystemData());
    }

    document.querySelector("#save-system-btn").onclick = () => {
        const systemString = JSON.stringify(getSystemData());
        const link = document.createElement('a');
        const blob = new Blob([systemString], { type: 'text/plain' });
        link.href = URL.createObjectURL(blob);
        link.download = 'system.json';
        link.click();
    }

    const file = document.querySelector("#import-file");
    file.onchange = () => {
        file.files[0].text().then(text => {
            const system = JSON.parse(text);
            const systemName = file.files[0].name.replace(".json", "");
            axiomInput.value = system.Axiom;
            angleInput.value = system.Angle;
            iterationsInput.value = system.Iterations;
            segmentLengthInput.value = system.LineLength;
            startRadiusInput.value = system.StartRadius;
            tbody.innerHTML = "";
            Object.keys(system.alphabet).forEach(symbol => {
                addRowBtn.click();
                const lastRow = tbody.lastChild;
                const alphaRule = system.alphabet[symbol];
                const symbolInput = lastRow.querySelector(".symbol-input");
                const ruleInput = lastRow.querySelector(".rule-input");
                symbolInput.value = symbol;
                ruleInput.value = alphaRule;
            });
            lsystemSelect.appendChild(new Option(systemName, systemName, false, true));
            RULES[systemName] = system;
            genreateLSystem(system);
        });
    }

    const importBtn = document.querySelector("#import-system-btn");
    importBtn.onclick = () => {
        file.click();
    }
}

const downloadScene = () => {
    // Export the scene as an STL file
    const stlString = STLexporter.parse(scene);
    // Download the file
    const link = document.createElement('a');
    const blob = new Blob([stlString], { type: 'text/plain' });
    link.href = URL.createObjectURL(blob);
    link.download = 'scene.stl';
    link.click();
}

setupUI();
animate();