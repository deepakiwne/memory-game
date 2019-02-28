/*
 * Create a list that holds all of your cards
 */
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Start by building a grid of cards
let cards = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor', 'fa-bolt', 
             'fa-bolt', 'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];
let cardId = 0;

// generate cards
function generateCard(card) {
    cardId += 1;
    return `<li class="card" id="${cardId}"><i class="fa ${card}"></i></li>`;
}

// Add all cards to deck
function addCardToDeck() {
    let deck = document.querySelector('.deck');
    let cardInDeck = shuffle(cards).map(function(card) {
        return generateCard(card);
    });
    deck.innerHTML = cardInDeck.join('');
}

// initialize game
initGame();

let turnedOverCards = []

// timer
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// adding event listerner to deck for click functionality
async function respondToTheClick(evt) {
    
    // start timer after first click
    if (!gameStatus.firstClickDone) {
        gameStatus.firstClickDone = true;
        startTimer();
    }

    let card = evt.target;

    // click validations
    // handle deck click
    if (card.classList.contains("deck")) {
        return;
    }
    //handle icon click
    if (card.classList.contains("fa")) {
        card = card.parentElement;
    }
    // handle click on matched cards
    if (card.classList.contains("match")) {
        return;
    }
    // handle click on same card twice
    if (turnedOverCards.length === 1) {
        if (turnedOverCards[0].id === card.id) {
            return;
        }
    }

    // flip
    card.classList.add('open', 'show');
    card.classList.toggle('flip');
    await sleep(300);
    card.classList.toggle('flip');
    
    // store
    turnedOverCards.push(card);
    
    // check and take action
    if (turnedOverCards.length === 2) {
        if (checkMatching()) {
            turnedOverCards.forEach(async function(c) {
                gameStatus.matchedCardsCount += 1;
                c.classList.add('match');
                c.classList.toggle('jello');
                await sleep(800);
                c.classList.toggle('jello');
            });
        } else {
            turnedOverCards.forEach(async function(c) {
                //flip(c);
                c.classList.toggle('wobble');
                c.classList.toggle('nomatch');
                await sleep(900);
                c.classList.toggle('nomatch');
                c.classList.toggle('wobble');
                c.classList.toggle('open');
                c.classList.toggle('show');
            });
        }
        // after comparing the cards, lets clear the cardsArray so that we can store and compare two more cards
        turnedOverCards = [];

        updateScore();
    }

    checkGameCompletion();
}

function updateScore(){
    gameStatus.moveCounter += 1;
    // update game score
    let move = document.querySelector('.moves');
    move.innerHTML = gameStatus.moveCounter;
    // update star rating
    if (gameStatus.moveCounter > 10 && gameStatus.moveCounter <= 20) {
        var stars = document.querySelectorAll('.fa-star');
        stars[2].classList.add('star-disabled');
        gameStatus.starRating = 2;
    } else if (gameStatus.moveCounter > 20 && gameStatus.moveCounter <= 30) {
        var stars = document.querySelectorAll('.fa-star');
        stars[1].classList.add('star-disabled');
        gameStatus.starRating = 1;
    } else if (gameStatus.moveCounter > 30) {
        var stars = document.querySelectorAll('.fa-star');
        stars[0].classList.add('star-disabled');
        gameStatus.starRating = 0;
    }
}

let interval = undefined;

// start timer
function startTimer() {
    clearInterval(interval);
    interval = setInterval(function() {
        gameStatus.timer += 1;
        let time = document.querySelector('.timer');
        time.innerHTML = formatTime(gameStatus.timer);
    }, 1000);
}

// convert to minutes and seconds
function formatTime(time) {
    let seconds = time % 60;
    let minutes = Math.floor(time / 60);
    return minutes + ':' + String("00" + seconds).slice(-2);
}

let deck = document.querySelector('.deck');
deck.addEventListener('click', respondToTheClick);

// matching 2 cards
function checkMatching() {
    let icon1Classes = turnedOverCards[0].firstChild.classList;
    let icon2Classes = turnedOverCards[1].firstChild.classList;
    if (icon1Classes[0] == icon2Classes[0] && icon1Classes[1] == icon2Classes[1]) {
        return true;
    } else {
        return false;
    }
}

// create object game status
let gameStatus = {
    'matchedCardsCount': 0,
    'moveCounter': 0,
    'timer': 0,
    'starRating': 3,
    'firstClickDone': false
};

// message after game completion
function checkGameCompletion() {
    if (gameStatus.matchedCardsCount === 16) {
        let finalMoves = document.querySelector('.final-moves');
        let finalStars = document.querySelector('.final-stars');
        let finalTime = document.querySelector('.final-time');
        finalMoves.innerHTML = gameStatus.moveCounter;
        finalStars.innerHTML = gameStatus.starRating;
        let t = formatTime(gameStatus.timer);
        finalTime.innerHTML = t;
        // Save score to local storage
        writeToScoreBoard({
            move: gameStatus.moveCounter,
            time: t,
            star: gameStatus.starRating
        });
        $('#myModal').modal();
    }
}

let scoreBoardSize = 5;

// add scores in scoreboard
function writeToScoreBoard(score) {
    let scoreBoard = JSON.parse(window.localStorage.getItem("scoreBoard"));
    if (scoreBoard.length == scoreBoardSize) {
        scoreBoard.pop();
    }
    scoreBoard.unshift(score);
    window.localStorage.setItem("scoreBoard", JSON.stringify(scoreBoard));
}

// reset  functionality
let restart = document.querySelector('.restart');
restart.addEventListener('click', restartGame);

// restart game
function restartGame() {
    // face down all cards
    let cards = document.querySelectorAll('.card');
    cards.forEach(function(c) {
        c.classList.remove('open');
        c.classList.remove('show');
        c.classList.remove('match');
    });
    // reset game status object
    gameStatus = {
        'matchedCardsCount': 0,
        'moveCounter': 0,
        'timer': 0,
        'starRating': 3,
        'firstClickDone': false
    }
    resetStars();
    resetMoves();
    resetTimer();
    readFromScoreBoard();
}

// reset timer
function resetTimer() {
    clearInterval(interval);
    let time = document.querySelector('.timer');
    time.innerHTML = formatTime(gameStatus.timer);
}

// reset star ratings
function resetStars() {
    var stars = document.querySelectorAll('.fa-star');
    stars.forEach(function(s) {
        s.classList.remove('star-disabled');
    });
}

// reset moves
function resetMoves() {
    var moves = document.querySelector('.moves');
    moves.innerHTML = gameStatus.moveCounter;
}

// init game after reset
function initGame() {
    addCardToDeck();
    readFromScoreBoard();
}

// score board
function readFromScoreBoard() {
    let scoreBoardData = window.localStorage.getItem("scoreBoard");
    if (scoreBoardData == null || scoreBoardData == undefined) {
        window.localStorage.setItem("scoreBoard", JSON.stringify([]));
    }
    let scores = JSON.parse(scoreBoardData);
    let index = 0;
    let scoreRows = sortScore(scores).map(function(score) {
        index += 1;
        return generateScoreRow(score, index);
    });
    let scoreElement = document.querySelector('.score');
    scoreElement.innerHTML = scoreRows.join('');
}

// sort scores on scoreboard
function sortScore(scores) {
    return scores.sort(function(a, b) {
        return a.move - b.move
    });
}

// generate score row on scoreboard
function generateScoreRow(score, index) {
    return `<tr><th scope="row">${index}</th><td>${score.move}</td><td>${score.time}</td><td>${score.star}</td></tr>`;
}

// play again button on modal
function playAgain() {
    $('#myModal').modal('hide');
    restartGame();
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */