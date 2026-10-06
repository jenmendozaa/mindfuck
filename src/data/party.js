const party = {
  worldWidth: 1800,

  objective: 'FIND JEN',

  partygoers: [
    { id: 'partygoer-1', x: 220 },
    { id: 'partygoer-2', x: 360 },
    { id: 'partygoer-3', x: 510 },
    { id: 'partygoer-4', x: 690 },
    { id: 'partygoer-5', x: 850 },
    { id: 'partygoer-6', x: 1030 },
    { id: 'partygoer-7', x: 1190 },
    { id: 'partygoer-8', x: 1370 },
    { id: 'partygoer-9', x: 1510 },
  ],

  jen: {
    x: 1660,
  },

  reveal: {
  alreadyKnow: 'But you already know this part. You were there…',
  mostly: 'Mostly',
  badMemory: "Your memory is hella bad so, I'm not sure what stuck",
  mySide: "HERE'S IT FROM MY SIDE.",
},

jenPerspective: {
  firstThought: 'hot',
},

};

export default party;