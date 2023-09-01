/* 
1. Create elements and variables for those html elements in the javascript    
    - Title
    - Input field 
    - Get frequency button 
    - Get quote button 
    - Results container
    - Word information container
    - Past searches container 
    - Language dropdown container (if time)

2. Create function for grabbing the data we want from the word frequency api 
3. Create function for grabbing the data we want from the quote generator api 
4. Set the parameters for diffrent word frequency tiers (1000+ very common, 999-500 common, etc.)
    - Create classes for each tier of word frequency.
    -Tiers
        - Extremely Common (1000+)
        - Very Common (400+)
        - Common (80+)
        - (Uncommon 5+)
        - (Very Uncommon 1+)
        - (Rare .5 - 1)
        - (Extremely Rare < .5)
5. Create a function for determining the frequency of each word inputted, create a span for each word, and assign the class for each word 
based on word frequecy tier. 
6. Save searched words to local storage. 
7. Create a function for searching local storage for past searched words, and rendering those to the page if they exist. 
8. Create a function for changing the language based on what language is selected in the language drop down menu. 
9. Create a function so that when each word in the results container is clicked, information about that word and its exact frequency
of use is displayed in the appropriate container. 
10. Add stylings to make the user interface not terrible. 
*/

var inputField = document.querySelector("#input-field")
var quoteButton = document.querySelector("#quote-button")
var submitButton = document.querySelector("#submit-button")

function getInputtedText() {
     var wordInputted = inputField.value
    requesturl = `https://api.datamuse.com/words?sp=${wordInputted}&md=f`
    fetch(requesturl)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        console.log("data", data )
        var wordFrequencyValue = data[0].tags
        console.log(`wordFrequencyValue The frequency of ${wordInputted} is ${wordFrequencyValue}`)
    })
}

function getRandomNum (max) {
    return Math.floor(Math.random() * max);
}

function getQuote() {
    inputField.value = ""
    var slip_id = getRandomNum(220)
    quoteUrl = `https://api.adviceslip.com/advice/${slip_id}`
    fetch(quoteUrl)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        console.log("data", data )
        var quote = data.slip.advice
        inputField.value = quote
    })
}


quoteButton.addEventListener("click", getQuote)
submitButton.addEventListener("click", getInputtedText)
