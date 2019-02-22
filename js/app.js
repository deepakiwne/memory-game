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
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// 1. Start by building a grid of cards.

let cards = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt',
             'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];

function generateCard(card){
    return `<li class="card"><i class="fa ${card}"></i></li>`;
}

function addCardToDeck() {
  let deck = document.querySelector('.deck');
  let cardInDeck = shuffle(cards).map(function(card){
            return generateCard(card);

  });

  deck.innerHTML = cardInDeck.join('');

}

addCardToDeck();


// toggle cards
function flip(card){
    card.classList.toggle('open');
    card.classList.toggle('show');
}


let turnedOverCards = []

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// adding event listerner to deck for click functionality
async function respondToTheClick(evt) {
    console.log('A card was clicked: ', evt.target);

    //now changing css
    let card = evt.target;
    card.classList.add('open','show');

    await sleep(1000);

    // we should also check whether 2 cards matching
    turnedOverCards.push(card);

    console.log (turnedOverCards);

    // after 2 cards lets compare
    if (turnedOverCards.length === 2){

        // opened two cards. Lets check if match found and take appropriate action

        if(checkMatching()){
            turnedOverCards.forEach(function(c){
                c.classList.add('match');
            }); 
        } else {
            turnedOverCards.forEach(function(c){
                flip(c);
            }); 
        }

        // after comparing the cards, lets clear the cardsArray so that we can store and compare two more cardsß
        turnedOverCards = [];
    }

}

let deck = document.querySelector('.deck');
deck.addEventListener('click', respondToTheClick);

function checkMatching(){
    let first = turnedOverCards[0];
    let second = turnedOverCards[1];

    let firstArray = first.firstChild.classList;
    let secondArray = second.firstChild.classList;
    console.log(firstArray, secondArray);

    if(firstArray[0] == secondArray[0] && firstArray[1] == secondArray[1]){
        console.log('match found');
        return true;
    } else {
        console.log('no match');
        return false;
    }

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
