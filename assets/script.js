document.addEventListener("DOMContentLoaded", function () {
  // var backgroundPicture = document.querySelector("#background-image");
  // var restOfBackground = document.querySelector("#rest-of-background");
  // var themeChoices = document.querySelector("#theme-choices-dropdown");
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

  //takes in expanded text
  async function setFrequency(expandedText) {
    resultsContainer.textContent = ""; // resets results container.
    pastSearchesLine.style.display = "inline"; // makes past searches text inline.
    clearButton.style.display = "inline"; // makes clear button inline instead of hidden.
    var arrayOfUserInput = expandedText.split(/ *- *| +|—+/); // array is created by splitting the string at spaces, hyphens, and dashes.
    var noHyphensArray = arrayOfUserInput.map(function (word) {
      // gets rid of all hyphens to prevent bugs.
      return word.replace(/-/g);
    });

    var noHyphensOrUndefinedArray = noHyphensArray.filter(function (word) {
      return word !== "undefined";
    }); // only returns items that are undefined.
    var noHyphensOrUndefinedString = noHyphensArray.join(" "); // turning noHyphensArray into a string.
    var apiSearchableArray = noHyphensOrUndefinedString.match(
      // regex method that returns anything that is text followed by an apostraphy or text or hyphen or numerical digits.
      /[a-zA-Z]+('[a-zA-Z]+)*|('[a-zA-Z]+)+|-|\d+/g
    );

    for (let i = 0; i < apiSearchableArray.length; i++) {
      if (apiSearchableArray.length === noHyphensOrUndefinedArray.length) {
        // checking for descrepencies between api searchable words and punctuation words.
        const wordInputted = apiSearchableArray[i];
        const punctuationWord = noHyphensOrUndefinedArray[i];

        // Check if the word does not end in apostraphy s. Also checks if it is not undefined.
        if (!wordInputted.endsWith("'s") && wordInputted !== undefined) {
          const frequencyRate = await getFrequency(wordInputted); // calls api with word input.
          const wordSpan = document.createElement("span"); // creates element for that word.
          wordSpan.textContent = punctuationWord + " "; // sets text content to punctuation accurate version of that word.
          wordSpan.id = "word";
          assignFrequencyClass(wordSpan, frequencyRate); // calls frequency class fuction to alter the background color of that word.
          resultsContainer.appendChild(wordSpan); //appends element
          wordSpan.addEventListener(
            "click",
            () => getSelectedWordFrequency(wordInputted, frequencyRate) // adds event listener to each each word that returns specific information about thgat word when clicked.
          );
        } else if (wordInputted.endsWith("'s") && wordInputted !== undefined) {
          // if word ends with apostraphy s does the same as the above steps.
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
        // if length of 2 arrays are different does the same as above, but instead of text content to puctuation word, sets to the word the api has searched.
        const wordInputted = apiSearchableArray[i];
        const punctuationWord = noHyphensOrUndefinedArray[i];
        console.log("I am about to search: ", wordInputted);

        // Check if the word contains only letters and apostrophes (no numbers)
        if (!wordInputted.endsWith("'s") && wordInputted !== undefined) {
          const frequencyRate = await getFrequency(wordInputted);
          const wordSpan = document.createElement("span");
          console.log("the punctuation word is, ", punctuationWord);
          wordSpan.textContent = wordInputted + " "; // change occurs here.
          wordSpan.id = "word";
          assignFrequencyClass(wordSpan, frequencyRate);
          resultsContainer.appendChild(wordSpan);
          wordSpan.addEventListener("click", () =>
            getSelectedWordFrequency(wordInputted, frequencyRate)
          );
        } else if (wordInputted.endsWith("'s") && wordInputted !== undefined) {
          console.log("this word ends with 's: ", wordInputted);
          const wordBeforeApostrophe = wordInputted.replace(/'s$/, "");
          const wordSpan = document.createElement("span");
          const frequencyRate = await getFrequency(wordBeforeApostrophe);
          assignFrequencyClass(wordSpan, frequencyRate);
          wordSpan.textContent = wordInputted + " "; // change occurs here.
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
    // turns inputted tex into an array
    var inputArray = textInput.split(" ");
    // only runs fuction if input is fewer than 140 words
    if (inputArray.length <= 140) {
      // saves searches into local storage.
      saveToLocalStorage(textInput, savedSearches);
      //Dictionary of contractions
      const contractionWords = {
        "don't": "do not",
        "Don't": "Do not",
        "won't": "will not",
        "Won't": "Will not",
        "can't": "can not",
        "Can't": "Can not",
        "I'm": "I am",
        "it's": "it is",
        "It's": "It is",
        "they're": "they are",
        "he's": "he is",
        "you're": "you are",
        "You're": "You are",
        "doesn't": "does not",
        "Doesn't": "Does not",
        "they've": "they have",
        "They've": "They have",
        "I'd": "I would",
        "I'll": "I will",
        "he's": "he is",
        "He's": "He is",
        "she's": "she is",
        "She's": "She is",
        "She'll": "She will",
        "she'll": "she will",
        "He'll": "He will",
        "he'll": "he will",
        "There's": "There is",
        "there's": "there is",
        "who's": "who is",
        "Who's": "Who is",
        "You'd": "You would",
        "you'd": "you would",
        "We'd": "We Would",
        "we'd": "we would",
        "Who'd": "Who would",
        "who'd": "who would",
        "why'd": "why would",
        "Why'd": "Why would",
        "how'd": "how would",
        "How'd": "How would",
        "Why's": "Why is",
        "why's": "why is",
        "you've": "you have",
        "You've": "You have",
        "could've": "could have",
        "Could've": "Could have",
        "He'd": "He would",
        "he'd": "he would",
        "Here's": "Here is",
        "here's": "here is",
        "He's": "He is",
        "he's": "he is",
        "She's": "She is",
        "she's": "she is",
        "How'd": "How did",
        "how'd": "how did",
        "I've": "I have",
        "Might've": "Might have",
        "might've": "might have",
        "Let's": "Let us",
        "let's": "let us",
        "Should've": "Should have",
        "should've": "should have",
        "Would've": "Would have",
        "would've": "would have",
        "That'll": "That will",
        "that'll": "that will",
        "That's": "That is",
        "that's": "that is",
        "aren't": "are not",
        "Aren't": "Are not",
        "Couldn't": "Could not",
        "couldn't": "could not",
        "shouldn't": "should not",
        "Shouldn't": "Should not",
        "Wouldn't": "Would not",
        "wouldn't": "would not",
        "Wasn't": "Was not",
        "wasn't": "was not",
        "Weren't": "Were not",
        "weren't": "were not",
        "mustn't": "must not",
        "Mustn't": "Must not",
        "That'd": "That would",
        "that'd": "that would",
        "These're": "These are",
        "these're": "these are",// comment
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
      // turns expanded words array into a string.
      const expandedText = expandedWords.join(" ");

      //Returns the expanded text, which is then fed back into the setFrequency function instead of the inital user input.

      return expandedText;
      //if input is bigger than 140 words, returns error message.
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
      // checks that word frequency exists.
      wordFrequencyDisplay.removeAttribute("class");
      assignFrequencyClass(wordFrequencyDisplay, frequencyRate); // call assignfrequency class to change background color of wordFrequencyDisplay.
      var selectedLanguage = document.querySelector(
        'input[name="language-tab"]:checked'
      ).id; // checks language display, and responds accordingly.
      wordFrequencyDisplay.textContent = "";
      if (selectedLanguage === "korean-tab") {
        wordFrequencyDisplay.textContent = `평균적으로, "${wordInputted}"이라는 단어는 영어로 백만 단어 당 ${frequencyRate} 나타납니다.`;
      } else if (selectedLanguage === "polish-tab") {
        wordFrequencyDisplay.textContent = `Średnio te słowo, "${wordInputted}" pokazuje się ${frequencyRate} razy na milion po Angielsku`;
      } else {
        wordFrequencyDisplay.textContent = `On average, the word, "${wordInputted}" appears ${frequencyRate} times per million words in English.`;
      }
    } else {
      // if frequency rate is undefined returns error message.
      var selectedLanguage = document.querySelector(
        'input[name="language-tab"]:checked'
      ).id;
      wordFrequencyDisplay.textContent = "";
      wordFrequencyDisplay.classList.add("error");
      if (selectedLanguage === "korean-tab") {
        wordFrequencyDisplay.textContent = `I could not get a frequency value for ${wordInputted}.`;
      } else if (selectedLanguage === "polish-tab") {
        wordFrequencyDisplay.textContent = `I could not get a frequency value for ${wordInputted}.`;
      } else if (selectedLanguage === "mandarin-tab") {
        wordFrequencyDisplay.textContent = `我无法获得频率值 ${wordInputted}.`;
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
        case "mandarin-tab":
          appDescriptionLine.textContent = "检查每百万个实例中英语单词的频率";
          submitButton.textContent = "获取频率";
          quoteButton.textContent = "获得报价";
          inputField.placeholder = "粘贴文本或生成随机引用？";
          pastSearchesLine.textContent = "过去的搜索";
          clearButton.textContent = "清除";
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
    requestURl = "https://poetrydb.org/linecount,random/3;1";
    fetch(requestURl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log("DATA:", data);
        poemArray = data[0].lines;
        poet = data[0].author;
        poemString = poemArray.join("\n");
        inputField.value = poemString + "\n" + poet;
      });
  }

  quoteButton.addEventListener("click", getPoem);
  updatePastSearches();

  //The submit button now calls both functions asyncronously, waiting for one to finish before running the other.
  // Calling both fuctions to debug.
  submitButton.addEventListener("click", async function () {
    //runs expandContractionWords and returns result expanded text.
    const expandedText = expandContractionWords(inputField.value);
    // runs setFrequecy with expandedText.
    await setFrequency(expandedText);
  });

  languageIcon.addEventListener("click", showLanguages);

  languageToggles.forEach((languageToggle) => {
    languageToggle.addEventListener("change", changeLanguage);
  });

  clearButton.addEventListener("click", removeSearches);
});
