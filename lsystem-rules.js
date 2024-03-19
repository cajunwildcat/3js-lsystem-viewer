const RULES = {
    d3PlantRules: {
        alphabet: {
            'X': 'F^-[[!X]>&&<+!X]&+F[!^<+!X.]>&-[!X]',
            'F': 'FF'
        },
        Axiom: 'X',
        Angle: 25,
        Iterations: 6,
        LineLength: 5,
        StartRadius: 2.5
    },

    fernRules: {
        alphabet: {
            'X': 'F-[[X]+X]+F[+FX]-X',
            'F': 'FF'
        },
        Axiom: 'X',
        Angle: 25,
        Iterations: 6,
        LineLength: 5,
        StartRadius: 2.5
    },

    treeRules: {
        alphabet: {
            'A': 'f[++A][--A]>>>A',
        },
        Axiom: 'ffffA',
        Angle: 25,
        Iterations: 7,
        LineLength: 15,
        StartRadius: 2.5
    },

    tree2Rules: {
        alphabet: {
            'A': 'f[^B]>>[^B]>>A',
            'B': 'f[-B]B'
        },
        Axiom: 'FA',
        Angle: 30,
        Iterations: 7,
        StartRadius: 2.5,
        LineLength: 20,
        StartRadius: 2.5
    },

    GPTree: {
        alphabet: {
            'F': 'F[&FL<A]L[&FL<A]L[&FL<A][&FL<A]',
            'L': '[+F]F[-F][L]',
            'A': '^F[&FL<A]L'
        },
        Axiom: 'F',
        Angle: 25,
        Iterations: 3,
        LineLength: 34,
        StartRadius: 2.5
    },

    sierpinskiRules: {
        alphabet: {
            'f': 'F-f-F',
            'F': 'f+F+f'
        },
        Axiom: 'f',
        Angle: 60,
        Iterations: 6,
        LineLength: 5,
        StartRadius: 0.5
    },

    hilbertRules: {
        alphabet: {
            'X': '+<XF.+<XF.X^F.+>>XF.X-F.&>>XF.X^F.>X^>'
        },
        Axiom: 'X',
        Angle: 90,
        Iterations: 3,
        LineLength: 5,
        StartRadius: 1
    },

    pineRules: {
        alphabet: {
            'A': 'ff[&(90)TP++P++P++P++P]fAB',
            'P': '[^(10)fZ]',
            'Z': 'fBZ',
            'B': '[^(80)[f][+(70)[f]+(100)[f]][-(80)f]]',
            'T': '+(20)T'
        },
        Axiom: 'ffffA',
        Angle: 37,
        Iterations: 10,
        LineLength: 10,
        StartRadius: 1
    },

    shortTree: {
        alphabet: {
            "A": "[&FLA.]/////[&FLA.]///////[&FLA.]",
            "F": "S/////F",
            "S": "FL"
        },
        Axiom: "A",
        Angle: 41,
        Iterations: 7,
        LineLength: 5,
        StartRadius: 0.5
    },

    blank: {
        alphabet: {},
        Axiom: '',
        Angle: 0,
        Iterations: 0,
        LineLength: 0,
        StartRadius: 0
    }
}

export { RULES }