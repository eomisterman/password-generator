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
let generateBtn = document.getElementById("generate-btn");
let inputEls = document.getElementsByTagName("input");
let tooltipEl = document.getElementById("tooltip");

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
generateBtn.addEventListener("click", () => { displaySecret() }, false);
upperEl.addEventListener("click", toggleUpper);
lowerEl.addEventListener("click", toggleLower);
numericEl.addEventListener("click", toggleNumeric);
specialSafeEl.addEventListener("click", toggleSpecialSafe);
specialUnsafeEl.addEventListener("click", toggleSpecialUnsafe);
passwordLengthEl.addEventListener("click", selectPasswordLengthText);
passwordLengthEl.addEventListener("input", handleUpdatePasswordLength);
passwordAreaEl.addEventListener("click", showTooltip);
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
function resetPassphraseUI() {
  passphraseSettings = {
    numWords: 3,
    wordSeparator: "-",
    capitalize: true,
    includeNum: true,
  };
  numWordsEl.value = passphraseSettings.numWords;
  separatorEl.value = passphraseSettings.wordSeparator;
  capitalizeEl.checked = passphraseSettings.capitalize;
  incNumberEl.checked = passphraseSettings.includeNum;

  hideInvalidInputError();
}

function resetPasswordUI() {
  passwordLength = 12;
  passwordLengthEl.value = passwordLength;

  charSet = {
    upper: UPPER,
    lower: LOWER,
    numeric: NUMERIC,
    specialSafe: SPECIALSAFE,
    specialUnsafe: SPECIALUNSAFE,
  };
  for (let element of inputEls) {
    if (element.type === "checkbox") {
      element.checked = true;
    }
  }

  hideInvalidInputError();
}

function handlePasswordClick() {
  passphraseContainer.style.display = "none";
  resetPassphraseUI();
  passwordContainer.style.display = "initial";
  secretType = "password";
}

function handlePassphraseClick() {
  passwordContainer.style.display = "none";
  resetPasswordUI();
  passphraseContainer.style.display = "initial";
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
  if (!isInvalidPasswordLength(passwordLengthEl.value)) {
    displaySecret();
  }
}

function toggleLower() {
  lowerEl.checked ? (charSet["lower"] = LOWER) : delete charSet["lower"];
  lowerEl.focus();
  if (!isInvalidPasswordLength(passwordLengthEl.value)) {
    displaySecret();
  }
}

function toggleNumeric() {
  numericEl.checked
    ? (charSet["numeric"] = NUMERIC)
    : delete charSet["numeric"];
  numericEl.focus();
  if (!isInvalidPasswordLength(passwordLengthEl.value)) {
    displaySecret();
  }
}

function toggleSpecialSafe() {
  specialSafeEl.checked
    ? (charSet["specialSafe"] = SPECIALSAFE)
    : delete charSet["specialSafe"];
  specialSafeEl.focus();
  if (!isInvalidPasswordLength(passwordLengthEl.value)) {
    displaySecret();
  }
}

function toggleSpecialUnsafe() {
  specialUnsafeEl.checked
    ? (charSet["specialUnsafe"] = SPECIALUNSAFE)
    : delete charSet["specialUnsafe"];
  specialUnsafeEl.focus();
  if (!isInvalidPasswordLength(passwordLengthEl.value)) {
    displaySecret();
  }
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
  if (isInvalidPasswordLength(value)) {
    showInvalidInputError();
    console.error("Error: Invalid input - should be an integer between 5 - 128");
  } else {
    hideInvalidInputError();
    passwordLength = value;
  }
}

function showTooltip() {
  tooltipEl.style.display = "initial";
  tooltipEl.style.animation = 'fadeInOut 2s ease-out';

  // Remove tooltip after 1 second
  setTimeout(function() {
    tooltipEl.style.display = "none";
  }, 2000);
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
  if (!isInvalidNumWordsInput(numWordsEl.value)) {
    displaySecret();
  }
  separatorEl.select();
  separatorEl.focus();
}

function toggleCapitalize() {
  capitalizeEl.checked ? passphraseSettings.capitalize = true : passphraseSettings.capitalize = false;
  capitalizeEl.select();
  capitalizeEl.focus();
  if (!isInvalidNumWordsInput(numWordsEl.value)) {
    displaySecret();
  }
}

function toggleIncNumber() {
  incNumberEl.checked ? passphraseSettings.includeNum = true : passphraseSettings.includeNum = false;
  incNumberEl.focus();
  if (!isInvalidNumWordsInput(numWordsEl.value)) {
    displaySecret();
  }
}

function showInvalidInputError() {
  if (secretType === "passphrase") {
    invalidPassphraseEl.style.display = "initial";
  } else {
    invalidPasswordEl.style.display = "initial";
  }
  generateBtn.disabled = true;
}

function hideInvalidInputError() {
  if (secretType === "passphrase") {
    invalidPassphraseEl.style.display = "none";
  } else {
    invalidPasswordEl.style.display = "none";
  }
  generateBtn.disabled = false;
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