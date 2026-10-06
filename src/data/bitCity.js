const bitCity = {
  chapter: {
    number: 4,
    title: 'BIT CITY',
  },

  objective: {
    text: 'FIND NEW MATERIAL',
    total: 4,
  },

  materials: [
    {
  id: 'cards',
  name: 'CARDS',
  side: 'left',
  offset: 700,
  interaction: 'magic',

  presentation: {
    dialogue: [
      {
        speaker: 'JEN',
        text: 'Baby guess what I got??',
      },
      {
        speaker: 'NAT',
        text: 'Please not another trick',
      },
      {
        speaker: 'JEN',
        text: "If you don't let me do it, no Stacy",
      },
      {
        speaker: 'NAT',
        text: '....',
      },
      {
        speaker: 'NAT',
        text: 'Fine',
      },
    ],

    automaticThought:
      'she loved it',

    qThought:
      'God I love when she looks at me like that',
  },
},
    {
  id: 'puppet',
  name: 'PUPPET',
  side: 'left',
  offset: 1400,

  presentation: {
    dialogue: [
      {
        speaker: 'NAT',
        text: "You know the rest of my hoes are way more interested in me fucking them than whatever bullshit you're about to do",
      },
      {
        speaker: 'JEN',
        text: 'Yeah, but this is fun',
      },
      {
        speaker: 'NAT',
        text: "... You get one song and then you're fucked",
      },
      {
        speaker: 'JEN',
        text: "We'll see, I might get inspired",
      },
    ],

    automaticThought: 'HEHEHEHEH',

    qThought:
      'You know if you stopped reacting like this I would probably stop doing it lol',
  },
},
    {
  id: 'nose',
  name: 'NOSE',
  side: 'right',
  offset: 700,

  presentation: {
    dialogue: [
      {
        speaker: 'JEN',
        text: '*takes nose*',
      },
      {
        speaker: 'NAT',
        text: 'Bruh I need that!!',
      },
      {
        speaker: 'NAT',
        text: 'I know it barely works but it works sorta!!',
      },
      {
        speaker: 'JEN',
        text: '*takes out invisible gold club*',
      },
      {
        speaker: 'NAT',
        text: "You're so dead, don't you dare",
      },
    ],

    automaticThought:
      "I gotta think of new mime material can't become predictable",

    qThought:
      'This will never get old',
  },
},
    {
  id: 'pp-relic',
  name: 'PP',
  side: 'right',
  offset: 2500,

  presentation: {
    dialogue: [
      {
        speaker: 'NAT',
        text: "Why isn't it my beautiful, massive, gargantuan, throbbing PP :)"
      },
      {
        speaker: 'JEN',
        text: "You're ridiculous"
      },
    ],

    qThought: '*smiles*',
  },
},
  ],
};

export default bitCity;