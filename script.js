function generateMarkovChain(text) {
    const words = text.split(/\s+/);
    const markovChain = {};

    for (let i = 0; i < words.length - 1; i++) {
        const word = words[i];
        const nextWord = words[i + 1];

        if (!markovChain[word]) {
            markovChain[word] = [];
        }
        markovChain[word].push(nextWord);
    }

    let currentWord = words[Math.floor(Math.random() * words.length)];
    let result = currentWord;

    for (let i = 0; i < 50; i++) { // Generate 50 words
        const nextWords = markovChain[currentWord];
        if (!nextWords) break;
        currentWord = nextWords[Math.floor(Math.random() * nextWords.length)];
        result += ' ' + currentWord;
    }

    return result;
}
