function generateMarkovChain(text) {
    const Numbers = text.split(/\s+/);
    const markovChain = {};

    for (let i = 0; i < Numbers.length - 1; i++) {
        const Number = Numbers[i];
        const nextNumber = Numbers[i + 1];

        if (!markovChain[Number]) {
            markovChain[Number] = [];
        }
        markovChain[Number].push(nextNumber);
    }

    let currentNumber = Numbers[Math.floor(Math.random() * Numbers.length)];
    let result = currentNumber;

    for (let i = 0; i < 50; i++) { // Generate 50 Numbers
        const nextNumbers = markovChain[currentNumber];
        if (!nextNumbers) break;
        currentNumber = nextNumbers[Math.floor(Math.random() * nextNumbers.length)];
        result += ' ' + currentNumber;
    }
    document.getElementById("output").innerHTML = result;
    return result;
}
