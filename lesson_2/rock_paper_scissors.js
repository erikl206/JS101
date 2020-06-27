const readline = require('readline-sync');
const MESSAGES = require('./rock_paper_scissors_messages.json');

const ROUNDS_TO_WIN = 3;
const MAX_ROUNDS_IN_GAME = 5;

const VALID_GAME_CHOICE_INPUT = {
  rock     : ['rock'    , 'r' ],
  paper    : ['paper'   , 'p' ],
  scissors : ['scissors', 'sc'],
  spock    : ['spock'   , 'sp'],
  lizard   : ['lizard'  , 'l' ],
};

const VALID_CHOICES = Object.keys(VALID_GAME_CHOICE_INPUT);

const VALID_PLAY_AGAIN_CHOICES = {
  yes : ['yes', 'y'],
  no  : ['no' , 'n'],
};

const WINNING_COMBOS = {
  rock    : ['scissors', 'lizard'  ],
  paper   : ['rock'    , 'spock'   ],
  scissors: ['paper'   , 'lizard'  ],
  lizard  : ['paper'   , 'spock'   ],
  spock   : ['rock'    , 'scissors'],
};

const WINNING_MESSAGES = {
  'Scissors cuts Paper'         : ['scissors', 'paper'   ],
  'Paper covers Rock'           : ['paper'   , 'rock'    ],
  'Rock crushes Lizard'         : ['rock'    , 'lizard'  ],
  'Lizard poisons Spock'        : ['lizard'  , 'spock'   ],
  'Spock smashes Scissors'      : ['spock'   , 'scissors'],
  'Scissors decapitates Lizard' : ['scissors', 'lizard'  ],
  'Lizard eats Paper'           : ['lizard'  , 'paper'   ],
  'Paper disproves Spock'       : ['paper'   , 'spock'   ],
  'Spock vaporizes Rock'        : ['spock'   , 'rock'    ],
  'Rock crushes Scissors'       : ['rock'    , 'scissors'],
};

const GAME_SCORE = {
  user : 0,
  computer : 0,
};

function prompt(message) {
  console.log(`=> ${message}`);
}

function isValidGameChoices(input) {
  let validChoices = Object.values(VALID_GAME_CHOICE_INPUT).flat();
  if (validChoices.includes(input)) return input;
  return null;
}

function matchInputWithChoice(input) {
  for (let [key, value] of Object.entries(VALID_GAME_CHOICE_INPUT)) {
    if (value.includes(input)) return key;
  }
  return null;
}

function getUserChoice() {
  prompt(MESSAGES["gameChoices"]);
  let input = readline.question().trim().toLowerCase();

  while (!isValidGameChoices(input)) {
    prompt(MESSAGES["invalidGameChoice"]);
    prompt(MESSAGES["invalidGameChoiceOptions"]);
    input = readline.question().trim().toLowerCase();
  }
  return matchInputWithChoice(input);
}

function getComputerChoice() {
  let randomIndex = Math.floor(Math.random() * VALID_CHOICES.length);
  return VALID_CHOICES[randomIndex];
}

function updateScore(userChoice, computerChoice) {
  if (determineWinner(userChoice, computerChoice) === 'user') {
    GAME_SCORE.user += 1;
  } else if (determineWinner(userChoice, computerChoice) === 'computer') {
    GAME_SCORE.computer += 1;
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayPlayersMoves(userChoice, computerChoice) {
  prompt(`You chose ${capitalize(userChoice)}, the computer chose ${capitalize(computerChoice)}`);
}

function displayWinningLogic(userChoice, computerChoice) {
  for (let key in WINNING_MESSAGES) {
    if (userChoice === computerChoice) {
      return;
    } else if (WINNING_MESSAGES[key].includes(userChoice) &&
               WINNING_MESSAGES[key].includes(computerChoice)) {
      prompt(key);
    }
  }
}

function userWinsRound(userChoice, computerChoice) {
  return WINNING_COMBOS[userChoice].includes(computerChoice);
}

function displayRoundWinner(userChoice, computerChoice) {
  if (userWinsRound(userChoice, computerChoice)) {
    prompt(MESSAGES["userWinsRound"]);
  } else if (userChoice === computerChoice) {
    prompt(MESSAGES["tieRound"]);
  } else {
    prompt(MESSAGES["computerWinsRound"]);
  }
}

function determineWinner(userChoice, computerChoice) {
  if (userWinsRound(userChoice, computerChoice)) {
    return 'user';
  } else if (userChoice === computerChoice) {
    return 'tie';
  } else {
    return 'computer';
  }
}

function showEndOfRoundMessages(userChoice, computerChoice) {
  prompt(MESSAGES["dashes"]);
  displayPlayersMoves(userChoice, computerChoice);
  displayWinningLogic(userChoice, computerChoice);
  displayRoundWinner(userChoice, computerChoice);
  prompt(MESSAGES["dashes"]);
}

function continuePlaying(round, computerScore, userScore) {
  if (computerScore === ROUNDS_TO_WIN ||
      userScore     === ROUNDS_TO_WIN ||
      round         === MAX_ROUNDS_IN_GAME) {
    prompt(MESSAGES["continueToFinalScore"]);
  } else {
    prompt(MESSAGES["continueToNextRound"] + (round + 1));
  }

  let continueToNextRound = readline.question();
  return continueToNextRound;
}

function displayGameWinner(computerScore, userScore) {
  if (computerScore > userScore) {
    prompt(MESSAGES["dashes"]);
    prompt(`The computer scored: ${computerScore} while you scored: ${userScore}`);
    prompt(MESSAGES["gameLoss"]);
    prompt(MESSAGES["dashes"]);
  } else if (computerScore < userScore) {
    prompt(MESSAGES["dashes"]);
    prompt(`You scored: ${userScore} while the computer scored: ${computerScore}`);
    prompt(MESSAGES["gameWon"]);
    prompt(MESSAGES["dashes"]);
  } else {
    prompt(MESSAGES["dashes"]);
    prompt(MESSAGES["gameTie"]);
    prompt(MESSAGES["dashes"]);
  }
}

function displayScoreBoard(userScore, computerScore, round) {
  prompt(MESSAGES["dashes"]);
  prompt(`Round ${round}. User: ${userScore} - Computer: ${computerScore}`);
  prompt(MESSAGES["dashes"]);
}

function playGame() {
  for (let round = 1; round <= MAX_ROUNDS_IN_GAME; round += 1) {
    displayScoreBoard(GAME_SCORE.user, GAME_SCORE.computer, round);

    let userChoice = getUserChoice();
    let computerChoice = getComputerChoice();

    updateScore(userChoice, computerChoice);

    console.clear();

    showEndOfRoundMessages(userChoice, computerChoice);

    continuePlaying(round, GAME_SCORE.computer, GAME_SCORE.user);
    console.clear();

    if ((GAME_SCORE.computer === ROUNDS_TO_WIN) ||
        (GAME_SCORE.user === ROUNDS_TO_WIN)) break;
  }
  displayGameWinner(GAME_SCORE.computer, GAME_SCORE.user);
}

function isValidPlayAgain(input) {
  let answers = Object.values(VALID_PLAY_AGAIN_CHOICES);
  let flatAnswers = answers.flat();
  if (flatAnswers.includes(input)) return true;
  return null;
}

function endGameChoices(input) {
  for (let [key, value] of Object.entries(VALID_PLAY_AGAIN_CHOICES)) {
    if (value.includes(input)) return key;
  }
  return null;
}

function endGame() {
  prompt(MESSAGES["playAgain"]);
  let answer = readline.question().trim().toLowerCase();

  while (!isValidPlayAgain(answer)) {
    prompt(MESSAGES["invalidPlayAgain"]);
    answer = readline.question().trim().toLowerCase();
  }

  if (endGameChoices(answer) === 'no') {
    return answer;
  } else {
    return null;
  }
}

function showWelcomeMessages() {
  prompt(MESSAGES['welcome']);
  prompt(MESSAGES["rules"]);
  prompt(MESSAGES["dashes"]);
  prompt(MESSAGES["overView"]);
  prompt(MESSAGES["dashes"]);
  prompt(MESSAGES["continueToGame"]);
  let continueToGame = readline.question();
  return continueToGame;
}

function main() {
  showWelcomeMessages();

  do {
    console.clear();
    playGame();
    if (endGame()) break;
  }
  while (true);
}

main();