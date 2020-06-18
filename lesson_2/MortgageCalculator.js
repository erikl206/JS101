/* eslint-disable max-len */
/* eslint-disable max-statements */
const readline = require('readline-sync');
const MESSAGES = require('./mortgage_calculator_messages.json');

// change functions to let functionName = (arguments) {}??

function prompt(message) {
  console.log(`=> ${message}`);
}

function isInvalidLoanAmount(input) {
  input = +input;
  return input <= 0           ||
         Number.isNaN(+input);
}

function isInvalidDuration(input) {
  return input <= 0           ||
         Number.isNaN(+input) ||
         !Number.isInteger(+input);
}

function isInvalidInterest(input) {
  return input < 0            ||
         Number.isNaN(+input) ||
         input === '';
}

function isInvalidRepeat(input) { //had trouble with this function
  if (input === 'yes' ||
      input === 'no'  ||
      input === '') {
    return null;
  } else return true;
}

function cleanInput(input) {
  input = input.trim();
  input = input.replace('$', '');
  input = input.replace('%', '');
  input = input.replace(',', '');
  return input;
}

function cleanRepeatInput(input) {
  input = input.trim();
  input = input.toLowerCase();
  input = input.replace("'", '');
  return input;
}

function collectInput(message, validation, invalidMsg) {
  prompt(MESSAGES[message]);
  let input = readline.question();
  if (message !== "repeat") {
    input = cleanInput(input);
  } else {
    input = cleanRepeatInput(input);
  }

  while (validation(input)) {
    prompt(MESSAGES[invalidMsg]);
    input = readline.question();
    if (message !== "repeat") {
      input = cleanInput(input);
    } else {
      input = cleanRepeatInput(input);
    }
  }
  return input;
}

function displayResults(monthlyPayment, months, totalInterest, totalPayments) {
  prompt('-------------------------------------------------');
  prompt(`Payment Every Month: $${numCommas(monthlyPayment.toFixed(2))}`);
  prompt(`Total of ${months} Payments: $${numCommas(totalPayments.toFixed(2))}`);
  prompt(`Total Interest: $${numCommas(totalInterest.toFixed(2))}`);
  prompt('-------------------------------------------------');
}

function numCommas(num) {
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // I borrowed this regex from StackOverFlow user Elias Zamaria
  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
}

function mortageCalculator () {
  let loanAmount = collectInput("loan", isInvalidLoanAmount, "invalidLoanMsg");
  let durationInYears = collectInput("duration", isInvalidDuration, "invalidDurationMsg");
  let months = durationInYears * 12;
  let yearlyInterestRate = collectInput("interest", isInvalidInterest, "invalidInterestMsg");
  let monthlyPayment;
  let monthlyInterestRate = (yearlyInterestRate / 100) / 12;

  if (monthlyInterestRate !== 0) {
    monthlyPayment = loanAmount *
                     (monthlyInterestRate /
                     (1 - Math.pow((1 + monthlyInterestRate),(-months))));
  } else {
    monthlyPayment = (loanAmount / months);
  }

  let totalPayments = monthlyPayment * months;
  let totalInterest = (months * monthlyPayment) - loanAmount;

  displayResults(monthlyPayment, months, totalInterest, totalPayments);
}

function main() {
  console.clear();
  prompt(MESSAGES['welcome']);

  while (true) {
    mortageCalculator();

    let repeatInput = collectInput("repeat", isInvalidRepeat, "invalidRepeatMsg");
    if (repeatInput === 'no') {
      break;
    } else if (repeatInput === 'yes') {
      console.clear();
    } else {
      prompt(MESSAGES["error"]);
    }
  }
}

main();