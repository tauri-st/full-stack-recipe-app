const truncateText = (text, numWords=20) => { 
    /*
    TODO: Check if the total words shorter or equal to numWords, return as is
    TODO: If yes, return as is
    TODO: If not, return first 20 words
        TODO: Add ellipsis
    * Will need to go from string to an array back to a string again
    */
   if (text.length <= numWords)
    return text;
};