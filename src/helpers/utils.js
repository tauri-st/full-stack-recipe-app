const truncateText = (text, numWords=20) => { 
    if (text.length <= numWords) {
        return text;
    } else {
        const textArray = text.split(" ");
        const maxWords = textArray.slice(0, numWords);
        return maxWords.join(" ") + "...";
    }
};