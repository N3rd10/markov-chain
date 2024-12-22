// Transition probability matrix
const P = [
    [0, 0.75, 0, 0.25, 0],  // Transitions from state 1
    [0.5, 0, 1, 0, 0],      // Transitions from state 2
    [0, 0.33, 0, 0.33, 0.33], // Transitions from state 3
    [0, 0, 0, 0, 1],        // Transitions from state 4
    [0, 0, 0, 0, 0]         // Transitions from state 5
];

// State space
const states = [1, 2, 3, 4, 5];

// Function to simulate the Markov chain
function simulateMarkovChain(startState, steps) {
    let currentState = startState;
    const stateSequence = [currentState];

    for (let i = 0; i < steps; i++) {
        const currentStateIndex = states.indexOf(currentState);
        const probabilities = P[currentStateIndex];

        // Generate a random number between 0 and 1
        const randomNum = Math.random();
        let cumulativeProbability = 0;

        // Determine the next state based on the probabilities
        for (let j = 0; j < probabilities.length; j++) {
            cumulativeProbability += probabilities[j];
            if (randomNum < cumulativeProbability) {
                currentState = states[j];
                break;
            }
        }

        stateSequence.push(currentState);
    }

    return stateSequence;
}

// Simulate the Markov chain
const initialState = 1; // Starting state
const steps = 10;       // Number of steps to simulate
const result = simulateMarkovChain(initialState, steps);
console.log("Simulated Markov Chain:", result);
