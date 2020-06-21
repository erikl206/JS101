const readline = require('readline-sync');
const VALID_CHOICES = ['rock', 'paper', 'scissors', 'spock', 'lizard'];
const VALID_PLAY_AGAIN_CHOICES = {
  yes : ['yes', 'y'],
  no : ['no', 'n'],
};

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
  if (userWins(choice, computerChoice)) {
    prompt('Congrats you win!');
  } else if (choice === computerChoice) {
    prompt("It's a tie!");
  } else {
    prompt("Sorry, computer wins!");
  }
}

function getUserInput() {
  prompt(`Choose one: ${VALID_CHOICES.join(', ')}`);
  let input = readline.question().toLowerCase();

  while (!VALID_CHOICES.includes(input)) {
    prompt("That's not a valid entry. Please choose from the following -");
    prompt("(r)ock, (p)aper, (sc)issors, (sp)ock, or (l)izard");
    input = readline.question().toLowerCase();
  }
  return input;
}

function getComputerChoice() {
  let randomIndex = Math.floor(Math.random() * VALID_CHOICES.length);
  let computerChoice = VALID_CHOICES[randomIndex];

  return computerChoice;
}

function displayChoices(choice, computerChoice) {
  prompt(`You chose ${choice}, computer chose ${computerChoice}`);
}


function playGame() {
  let choice = getUserInput();
  let computerChoice = getComputerChoice();

  displayChoices(choice, computerChoice);
  displayWinner(choice, computerChoice);
}

function validPlayAgain(input) {
  let answers = Object.values(VALID_PLAY_AGAIN_CHOICES);
  let flatAnswers = answers.flat();
  if (flatAnswers.includes(input)) return true;
}

function playAgain() {
  prompt('Do you want to play again (y/n)?');
  let answer = readline.question().toLowerCase();

  while (!validPlayAgain(answer)) {
    prompt("That's not a valid choice");
    prompt("Please enter (y)es or (n)o");
    answer = readline.question().toLowerCase();
  }

  if ((answer === 'no') || (answer === 'n')) {
    return answer;
  } else {
    return null;
  }
}

do {
  playGame();
  if (playAgain()) break;

} while (true);

