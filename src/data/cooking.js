const cooking = {
  objective: 'MAKE LUMPIA',

  flashbackLabel: 'PREVIOUS NIGHT',

  filling: {
    objective: 'MAKE THE FILLING',

    ingredients: [
      {
        id: 'meat',
        name: 'MEAT',
        x: 720, // kitchen table
        y: 240,
      },
      {
        id: 'cabbage',
        name: 'CABBAGE',
        x: 250, // counter by fridge
        y: 202,
      },
      {
        id: 'carrots',
        name: 'CARROTS',
        x: 565, // farther counter / sink
        y: 204,
      },
    ],
  },

  wrapping: {
  objective: 'WRAP THE LUMPIA',
  total: 3,

  // Marker movement speed.
  speed: 180,

  // Width of the "good" zone in the center.
  goodZoneWidth: 70,
},

frying: {
  objective: 'FRY THE LUMPIA',

  // How quickly the meter fills while Space is held.
  speed: 42,

  // Percentage ranges on the frying meter.
  goodMin: 55,
  goodMax: 78,
},

};

export default cooking;