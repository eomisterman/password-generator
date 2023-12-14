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

let passwordLength = 12;

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
  passwordLengthEl.value = passwordLength;

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
generateBtnEl.addEventListener("click", () => { displaySecret() }, false);
upperEl.addEventListener("click", toggleUpper);
lowerEl.addEventListener("click", toggleLower);
numericEl.addEventListener("click", toggleNumeric);
specialSafeEl.addEventListener("click", toggleSpecialSafe);
specialUnsafeEl.addEventListener("click", toggleSpecialUnsafe);
passwordLengthEl.addEventListener("click", selectPasswordLengthText);
passwordLengthEl.addEventListener("input", handleUpdatePasswordLength);
passwordAreaEl.addEventListener("click", copyToClipboard);
separatorEl.addEventListener("click", selectSeparatorText);
separatorEl.addEventListener("input", handleChangeSeparator);
capitalizeEl.addEventListener("click", toggleCapitalize);
incNumberEl.addEventListener("click", toggleIncNumber);
numWordsEl.addEventListener("click", selectNumWordsText);
numWordsEl.addEventListener("input", handleUpdateNumWords);

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

async function displaySecret() {
  if (secretType === "password") {
    passwordTextEl.textContent = generatePassword();
  } else {
    passwordTextEl.textContent = await generatePassphrase();
  }
}

function generatePassword() {
  let password = "";
  let charsetSize = Object.keys(charSet).length;

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
  upperEl.focus();
  displaySecret();
}

function toggleLower() {
  lowerEl.checked ? (charSet["lower"] = LOWER) : delete charSet["lower"];
  lowerEl.focus();
  displaySecret();
}

function toggleNumeric() {
  numericEl.checked
    ? (charSet["numeric"] = NUMERIC)
    : delete charSet["numeric"];
  numericEl.focus();
  displaySecret();
}

function toggleSpecialSafe() {
  specialSafeEl.checked
    ? (charSet["specialSafe"] = SPECIALSAFE)
    : delete charSet["specialSafe"];
  specialSafeEl.focus();
  displaySecret();
}

function toggleSpecialUnsafe() {
  specialUnsafeEl.checked
    ? (charSet["specialUnsafe"] = SPECIALUNSAFE)
    : delete charSet["specialUnsafe"];
  specialUnsafeEl.focus();
  displaySecret();
}

function selectPasswordLengthText() {
  passwordLengthEl.select();
  passwordLengthEl.focus();
}

function selectNumWordsText() {
  numWordsEl.select();
  numWordsEl.focus();
}

function isInvalidPasswordLength(value) {
  return isNaN(value) || value < 5 || value > 128;
}

function handleUpdatePasswordLength() {
  let value = passwordLengthEl.value;
  if (isInvalidPasswordLength()) {
    showInvalidInputError();
    console.error("Error: Invalid input - should be an integer between 5 - 128");
  } else {
    hideInvalidInputError();
    passwordLength = value;
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
  displaySecret();
  separatorEl.select();
  separatorEl.focus();
}

function toggleCapitalize() {
  capitalizeEl.checked ? passphraseSettings.capitalize = true : passphraseSettings.capitalize = false;
  capitalizeEl.select();
  capitalizeEl.focus();
  displaySecret();
}

function toggleIncNumber() {
  incNumberEl.checked ? passphraseSettings.includeNum = true : passphraseSettings.includeNum = false;
  incNumberEl.focus();
  displaySecret();
}

function showInvalidInputError() {
  invalidPassphraseEl.style.display = "initial";
  generateBtnEl.disabled = true;
}

function hideInvalidInputError() {
  invalidPassphraseEl.style.display = "none";
  generateBtnEl.disabled = false;
}

function isInvalidNumWordsInput(value) {
  return isNaN(value) || value < 3 || value > 15;
}

function handleUpdateNumWords() {
  let value = numWordsEl.value;
  if (isInvalidNumWordsInput(value)) {
    showInvalidInputError();
    console.error("Error: Invalid input - should be a number ranging from 3 - 15")
  } else {
    hideInvalidInputError();
    passphraseSettings.numWords = value;
    displaySecret();
  }
}