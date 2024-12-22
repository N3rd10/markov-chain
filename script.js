// State space
const states = [1, 2, 3, 4, 5];

// Function to get the transition probability matrix from the table
function getTransitionMatrix() {
    const matrix = [];
    const table = document.getElementById("probabilityTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) { // Skip header row
        const inputs = rows[i].getElementsByTagName("input");
        const probabilities = [];
        for (let j = 0; j < inputs.length; j++) {
            probabilities.push(parseFloat(inputs[j].value));
        }
        matrix.push(probabilities);
    }
    return matrix;
}

// Function to simulate the Markov chain
function simulateMarkovChain(startState, steps) {
    const P = getTransitionMatrix(); // Get the updated transition matrix
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

// Simulate the Markov chain when the button is clicked
document.getElementById("simulateButton").onclick = function() {
    const initialState = 1; // Starting state
    const steps = 10;       // Number of steps to simulate
    const result = simulateMarkovChain(initialState, steps);
    
    // Display the result in the output paragraph
    document.getElementById("output").innerText = "Simulated Markov Chain: " + result.join(", ");
};
