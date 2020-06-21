const readline = require('readline-sync');
const VALID_CHOICES = ['rock', 'paper', 'scissors', 'spock', 'lizard'];

const WINNING_COMBOS = {
  rock    : ['scissors', 'lizard'  ],
  paper   : ['rock'    , 'spock'   ],
  scissors: ['paper'   , 'lizard'  ],
  lizard  : ['paper'   , 'spock'   ],
  spock   : ['rock'    , 'scissors'],
};

function prompt(message) {
  console.log(`=> ${message}`);
}
function userWins(choice, computerChoice) {
  return WINNING_COMBOS[choice].includes(computerChoice);
}

function displayWinner(choice, computerChoice) {
  if (userWins) {
    prompt('Congrats you win!');
  } else if (choice === computerChoice) {
    prompt("It's a tie!");
  } else {
    prompt("Sorry, computer wins!");
  }
}

function cleanUserInput(userInput) {
  if ((userInput[0] !== 's') && (VALID_CHOICES.includes(userInput)) {
    return userInput;
  } else {
    prompt("You entered 's' which could be scissors or spock");
    prompt("Please specify which move you meant");
    
  }

}

function getUserInput() {
  prompt(`Choose one: ${VALID_CHOICES.join(', ')}`);
  let input = readline.question().toLowerCase();
  while (!VALID_CHOICES.includes(input)) {
    prompt("That's not a valid choice");
    input = readline.question().toLowerCase();
  }

  let choice = cleanUserInput(input);
  return choice;
}

function getComputerChoice() {
  let randomIndex = Math.floor(Math.random() * VALID_CHOICES.length);
  let computerChoice = VALID_CHOICES[randomIndex];
  return computerChoice;
}

function displayChoices(choice, computerChoice) {
  prompt(`You chose ${choice}, computer chose ${computerChoice}`);
}

function playAgainInput() {
  prompt('Do you want to play again (y/n)?');
  let answer = readline.question().toLowerCase();
  return answer;
}

while (true) {
  let choice = getUserInput();
  let computerChoice = getComputerChoice();

  displayChoices(choice, computerChoice);
  displayWinner(choice, computerChoice);

  let answer = playAgainInput();

  while (answer[0] !== 'n' && answer[0] !== 'y') {
    prompt('Please enter "y" or "n".');
    answer = readline.question().toLowerCase();
  }

  if (answer[0] !== 'y') break;
}

