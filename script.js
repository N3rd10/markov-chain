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

let noteAmount = 10;
let notePlayWait = 0;

// Global audio context
let audioContext;

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
function playNote(frequency, startTime) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine'; // Type of wave
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start(startTime); // Start at the specified time
    oscillator.stop(startTime + 0.5); // Stop after 0.5 seconds
}

// Function to simulate the Markov chain
function simulateMarkovChain(startState, steps) {
    console.log("Simulating Markov Chain..."); // Debug log

    // Initialize audio context if it hasn't been already
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

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

    // Log the generated sequence
    console.log("Generated Sequence:", stateSequence);

    // Play notes based on the generated sequence with a delay
    let delay = 0; // Initialize delay
    stateSequence.forEach(state => {
        setTimeout(() => {
            if (noteFrequencies[state]) {
                console.log("Playing note:", noteFrequencies[state], "at delay:", delay);
                playNote(noteFrequencies[state], audioContext.currentTime + delay); // Start playing at the current time + delay
            } else {
                console.error("Invalid state:", state);
            }
        }, delay * 1000); // Convert delay to milliseconds
        delay += notePlayWait > 0 ? notePlayWait : 0.5; // Ensure a minimum delay
    });

    return stateSequence;
}

// Simulate the Markov chain when the button is clicked
document.getElementById("simulateButton").onclick = function() {
    console.log("Simulate button clicked!"); // Debug log
    const initialState = 1; // Starting state
    const steps = 10;       // Number of steps to simulate
    const result = simulateMarkovChain(initialState, steps);
    
    // Display the result in the output paragraph
    document.getElementById("output").innerText = "Simulated Markov Chain: " + result.join(", ");
};

// Test sound button functionality
document.getElementById("testSoundButton").onclick = function() {
    playNote(261.63, audioContext.currentTime); // Play C4 immediately
};
