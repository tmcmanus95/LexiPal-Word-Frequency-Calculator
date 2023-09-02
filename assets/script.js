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
document.addEventListener("DOMContentLoaded", function () {
  var languageIcon = document.querySelector("#language-icon");
  var languageToggles = document.querySelectorAll(
    'input[type="radio"][name="language-tab"]'
  );
  var languageContainer = document.querySelector("#languages-container");
  var titleTextLine = document.querySelector("#title-text");
  var inputField = document.querySelector("#input-field");
  var quoteButton = document.querySelector("#quote-button");
  var submitButton = document.querySelector("#submit-button");
  var resultsContainer = document.querySelector("#results-container");
  var wordFrequencyDisplay = document.querySelector("#word-frequency-display");
  var pastSearchesLine = document.querySelector("#past-searches-line");
  var pastSearchesContainer = document.querySelector("#past-searches");
  var clearButton = document.querySelector("#clear-past-searches-button");

  async function getFrequency(wordInputted) {
    requesturl = `https://api.datamuse.com/words?sp=${wordInputted}&md=f`;
    const response = await fetch(requesturl);
    const data = await response.json();
    var frequencyRate = data[0].tags[0].split(":")[1];
    return frequencyRate;
  }

  function getRandomNum(max) {
    return Math.floor(Math.random() * max);
  }

  function getQuote() {
    inputField.value = "";
    var slip_id = getRandomNum(220);
    quoteUrl = `https://api.adviceslip.com/advice/${slip_id}`;
    fetch(quoteUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var quote = data.slip.advice;
        inputField.value = quote;
      });
  }

  function assignFrequencyClass(wordSpan, frequencyRate) {
    if (frequencyRate > 1000) {
      wordSpan.classList.add("extremely-common");
    } else if (frequencyRate >= 400 && frequencyRate < 1000) {
      wordSpan.classList.add("very-common");
    } else if (frequencyRate >= 80 && frequencyRate < 400) {
      wordSpan.classList.add("common");
    } else if (frequencyRate >= 5 && frequencyRate < 80) {
      wordSpan.classList.add("uncommon");
    } else if (frequencyRate >= 1 && frequencyRate < 5) {
      wordSpan.classList.add("very-uncommon");
    } else if (frequencyRate > 0.5 && frequencyRate < 1) {
      wordSpan.classList.add("rare");
    } else {
      wordSpan.classList.add("extremely-rare");
    }
  }

  async function setFrequency(expandedText) {
    //Removed saveToLocalStorage function and added it to the expandContractionWords function
    resultsContainer.textContent = "";
    pastSearchesLine.style.display = "inline";
    clearButton.style.display = "inline";
    var arrayOfUserInput = expandedText.match(/[a-zA-Z]+('[a-zA-Z]+')*/g);
    var punctuationWordsArray = expandedText.match(/\S+/g);
    if (arrayOfUserInput.length <= 140) {
      for (let i = 0; i < arrayOfUserInput.length; i++) {
        const wordInputted = arrayOfUserInput[i];
        const frequencyRate = await getFrequency(wordInputted);
        const punctuationWord = punctuationWordsArray[i];
        const wordSpan = document.createElement("span");
        wordSpan.textContent = punctuationWord + " ";
        assignFrequencyClass(wordSpan, frequencyRate);
        resultsContainer.appendChild(wordSpan);
        wordSpan.addEventListener("click", () =>
          getSelectedWordFrequency(punctuationWord, frequencyRate)
        );
      }
    }
  }

  function saveToLocalStorage(textInput, savedSearches) {
    savedSearches.push(textInput);
    localStorage.setItem("Past Searches", JSON.stringify(savedSearches));
    updatePastSearches();
  }

  function expandContractionWords(textInput) {
    saveToLocalStorage(textInput, savedSearches);
    //Dictionary of contractions
    const contractionWords = {
      "don't": "do not",
      "won't": "will not",
      "can't": "cannot",
      "i'm": "I am",
      "it's": "it is",
      "they're": "they are",
      "he's": "he is",
      "you're": "you are",
      //We will add a bunch more contractions here.
    };

    //Creates an array containing all inputted word, split at the space using regex
    const contractedWords = textInput.split(/\s+/);

    //Initiates an empty array for the new expanded words to be added to.
    const expandedWords = [];

    //Loops through the contractedWords array, looks for matches in the dictionary. Then adds the expanded versions to the expandedWords array.
    for (i = 0; i < contractedWords.length; i++) {
      word = contractedWords[i];
      const expandedWord = contractionWords[word] || word;
      expandedWords.push(expandedWord);
    }

    const expandedText = expandedWords.join(" ");

    //Returns the expanded text, which is then fed back into the setFrequency function instead of the inital user input.
    return expandedText;
  }

  function getSelectedWordFrequency(punctuationWord, frequencyRate) {
    var selectedLanguage = document.querySelector(
      'input[name="language-tab"]:checked'
    ).id;
    wordFrequencyDisplay.textContent = "";
    if (selectedLanguage === "korean-tab") {
      wordFrequencyDisplay.textContent = `평균적으로, ${punctuationWord}이라는 단어는 영어로 백만 단어 당 ${frequencyRate} 나타납니다.`;
    } else if (selectedLanguage === "polish-tab") {
      wordFrequencyDisplay.textContent = `Średnio te słowo ${punctuationWord}, pokazuje się ${frequencyRate} razy na milion po Angielsku`;
    } else {
      wordFrequencyDisplay.textContent = `On average, the word, ${punctuationWord} appears ${frequencyRate} times per million words in English.`;
    }
  }

  function changeLanguage(event) {
    if (event.target.checked) {
      const selectedLanguage = event.target.id;
      wordFrequencyDisplay.textContent = "";
      switch (selectedLanguage) {
        case "english-tab":
          titleTextLine.textContent = "Check Word Frequency";
          submitButton.textContent = "Get Frequency";
          quoteButton.textContent = "Get quote";
          inputField.placeholder = "Paste text or generate random quote?";
          pastSearchesLine.textContent = "Past Searches";
          clearButton.textContent = "Clear";
          languageContainer.style.display = "none";

          break;
        case "korean-tab":
          titleTextLine.textContent = "영어 단어 빈도를 계산기";
          submitButton.textContent = "빈도를 찾기";
          quoteButton.textContent = "인용문을 생성하기";
          inputField.placeholder = "텍스트를 입력하거나 인용문를 생성하세요";
          pastSearchesLine.textContent = "이전 검색";
          clearButton.textContent = "치우기";
          languageContainer.style.display = "none";

          break;
        case "polish-tab":
          titleTextLine.textContent = "Sprawdź Częstotliwość Słów Angielskich";
          submitButton.textContent = "Znajdź Częstotliwość Słów";
          quoteButton.textContent = "Generuj Losową Cytatę";
          inputField.placeholder =
            "Wpisz tutaj tekst lub wygeneruj losowe słowo";
          pastSearchesLine.textContent = "Przeszłe Wyszukiwania";
          clearButton.textContent = "Wyczyść";
          languageContainer.style.display = "none";
          break;
        default:
      }
    }
  }

  function updatePastSearches() {
    pastSearchesContainer.textContent = "";
    savedSearches = [];
    var pastSearches = JSON.parse(localStorage.getItem("Past Searches")) || [];
    pastSearches.forEach(function (pastSearch) {
      savedSearches.push(pastSearch);
      var pastSearchLine = document.createElement("p");
      pastSearchLine.className = "past-search-row";
      pastSearchLine.textContent = pastSearch;
      pastSearchesContainer.appendChild(pastSearchLine);
    });
    if (pastSearches.length > 0) {
      pastSearchesLine.style.display = "inline";
      clearButton.style.display = "inline";
    }

    return savedSearches;
  }

  function removeSearches() {
    pastSearchesContainer.textContent = "";
    window.localStorage.removeItem("Past Searches");
    savedSearches = [];
  }

  function showLanguages() {
    if (languageContainer.style.display === "inline") {
      languageContainer.style.display = "none";
    } else {
      languageContainer.style.display = "inline";
    }
  }

  quoteButton.addEventListener("click", getQuote);
  updatePastSearches();

  //The submit button now calls both functions asyncronously, waiting for one to finish before running the other.
  submitButton.addEventListener("click", async function () {
    const expandedText = expandContractionWords(inputField.value);
    await setFrequency(expandedText);
  });

  languageIcon.addEventListener("click", showLanguages);

  languageToggles.forEach((languageToggle) => {
    languageToggle.addEventListener("change", changeLanguage);
  });

  clearButton.addEventListener("click", removeSearches);
});
