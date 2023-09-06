document.addEventListener("DOMContentLoaded", function () {
  var languageIcon = document.querySelector("#language-icon");
  var languageToggles = document.querySelectorAll(
    'input[type="radio"][name="language-tab"]'
  );
  var languageContainer = document.querySelector("#languages-container");
  var titleTextLine = document.querySelector("#title-text");
  var appDescriptionLine = document.querySelector("#app-description-line");
  var errorMessageLine = document.querySelector("#error-message-line");
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
    try {
      if (data[0].tags.length === 0) {
        return 0;
      }
      if (data[0].tags && data[0].tags.length > 0) {
        var frequencyRate = data[0].tags[0].split(":")[1];
        return frequencyRate;
      } else {
        return 0;
      }
    } catch (error) {
      console.log("Error occured, ");
    }
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
    } else if (frequencyRate > 0.001 && frequencyRate < 0.5) {
      wordSpan.classList.add("extremely-rare");
    } else {
      wordSpan.classList.add("error");
    }
  }

  async function setFrequency(expandedText) {
    resultsContainer.textContent = "";
    pastSearchesLine.style.display = "inline";
    clearButton.style.display = "inline";
    console.log("Expanded Text, ", expandedText);
    var arrayOfUserInput = expandedText.split(/ *- *| +|—+/);
    console.log("array: ", arrayOfUserInput);
    var noHyphensArray = arrayOfUserInput.map(function (word) {
      return word.replace(/-/g);
    });
    console.log("this is the no hyphens array, ", noHyphensArray);
    var noHyphensOrUndefinedArray = noHyphensArray.filter(function (word) {
      return word !== "undefined";
    });
    console.log(
      "This is the no hyphens or undefined array, I hope, ",
      noHyphensOrUndefinedArray
    );
    var noHyphensOrUndefinedString = noHyphensArray.join(" ");
    var noNumbersString = noHyphensOrUndefinedString.replace(
      /[^a-zA-Z\s;,.?'!-]+/g,
      ""
    );
    var noNumbersArray = noNumbersString.split(" ");
    console.log("This is the no numbers array, ", noNumbersArray);
    console.log("This is the new string with no numbers, ", noNumbersString);
    // var noNumbersArray = noNumbersString.join(" ");
    console.log("This is the new array with no numbers, ", noNumbersArray);
    var apiSearchableArray = noHyphensOrUndefinedString.match(
      /[a-zA-Z]+('[a-zA-Z]+)*|('[a-zA-Z]+)+|-|\d+/g
    );
    console.log("This is what the api will search, ", apiSearchableArray);

    console.log(
      "The apiSearchableArray is this long, ",
      apiSearchableArray.length
    );
    console.log(
      "The noHypensOrUndefinedArray is this long, ",
      noHyphensOrUndefinedArray.length
    );
    for (let i = 0; i < apiSearchableArray.length; i++) {
      if (apiSearchableArray.length === noHyphensOrUndefinedArray.length) {
        const wordInputted = apiSearchableArray[i];
        const punctuationWord = noHyphensOrUndefinedArray[i];
        console.log("I am about to search: ", wordInputted);

        // Check if the word contains only letters and apostrophes (no numbers)
        if (!wordInputted.endsWith("'s") && wordInputted !== undefined) {
          const frequencyRate = await getFrequency(wordInputted);
          const wordSpan = document.createElement("span");
          console.log("the punctuation word is, ", punctuationWord);
          wordSpan.textContent = punctuationWord + " ";
          wordSpan.id = "word";
          assignFrequencyClass(wordSpan, frequencyRate);
          resultsContainer.appendChild(wordSpan);
          wordSpan.addEventListener("click", () =>
            getSelectedWordFrequency(wordInputted, frequencyRate)
          );
        } else if (wordInputted.endsWith("'s") && wordInputted !== undefined) {
          console.log("this word ends with 's: ", wordInputted);
          const wordBeforeApostrophe = wordInputted.replace(/'s$/, ""); //This line grabs the value that is before the "'s"
          //The function then runs as normal again, but with the form of the word without the "'s."
          const wordSpan = document.createElement("span");
          const frequencyRate = await getFrequency(wordBeforeApostrophe);
          assignFrequencyClass(wordSpan, frequencyRate);
          wordSpan.textContent = wordInputted + " ";
          wordSpan.id = "word";
          resultsContainer.appendChild(wordSpan);
          wordSpan.addEventListener("click", () =>
            getSelectedWordFrequency(wordBeforeApostrophe, frequencyRate)
          );
        }
      } else {
        const wordInputted = apiSearchableArray[i];
        const punctuationWord = noHyphensOrUndefinedArray[i];
        console.log("I am about to search: ", wordInputted);

        // Check if the word contains only letters and apostrophes (no numbers)
        if (!wordInputted.endsWith("'s") && wordInputted !== undefined) {
          const frequencyRate = await getFrequency(wordInputted);
          const wordSpan = document.createElement("span");
          console.log("the punctuation word is, ", punctuationWord);
          wordSpan.textContent = wordInputted + " ";
          wordSpan.id = "word";
          assignFrequencyClass(wordSpan, frequencyRate);
          resultsContainer.appendChild(wordSpan);
          wordSpan.addEventListener("click", () =>
            getSelectedWordFrequency(wordInputted, frequencyRate)
          );
        } else if (wordInputted.endsWith("'s") && wordInputted !== undefined) {
          console.log("this word ends with 's: ", wordInputted);
          const wordBeforeApostrophe = wordInputted.replace(/'s$/, ""); //This line grabs the value that is before the "'s"
          //The function then runs as normal again, but with the form of the word without the "'s."
          const wordSpan = document.createElement("span");
          const frequencyRate = await getFrequency(wordBeforeApostrophe);
          assignFrequencyClass(wordSpan, frequencyRate);
          wordSpan.textContent = wordInputted + " ";
          wordSpan.id = "word";
          resultsContainer.appendChild(wordSpan);
          wordSpan.addEventListener("click", () =>
            getSelectedWordFrequency(wordBeforeApostrophe, frequencyRate)
          );
        }
      }
    }
  }

  function saveToLocalStorage(textInput, savedSearches) {
    savedSearches.push(textInput);
    localStorage.setItem("Past Searches", JSON.stringify(savedSearches));
    updatePastSearches();
  }

  function expandContractionWords(textInput) {
    var inputArray = textInput.split(" ");
    if (inputArray.length <= 14000) {
      saveToLocalStorage(textInput, savedSearches);
      //Dictionary of contractions
      const contractionWords = {
        "don't": "do not",
        "Don't": "Do not",
        "won't": "will not",
        "can't": "cannot",
        "I'm": "I am",
        "it's": "it is",
        "It's": "It is",
        "they're": "they are",
        "he's": "he is",
        "you're": "you are",
        "doesn't": "does not",
        "Doesn't": "Does not",
        //We will add a bunch more contractions here.
      };

      //Creates an array containing all inputted word, split at the space using regex
      const trimmedText = textInput.trim();
      const contractedWords = trimmedText.split(/\s+/);

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
      console.log(expandedText);
      return expandedText;
    } else {
      submitFewerMessage = document.createElement("h3");
      submitFewerMessage.textContent =
        "Please submit fewer than 50 words at a time.";
      errorMessageLine.appendChild(submitFewerMessage);
      setTimeout(() => {
        errorMessageLine.removeChild(submitFewerMessage);
      }, 2000);
      return;
    }
  }

  function getSelectedWordFrequency(wordInputted, frequencyRate) {
    if (frequencyRate !== undefined) {
      wordFrequencyDisplay.removeAttribute("class");
      assignFrequencyClass(wordFrequencyDisplay, frequencyRate);
      var selectedLanguage = document.querySelector(
        'input[name="language-tab"]:checked'
      ).id;
      wordFrequencyDisplay.textContent = "";
      if (selectedLanguage === "korean-tab") {
        wordFrequencyDisplay.textContent = `평균적으로, "${wordInputted}"이라는 단어는 영어로 백만 단어 당 ${frequencyRate} 나타납니다.`;
      } else if (selectedLanguage === "polish-tab") {
        wordFrequencyDisplay.textContent = `Średnio te słowo, "${wordInputted}" pokazuje się ${frequencyRate} razy na milion po Angielsku`;
      } else {
        wordFrequencyDisplay.textContent = `On average, the word, "${wordInputted}" appears ${frequencyRate} times per million words in English.`;
      }
    } else {
      var selectedLanguage = document.querySelector(
        'input[name="language-tab"]:checked'
      ).id;
      wordFrequencyDisplay.textContent = "";
      wordFrequencyDisplay.classList.add("error");
      if (selectedLanguage === "korean-tab") {
        wordFrequencyDisplay.textContent = `I could not get a frequency value for ${wordInputted}.`;
      } else if (selectedLanguage === "polish-tab") {
        wordFrequencyDisplay.textContent = `I could not get a frequency value for ${wordInputted}.`;
      } else {
        wordFrequencyDisplay.textContent = `I could not get a frequency value for ${wordInputted}.`;
      }
    }
  }

  function changeLanguage(event) {
    if (event.target.checked) {
      wordFrequencyDisplay.removeAttribute("class");
      languageIcon.style.display = "inline";
      const selectedLanguage = event.target.id;
      wordFrequencyDisplay.textContent = "";
      switch (selectedLanguage) {
        case "english-tab":
          appDescriptionLine.textContent =
            "Check the frequency of English words per million instances";
          submitButton.textContent = "Get Frequency";
          quoteButton.textContent = "Get quote";
          inputField.placeholder = "Paste text or generate random quote?";
          pastSearchesLine.textContent = "Past Searches";
          clearButton.textContent = "Clear";
          languageContainer.style.display = "none";

          break;
        case "korean-tab":
          appDescriptionLine.textContent = "영어 단어 빈도를 계산기";
          submitButton.textContent = "빈도를 찾기";
          quoteButton.textContent = "인용문을 생성하기";
          inputField.placeholder = "텍스트를 입력하거나 인용문를 생성하세요";
          pastSearchesLine.textContent = "이전 검색";
          clearButton.textContent = "치우기";
          languageContainer.style.display = "none";

          break;
        case "polish-tab":
          appDescriptionLine.textContent =
            "Sprawdź Częstotliwość Słów Angielskich";
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
      pastSearchLine.addEventListener("click", function () {
        inputField.textContent = "";
        inputField.textContent = pastSearch;
      });
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
    clearButton.style.display = "none";
    pastSearchesLine.style.display = "none";
  }

  function showLanguages() {
    languageIcon.style.display = "";
    if (languageContainer.style.display === "inline") {
      languageContainer.style.display = "none";
    } else {
      languageContainer.style.display = "inline";
    }
  }

  function getPoem() {
    requestURl = "https://poetrydb.org/linecount,random/5;1";
    fetch(requestURl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log("DATA:", data);
        poemArray = data[0].lines;
        poet = data[0].author;
        poemString = poemArray.join(" ");
        inputField.value = poemString + "\n" + poet;
      });
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
