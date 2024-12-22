// State space
const states = [1, 2, 3, 4, 5];

// Define frequencies for each state (note)
const noteFrequencies = {
    1: 261.63, // C4
    2: 293.66, // D4
    3: 329.63, // E4
    4: 349.23, // F4
    5: 392.00  // G4
};

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

// Function to play a note
function playNote(frequency) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine'; // Type of wave
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5); // Play for 0.5 seconds
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

    // Play notes based on the generated sequence
    stateSequence.forEach(state => {
        playNote(noteFrequencies[state]);
    });

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
