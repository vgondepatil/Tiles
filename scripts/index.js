import { TileApp } from './TileManager.js';
import { renderTiles } from './DOM-methods.js';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

//INITIAL STATE
// timer seconds counter
let timer = 0;
// guesses counter
let guesses = 0;
// Pull data in from tile arrangement object
const icons = [
  `fa-truck-fast`,
  `fa-camera-retro`,
  `fa-mug-hot`,
  `fa-lemon`,
  `fa-flask`,
  `fa-tree`,
  `fa-rocket`,
  `fa-robot`,
];
const tileApp = new TileApp(icons);
// variable to store interval id for time display
let nIntervId = null;
// console.log(nIntervId);

// ELEMENT SELECTION
// time display
const timeDisplay = document.getElementsByClassName(`time`)[0];
// guesses display
const guessesDisplay = document.getElementsByClassName(`guesses`)[0];
// restart button
const restartBtn = document.getElementsByClassName(`restart-btn`)[0];
// grid
const grid = document.getElementsByClassName(`tile-grid`)[0];
// modal time value
const modalTimeValue = document.getElementsByClassName(`modal-time-value`)[0];
// modal guesses value
const modalGuessesValue =
  document.getElementsByClassName(`modal-guesses-value`)[0];
// play again button
const playAgainBtn = document.getElementsByClassName(`play-again-btn`)[0];

// INITIAL ACTIONS
// render timer display
timeDisplay.textContent = timer;
// render guesses display
guessesDisplay.textContent = guesses;
// render tiles in grid
renderTiles(grid, tileApp.tiles);

// HELPER FUNCTIONS
// time delay function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// enable popovers
const popoverTriggerList = document.querySelectorAll(
  '[data-bs-toggle="popover"]',
);
const popoverList = [...popoverTriggerList].map(
  (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl),
);
// enable tooltips
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]',
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
);

// EVENT BINDINGS
// click on restart
restartBtn.addEventListener(`click`, (e) => {
  // console.log(`restart button clicked`);
  tileApp.resetTiles();
  // render tiles
  renderTiles(grid, tileApp.tiles);
  // kill and reset timer
  clearInterval(nIntervId);
  nIntervId = null;
  timer = 0;
  timeDisplay.textContent = 0;
  // reset guesses
  guesses = 0;
  guessesDisplay.textContent = guesses;
});

// click on tiles
grid.addEventListener(`click`, (e) => {
  // get tile element clicked on
  const { target } = e;
  // get tile element id
  const targetId = target.getAttribute(`id`);
  // use id to get relevant tile data object
  const tile = tileApp.findTileById(targetId);
  // flip tile up, if face down
  if (!tile.faceUp) {
    tileApp.flipTileUp(tile);
    guesses += 1;
    guessesDisplay.textContent = guesses;
  }

  // render tiles
  renderTiles(grid, tileApp.tiles);

  // get face up and unmatched tiles
  const faceUpTiles = tileApp.findFaceUpTiles(tileApp.tiles);
  const faceUpUnmatchedTiles = tileApp.findUnmatchedTiles(faceUpTiles);

  // if >1 tile face up...
  if (faceUpUnmatchedTiles.length > 1) {
    // if they match, mark them as matched
    if (tileApp.isMatch(faceUpUnmatchedTiles)) {
      tileApp.matchTiles(faceUpUnmatchedTiles);
    } else {
      // flip them back down
      tileApp.flipTilesDown(faceUpUnmatchedTiles);
    }
    // render tiles with time delay effect
    (async () => {
      await sleep(800);
      renderTiles(grid, tileApp.tiles);
    })();
  }

  // start timer
  if (nIntervId === null) {
    nIntervId = setInterval(() => {
      timer += 1;
      timeDisplay.textContent = timer;
    }, 1000);
  }

  // if all tiles matched, show congrats message, with replay button
  const unmatchedTiles = tileApp.findUnmatchedTiles(tileApp.tiles);
  // console.log(unmatchedTiles.length);
  if (unmatchedTiles.length === 0) {
    clearInterval(nIntervId);
    modalTimeValue.textContent = timer;
    modalGuessesValue.textContent = guesses;
    confetti();
    confetti();
    (async () => {
      await sleep(1000);
      $('#congrats-modal').modal('show');
    })();
  }
});

// click on play again button
playAgainBtn.addEventListener(`click`, () => {
  const event = new MouseEvent('click');
  restartBtn.dispatchEvent(event);
  $('#congrats-modal').modal('hide');
});
