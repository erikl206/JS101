const readline = require('readline-sync');
const MESSAGES = require('./mortgage_calculator_messages.json');

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

function isInvalidRepeat(input) {
  const VALID_REPEAT_ANSWERS = ['yes', 'no', 'y', 'n'];
  input = input.toLowerCase();
  return !VALID_REPEAT_ANSWERS.includes(input);
}

function cleanInput(input) {
  input = input.trim();
  input = input.replace('$', '');
  input = input.replace('%', '');
  input = input.replace(',', '');
  input = input.replace("'", '');
  return input;
}

function collectInput(message, validation, invalidMsg) {
  prompt(MESSAGES[message]);
  let input = readline.question();
  input = cleanInput(input);

  while (validation(input)) {
    prompt(MESSAGES[invalidMsg]);
    input = readline.question();
    input = cleanInput(input);
    }
  return input;
}

function displayResults(monthlyPayment, months, totalInterest, totalPayments) {
  prompt('-------------------------------------------------');
  prompt(`Payment Every Month: $${addCommas(monthlyPayment.toFixed(2))}`);
  prompt(`Total of ${months} Payments: $${addCommas(totalPayments.toFixed(2))}`);
  prompt(`Total Interest: $${addCommas(totalInterest.toFixed(2))}`);
  prompt('-------------------------------------------------');
}

function addCommas(num) {
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // I borrowed this regex from StackOverFlow user Elias Zamaria
  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
}

function calculateMortgage(yearlyInterestRate, loanAmount, months) {
  let monthlyPayment;
  let monthlyInterestRate = (yearlyInterestRate / 100) / 12;

  if (monthlyInterestRate !== 0) {
    monthlyPayment = loanAmount *
                     (monthlyInterestRate /
                     (1 - Math.pow((1 + monthlyInterestRate),(-months))));
  } else {
    monthlyPayment = (loanAmount / months);
  }
  return monthlyPayment;
}

function calculateTotalPayments(monthlyPayment, months) {
  return monthlyPayment * months;
}

function calculateTotalInterest(months, monthlyPayment, loanAmount) {
  return (months * monthlyPayment) - loanAmount;
}

function mortageCalculator () {
  let loanAmount = collectInput("loan", isInvalidLoanAmount, "invalidLoanMsg");
  let durationInYears = collectInput("duration", isInvalidDuration, "invalidDurationMsg");
  let months = durationInYears * 12;
  let yearlyInterestRate = collectInput("interest", isInvalidInterest, "invalidInterestMsg");

  let monthlyPayment = calculateMortgage(yearlyInterestRate, loanAmount, months);

  let totalPayments = calculateTotalPayments(monthlyPayment, months);
  let totalInterest = calculateTotalInterest(months, monthlyPayment, loanAmount);

  displayResults(monthlyPayment, months, totalInterest, totalPayments);
}

function main() {
  console.clear();
  prompt(MESSAGES['welcome']);

  while (true) {
    mortageCalculator();
    let repeatInput = collectInput("repeat", isInvalidRepeat, "invalidRepeatMsg");
    if (repeatInput) {
      console.clear();
    } else {
      break;
    }
  }
}
main();