const realization = {
  exchanges: [
    {
      id: 'free-next',

      manualReply: true,

      messages: [
        {
          speaker: 'NAT',
          text: 'When are you free next?',
        },
        {
          speaker: 'NAT',
          text: 'We have to practice finding all the spots!!!',
        },
        {
          speaker: 'JEN',
          text: 'Miss me already lol?',
          requiresReply: true,
        },
      ],
    },

    {
      id: 'stacy',

      manualReply: true,

      messages: [
        {
          speaker: 'NAT',
          text: 'Have you fed Stacy??? Bouta call PETA',
        },
        {
          speaker: 'JEN',
          text: 'You want her fed do it yourself',
          requiresReply: true,
        },
        {
          speaker: 'NAT',
          text: 'Bet',
        },
      ],
    },

    {
      id: 'police',

      manualReply: true,

      messages: [
        {
          speaker: 'NAT',
          text: "Hey baby, work's been crazy, but the police came and its all good.",
        },
        {
          speaker: 'JEN',
          text: '???? What do you mean police?? Are you okay?',
          requiresReply: true,
        },
      ],
    },

    {
      id: 'emotional-support',

      manualReply: true,

      messages: [
        {
          speaker: 'NAT',
          text: 'Send an emotional support nude the demons are making a break for it',
        },
        {
          speaker: 'JEN',
          text: '*sends pic* You know that I can give you comfort in a normal way to?',
          requiresReply: true,
        },
      ],
    },

    {
      id: 'what-happened',

      manualReply: false,

      messages: [
        {
          speaker: 'NAT',
          text: 'Aw man aw fuck',
        },
        {
          speaker: 'JEN',
          text: 'What happened??',
          automatic: true,
        },
      ],
    },
  ],

  unsentMessage: {
    speaker: 'JEN',
    text: 'Miss you want cuddles',
  },
};

export default realization;