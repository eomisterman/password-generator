import { UPPER, LOWER, NUMERIC, SPECIALSAFE, SPECIALUNSAFE } from "./constants";
/**
 * *****************************************************************************
 * OPTIONS: ["password", "passphrase"]
 * *****************************************************************************
 */
let secretType = "password";

/**
 * *****************************************************************************
 * PASSWORD VARIABLES
 * *****************************************************************************
 */

let charSet = {
  upper: UPPER,
  lower: LOWER,
  numeric: NUMERIC,
  specialSafe: SPECIALSAFE,
  specialUnsafe: SPECIALUNSAFE,
};

/**
 * *****************************************************************************
 * PASSPHRASE VARIABLES
 * *****************************************************************************
 */
let passphraseSettings = {
  numWords: 3,
  wordSeparator: "-",
  capitalize: true,
  includeNum: true,
};

/**
 * *****************************************************************************
 * HTML ELEMENTS
 * *****************************************************************************
 */
let passwordRadioEl = document.getElementById("password");
let passphraseRadioEl = document.getElementById("passphrase");
let passwordContainer = document.getElementById("password-options");
let passphraseContainer = document.getElementById("passphrase-options");
let passwordAreaEl = document.getElementById("password-area");
let passwordTextEl = document.getElementById("generated-password");
let passwordLengthEl = document.getElementById("pass-length");
let invalidPasswordEl = document.getElementById("invalid-password");
let upperEl = document.getElementById("upper");
let lowerEl = document.getElementById("lower");
let numericEl = document.getElementById("numeric");
let specialSafeEl = document.getElementById("special-safe");
let specialUnsafeEl = document.getElementById("special-unsafe");
let numWordsEl = document.getElementById("num-words");
let separatorEl = document.getElementById("separator");
let capitalizeEl = document.getElementById("capitalize");
let incNumberEl = document.getElementById("inc-number");
let invalidPassphraseEl = document.getElementById("invalid-passphrase");
let generateBtnEl = document.getElementById("generate-btn");
let inputEls = document.getElementsByTagName("input");

/**
 * *****************************************************************************
 * INIT FUNCTION - RUNS ON PAGE LOAD/RELOAD
 * *****************************************************************************
 */
function init() {
  for (let element of inputEls) {
    if (element.type === "checkbox") {
      element.checked = true;
    }
  }
  passwordLengthEl.value = "12";

  numWordsEl.value = passphraseSettings.numWords;
  separatorEl.value = passphraseSettings.wordSeparator;
  capitalizeEl.checked = passphraseSettings.capitalize;
  incNumberEl.checked = passphraseSettings.includeNum;

  passwordRadioEl.checked = false;
  passphraseRadioEl.checked = true;
  secretType = "passphrase";
}
init();

/**
 * *****************************************************************************
 * EVENT LISTENERS
 * *****************************************************************************
 */
passwordRadioEl.addEventListener("click", handlePasswordClick);
passphraseRadioEl.addEventListener("click", handlePassphraseClick);
generateBtnEl.addEventListener("click", () => { displayPassword() }, false);
upperEl.addEventListener("click", toggleUpper);
lowerEl.addEventListener("click", toggleLower);
numericEl.addEventListener("click", toggleNumeric);
specialSafeEl.addEventListener("click", toggleSpecialSafe);
specialUnsafeEl.addEventListener("click", toggleSpecialUnsafe);
passwordLengthEl.addEventListener("click", selectText);
passwordLengthEl.addEventListener("input", isValid);
passwordAreaEl.addEventListener("click", copyToClipboard);
separatorEl.addEventListener("click", selectSeparatorText);
separatorEl.addEventListener("input", handleChangeSeparator);
capitalizeEl.addEventListener("click", toggleCapitalize);
incNumberEl.addEventListener("click", toggleIncNumber);
numWordsEl.addEventListener("click", selectText);
numWordsEl.addEventListener("input", isValidNumWords);

/**
 * *****************************************************************************
 * METHODS
 * *****************************************************************************
 */
function handlePasswordClick() {
  passwordContainer.style.display = "initial";
  passphraseContainer.style.display = "none";
  secretType = "password";
}

function handlePassphraseClick() {
  passphraseContainer.style.display = "flex";
  passwordContainer.style.display = "none";
  secretType = "passphrase";
}

