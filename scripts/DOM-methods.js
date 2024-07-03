// tile object
// { faceUp: false, icon: "fa-lemon", matched: false, pairId: "eKB_k7rKT8_eF0-sATxns", _id: "8zQijDHxw8_B104ETRmRp" }

// function to turn tile object into HTML button
const createTileHTML = ({ _id, icon, faceUp, matched } = {}) => {
  // create button (i.e. tile)
  const tileBtn = document.createElement(`button`);
  // add id
  tileBtn.setAttribute(`id`, _id);
  // add type
  tileBtn.setAttribute(`type`, `button`);
  // add classes
  tileBtn.classList.add(`tile`, `btn`, `btn-secondary`);
  // create icon
  const iconElement = document.createElement(`i`);
  // add icon classes
  iconElement.classList.add(`fa-sharp`, `fa-solid`, `fa-question`);
  // update tile and icon classes based on faceUp and matched flags
  if (faceUp) {
    tileBtn.classList.replace(`btn-secondary`, `btn-primary`);
    iconElement.classList.replace(`fa-question`, icon);
  }
  if (matched) {
    tileBtn.classList.replace(`btn-primary`, `btn-success`);
  }
  // put icon inside button 
  tileBtn.append(iconElement);
  // return button
  return tileBtn;
};

// function to loop over all tile objects, create HTML buttons for them (using above function), and render them into the page (i.e. refresh page with latest state of tile objects)
export const renderTiles = (tilesNode = document.body, data = []) => {
  // create docFrag
  const frag = document.createDocumentFragment();
  // create button html elements and add to frag
  for (const item of data) {
    frag.append(createTileHTML(item));
  }
  // inject frag into DOM (re-generate grid with latest state)
  tilesNode.replaceChildren(frag);
};


