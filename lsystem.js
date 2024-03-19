import { Turtle } from './turtle.js';
import * as THREE from 'three';
import { MathUtils } from 'three';

const makeLSystem = (rule) => {
    let turtle = new Turtle(rule.StartRadius, new THREE.Vector3(0, 0, 0));
    let lineDistance = rule.LineLength;
    let angleOfChange = MathUtils.degToRad(rule.Angle);

    const interpretByLetter = {
        //go forward by lineDistance and place a point
        'F': (distance = lineDistance) => { turtle.forward(distance) },
        'f': (distance = lineDistance) => { turtle.forward(distance) },
        //push to the stack, which is used to store the state information before branching
        '[': () => { turtle.pushState(); },
        //pop to the stack, which is used to return to the state before branching
        ']': () => { turtle.popState(); },
        //turn left, which changes phi
        '+': (angle = angleOfChange) => { turtle.turnLeft(angle) },
        //turn right, which changes phi
        '-': (angle = angleOfChange) => { turtle.turnRight(angle) },
        //pitch down
        '&': (angle = angleOfChange) => { turtle.pitchDown(angle) },
        //pitch up
        '^': (angle = angleOfChange) => { turtle.pitchUp(angle) },
        //roll left
        '<': (angle = angleOfChange) => { turtle.rollLeft(angle); },
        '\\': (angle = angleOfChange) => { turtle.rollLeft(angle); },
        //roll right
        '>': (angle = angleOfChange) => { turtle.rollRight(angle); },
        '/': (angle = angleOfChange) => { turtle.rollRight(angle); },
        //turn around
        '|': () => { turtle.turnAround(); },
        //shrink diameter
        '!': (factor = 0.9) => { turtle.shrinkRadius(factor); },
        //add a leaf
        '.': () => { turtle.addLeaf(); }
    };

    //gernerate the lsystem string by applying the rules to the axiom
    let stringToExpand = rule.Axiom;
    const numIterations = rule.Iterations;
    for (let iteration = 0; iteration < numIterations; iteration++) {
        let newString = '';
        for (let i = 0; i < stringToExpand.length; i++) {
            const letter = stringToExpand[i];
            let appliedRule = rule.alphabet[letter];
            if (appliedRule === undefined) {
                appliedRule = letter;
            }
            newString += appliedRule;
        }
        stringToExpand = newString;
    }

    // Loop over the string stringToExpand
    for (let i = 0; i < stringToExpand.length; i++) {
        let letter = stringToExpand[i];
        const interpret = interpretByLetter[letter];
        //acount for genreation characters that don't get interpreted
        if (interpretByLetter[letter] === undefined) {
            continue;
        }

        if (stringToExpand[i + 1] === '(') {
            let endI = stringToExpand.indexOf(')', i + 1);
            let param = +stringToExpand.substring(i + 2, endI);

            interpret(param);
            //set the index of the string to the ending parenthesis so the next iteration of the loop starts at the character after it
            i = endI;
        }
        else {
            interpret();
        }
    }

    let points = turtle.vertices;

    ///remove any branhces that only have 1 point in it
    for (let i = 0; i < points.length;) {
        if (points[i].length === 1) {
            points.splice(i, 1);
        }
        else {
            i++;
        }
    }

    return points;
}

export { makeLSystem }