async function displayPassword() {
  if (secretType === "password") {
    passwordTextEl.textContent = generatePassword();
  } else {
    passwordTextEl.textContent = await generatePassphrase();
  }
}

function generatePassword() {
  let password = "";
  let passwordLength = parseInt(passwordLengthEl.value);
  let charsetSize = Object.keys(charSet).length;

  if (charsetSize < 1) {
    console.error("Error: No character types selected");
    return "";
  }
  if (isNaN(passwordLength) || passwordLength > 128 || passwordLength < 5) {
    console.error("Error: Invalid input - Password length");
    return "";
  }

  for (let i = 0; i < passwordLength; i++) {
    let randomSetIndex = Math.floor(Math.random() * charsetSize);
    let randomSetKey = Object.keys(charSet)[randomSetIndex];
    let randomSet = charSet[randomSetKey];
    let randomCharIndex = Math.floor(Math.random() * randomSet.length);
    password += randomSet[randomCharIndex];
  }

  return password;
}

async function generatePassphrase() {
  let passphrase = "";
  let numWords = passphraseSettings.numWords;
  let separator = passphraseSettings.wordSeparator;
  let numIndex;

  let words = await fetch(
    `https://random-word-api.vercel.app/api?words=${numWords}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.map(word => {
        if (passphraseSettings.capitalize) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        } else {
          return word;
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching words:", error);
    });
  
  if (passphraseSettings.includeNum) {
    numIndex = Math.floor(Math.random() * numWords);
  }

  for (let i = 0; i < words.length; i++) {
    passphrase += words[i]
    
    if (numIndex !== undefined && i === numIndex) {
      passphrase += Math.floor(Math.random() * 10).toString();
    }
    if (i < words.length -1) {
      passphrase += separator;
    }
  }

  return passphrase;
}

function toggleUpper() {
  upperEl.checked ? (charSet["upper"] = UPPER) : delete charSet["upper"];
  displayPassword();
}

function toggleLower() {
  lowerEl.checked ? (charSet["lower"] = LOWER) : delete charSet["lower"];
  displayPassword();
}

function toggleNumeric() {
  numericEl.checked
    ? (charSet["numeric"] = NUMERIC)
    : delete charSet["numeric"];
  displayPassword();
}

function toggleSpecialSafe() {
  specialSafeEl.checked
    ? (charSet["specialSafe"] = SPECIALSAFE)
    : delete charSet["specialSafe"];
  displayPassword();
}

function toggleSpecialUnsafe() {
  specialUnsafeEl.checked
    ? (charSet["specialUnsafe"] = SPECIALUNSAFE)
    : delete charSet["specialUnsafe"];
  displayPassword();
}

function selectText() {
  passwordLengthEl.select();
  passwordLengthEl.focus();
  numWordsEl.select();
  numWordsEl.focus();
}

function isValid() {
  let value = passwordLengthEl.value;
  if (isNaN(value) || value < 5 || value > 128) {
    console.error("Error: Invalid input - Password length");
    invalidPasswordEl.style.display = "initial";
    generateBtnEl.disabled = true;
  } else {
    invalidPasswordEl.style.display = "none";
    generateBtnEl.disabled = false;
  }
}

async function copyToClipboard() {
  let text = passwordTextEl.textContent;
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    console.error("Copy failed: ", e);
  }
}

function selectSeparatorText() {
  separatorEl.select();
  separatorEl.focus();
}

function handleChangeSeparator() {
  passphraseSettings.wordSeparator = separatorEl.value;
  displayPassword();
  separatorEl.select();
  separatorEl.focus();
}

function toggleCapitalize() {
  capitalizeEl.checked ? passphraseSettings.capitalize = true : passphraseSettings.capitalize = false;
  displayPassword();
}

function toggleIncNumber() {
  incNumberEl.checked ? passphraseSettings.includeNum = true : passphraseSettings.includeNum = false;
  displayPassword();
}

function isValidNumWords() {
  let value = numWordsEl.value;
  if (isNaN(value) || value < 3 || value > 15) {
    invalidPassphraseEl.style.display = "initial";
    generateBtnEl.disabled = true;
  } else {
    invalidPassphraseEl.style.display = "none";
    generateBtnEl.disabled = false;
    passphraseSettings.numWords = value;
    displayPassword();
  }
}